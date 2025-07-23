// Working Google Maps Service - No external dependencies
// This version loads Google Maps API directly via script tag

// Types
export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Route {
  start: Location;
  end: Location;
  waypoints: Location[];
  distance: number;
  duration: number;
  polyline: string;
  bounds: any;
}

export interface PlaceOfInterest {
  id: string;
  name: string;
  type: string;
  description?: string;
  rating?: number;
  distance: number;
  location: Location;
  photos?: string[];
  price?: string;
  openingHours?: string;
  tags?: string[];
  placeId: string;
}

export interface AutocompleteResult {
  placeId: string;
  description: string;
  location?: Location;
}

class GoogleMapsService {
  private google: any = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Initialize when first needed
  }

  private async ensureInitialized(): Promise<void> {
    if (this.isInitialized) return;
    
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initialize();
    return this.initPromise;
  }

  private async initialize(): Promise<void> {
    try {
      console.log('🚀 Initializing Google Maps API...');
      
      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        this.google = window.google;
        this.isInitialized = true;
        console.log('✅ Google Maps API already loaded');
        return;
      }

      // Load Google Maps API dynamically
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      console.log('🔑 Environment variables check:');
      console.log('- REACT_APP_GOOGLE_MAPS_API_KEY:', apiKey ? '✅ Found' : '❌ Missing');
      console.log('- All REACT_APP_ env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
      
      if (!apiKey) {
        throw new Error('Google Maps API key not found. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file');
      }

      console.log('📡 Loading Google Maps script...');
      
      // Create script tag to load Google Maps
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initGoogleMaps`;
      script.async = true;
      script.defer = true;

      // Set up callback
      (window as any).initGoogleMaps = () => {
        console.log('🎯 Google Maps callback triggered');
        this.google = window.google;
        this.isInitialized = true;
        console.log('✅ Google Maps API loaded successfully');
      };

      // Add script to document
      document.head.appendChild(script);
      console.log('📄 Script added to document head');

      // Wait for script to load
      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log('📥 Script loaded, waiting for callback...');
          // Wait a bit more for the callback
          setTimeout(() => {
            if (this.isInitialized) {
              console.log('🎉 Initialization complete');
              resolve();
            } else {
              console.error('❌ Google Maps failed to initialize - callback not triggered');
              reject(new Error('Google Maps failed to initialize'));
            }
          }, 3000); // Increased timeout
        };
        script.onerror = () => {
          console.error('❌ Failed to load Google Maps script');
          reject(new Error('Failed to load Google Maps script'));
        };
      });

    } catch (error) {
      console.error('❌ Failed to initialize Google Maps API:', error);
      throw error;
    }
  }

  // Get place predictions for autocomplete
  async getPlacePredictions(input: string): Promise<AutocompleteResult[]> {
    console.log('🔍 Getting place predictions for:', input);
    await this.ensureInitialized();
    console.log('✅ Google Maps initialized, creating autocomplete service...');

    return new Promise((resolve, reject) => {
      const service = new this.google.maps.places.AutocompleteService();
      console.log('🔧 Autocomplete service created, making request...');
      
      service.getPlacePredictions(
        {
          input,
          types: ['geocode', 'establishment'],
        },
        (predictions: any[], status: any) => {
          console.log('📨 Autocomplete response:', { status, predictionsCount: predictions?.length });
          if (status === this.google.maps.places.PlacesServiceStatus.OK && predictions) {
            const results: AutocompleteResult[] = predictions.map((prediction: any) => ({
              placeId: prediction.place_id,
              description: prediction.description,
            }));
            console.log('✅ Returning predictions:', results);
            resolve(results);
          } else {
            console.error('❌ Autocomplete failed with status:', status);
            reject(new Error(`Autocomplete failed: ${status}`));
          }
        }
      );
    });
  }

  // Get location details from place ID
  async getPlaceDetails(placeId: string): Promise<Location> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const service = new this.google.maps.places.PlacesService(
        new this.google.maps.Map(document.createElement('div'))
      );

      service.getDetails(
        {
          placeId,
          fields: ['geometry', 'formatted_address'],
        },
        (place: any, status: any) => {
          if (status === this.google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
            const location: Location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address,
            };
            resolve(location);
          } else {
            reject(new Error(`Place details failed: ${status}`));
          }
        }
      );
    });
  }

  // Get route between two points
  async getRoute(start: Location, end: Location, waypoints: Location[] = []): Promise<Route> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const service = new this.google.maps.DirectionsService();

      const waypointsFormatted = waypoints.map(wp => ({
        location: new this.google.maps.LatLng(wp.lat, wp.lng),
        stopover: true,
      }));

      service.route(
        {
          origin: new this.google.maps.LatLng(start.lat, start.lng),
          destination: new this.google.maps.LatLng(end.lat, end.lng),
          waypoints: waypointsFormatted,
          optimizeWaypoints: true,
          travelMode: this.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: any) => {
          if (status === this.google.maps.DirectionsStatus.OK && result) {
            const route = result.routes[0];
            const leg = route.legs[0];
            
            const routeData: Route = {
              start,
              end,
              waypoints,
              distance: leg.distance.value / 1000, // Convert to km
              duration: leg.duration.value / 60, // Convert to minutes
              polyline: route.overview_polyline,
              bounds: route.bounds,
            };
            resolve(routeData);
          } else {
            reject(new Error(`Directions failed: ${status}`));
          }
        }
      );
    });
  }

  // Search for places along a route
  async searchPlacesAlongRoute(
    route: Route,
    types: string[],
    maxDistance: number = 5
  ): Promise<PlaceOfInterest[]> {
    await this.ensureInitialized();

    const places: PlaceOfInterest[] = [];
    const routePoints = this.decodePolyline(route.polyline);
    
    // Sample points along the route for place search
    const searchPoints = this.sampleRoutePoints(routePoints, maxDistance);

    for (const point of searchPoints) {
      try {
        const nearbyPlaces = await this.searchNearbyPlaces(point, types, maxDistance * 1000);
        places.push(...nearbyPlaces);
      } catch (error) {
        console.warn(`Failed to search places at point ${point.lat}, ${point.lng}:`, error);
      }
    }

    // Remove duplicates and sort by distance
    const uniquePlaces = this.removeDuplicatePlaces(places);
    return uniquePlaces.sort((a, b) => a.distance - b.distance);
  }

  // Search for places near a specific location
  private async searchNearbyPlaces(
    location: Location,
    types: string[],
    radius: number
  ): Promise<PlaceOfInterest[]> {
    return new Promise((resolve, reject) => {
      const service = new this.google.maps.places.PlacesService(
        new this.google.maps.Map(document.createElement('div'))
      );

      const places: PlaceOfInterest[] = [];
      let completedSearches = 0;

      types.forEach(type => {
        service.nearbySearch(
          {
            location: new this.google.maps.LatLng(location.lat, location.lng),
            radius,
            type: type as any,
          },
          (results: any[], status: any) => {
            completedSearches++;
            
            if (status === this.google.maps.places.PlacesServiceStatus.OK && results) {
              results.forEach((place: any) => {
                if (place.geometry?.location) {
                  const distance = this.calculateDistance(
                    location.lat,
                    location.lng,
                    place.geometry.location.lat(),
                    place.geometry.location.lng()
                  );

                  places.push({
                    id: place.place_id,
                    placeId: place.place_id,
                    name: place.name || '',
                    type: type,
                    rating: place.rating,
                    distance,
                    location: {
                      lat: place.geometry.location.lat(),
                      lng: place.geometry.location.lng(),
                    },
                    price: place.price_level ? '$'.repeat(place.price_level) : undefined,
                    openingHours: place.opening_hours?.open_now ? 'Open Now' : 'Closed',
                    tags: place.types || [],
                  });
                }
              });
            }

            if (completedSearches === types.length) {
              resolve(places);
            }
          }
        );
      });
    });
  }

  // Decode Google Maps polyline
  private decodePolyline(encoded: string): Location[] {
    const poly: Location[] = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
      let shift = 0, result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        let b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (result >= 0x20);

      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }

    return poly;
  }

  // Sample points along a route
  private sampleRoutePoints(points: Location[], maxDistance: number): Location[] {
    const sampled: Location[] = [];

    for (let i = 0; i < points.length; i += Math.max(1, Math.floor(points.length / 10))) {
      sampled.push(points[i]);
    }

    return sampled;
  }

  // Calculate distance between two points
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Remove duplicate places based on place ID
  private removeDuplicatePlaces(places: PlaceOfInterest[]): PlaceOfInterest[] {
    const seen = new Set<string>();
    return places.filter(place => {
      if (seen.has(place.placeId)) {
        return false;
      }
      seen.add(place.placeId);
      return true;
    });
  }

  // Geocode an address
  async geocodeAddress(address: string): Promise<Location> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const geocoder = new this.google.maps.Geocoder();
      
      geocoder.geocode({ address }, (results: any[], status: any) => {
        if (status === this.google.maps.GeocoderStatus.OK && results && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address,
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();
export default googleMapsService; 
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
  isAIRecommendation?: boolean;
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
  async getRoute(
    start: Location, 
    end: Location, 
    waypoints: Location[] = [], 
    travelMode: 'driving' | 'transit' | 'walking' | 'bicycling' = 'driving'
  ): Promise<Route> {
    await this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const service = new this.google.maps.DirectionsService();

      const waypointsFormatted = waypoints.map(wp => ({
        location: new this.google.maps.LatLng(wp.lat, wp.lng),
        stopover: true,
      }));

      // Map travel mode string to Google Maps TravelMode enum
      const getTravelMode = (mode: string) => {
        switch (mode) {
          case 'driving':
            return this.google.maps.TravelMode.DRIVING;
          case 'transit':
            return this.google.maps.TravelMode.TRANSIT;
          case 'walking':
            return this.google.maps.TravelMode.WALKING;
          case 'bicycling':
            return this.google.maps.TravelMode.BICYCLING;
          default:
            return this.google.maps.TravelMode.DRIVING;
        }
      };

      const request = {
        origin: new this.google.maps.LatLng(start.lat, start.lng),
        destination: new this.google.maps.LatLng(end.lat, end.lng),
        waypoints: waypointsFormatted,
        optimizeWaypoints: true,
        travelMode: getTravelMode(travelMode),
        // Add transit options for transit mode
        ...(travelMode === 'transit' && {
          transitOptions: {
            modes: [this.google.maps.TransitMode.BUS, this.google.maps.TransitMode.TRAIN],
            routingPreference: this.google.maps.TransitRoutePreference.FEWER_TRANSFERS,
          },
        }),
      };

      service.route(request, (result: any, status: any) => {
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
      });
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
      
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  }

  // AI-Powered Place Search Methods
  async searchAIPoweredPlaces(
    route: Route,
    userPreferences: any[],
    maxDistanceMiles: number = 50
  ): Promise<PlaceOfInterest[]> {
    console.log('🤖 Starting AI-powered place search...');
    console.log('User preferences:', userPreferences);
    
    // Convert user preferences to search intents
    const searchIntents = this.convertPreferencesToSearchIntents(userPreferences);
    console.log('Search intents:', searchIntents);
    
    // Get ground-truth candidates from Google Places API
    const allCandidates = await this.getGroundTruthCandidates(route, searchIntents);
    console.log('Ground-truth candidates found:', allCandidates.length);
    
    // Filter candidates within 50 miles of route
    const filteredCandidates = this.filterCandidatesByDistance(route, allCandidates, maxDistanceMiles);
    console.log('Candidates within 50 miles:', filteredCandidates.length);
    
    // Rank candidates as "Top recommendations"
    const rankedCandidates = this.rankCandidatesAsTopRecommendations(filteredCandidates, userPreferences, route);
    console.log('Top recommendations:', rankedCandidates.length);
    
    return rankedCandidates;
  }

  private convertPreferencesToSearchIntents(userPreferences: any[]): string[] {
    const searchIntents: string[] = [];
    
    // Map user preference categories to Google Places types
    const preferenceToPlacesType: { [key: string]: string[] } = {
      restaurant: ['restaurant', 'food', 'cafe', 'bakery'],
      museum: ['museum', 'art_gallery', 'library'],
      park: ['park', 'natural_feature', 'campground'],
      shopping: ['shopping_mall', 'store', 'department_store'],
      activity: ['amusement_park', 'aquarium', 'bowling_alley', 'movie_theater'],
      lodging: ['lodging', 'hotel'],
      photography: ['tourist_attraction', 'point_of_interest', 'establishment']
    };
    
    userPreferences.forEach(pref => {
      if (pref.interestLevel >= 3) { // Only include preferences with interest level 3+
        const placesTypes = preferenceToPlacesType[pref.category] || [];
        searchIntents.push(...placesTypes);
      }
    });
    
    // Add fallback types if no preferences are set
    if (searchIntents.length === 0) {
      searchIntents.push('restaurant', 'tourist_attraction', 'park');
    }
    
    return Array.from(new Set(searchIntents)); // Remove duplicates
  }

  private async getGroundTruthCandidates(route: Route, searchIntents: string[]): Promise<PlaceOfInterest[]> {
    const allCandidates: PlaceOfInterest[] = [];
    
    // Sample points along the route for searching
    const routePoints = this.sampleRoutePoints(this.decodePolyline(route.polyline), 20);
    
    for (const point of routePoints) {
      for (const intent of searchIntents) {
        try {
          const places = await this.searchNearbyPlaces(point, [intent], 50000); // 50km radius
          allCandidates.push(...places);
        } catch (error) {
          console.warn(`Failed to search for ${intent} near ${point.lat},${point.lng}:`, error);
        }
      }
    }
    
    // Remove duplicates based on placeId
    return this.removeDuplicatePlaces(allCandidates);
  }

  private filterCandidatesByDistance(route: Route, candidates: PlaceOfInterest[], maxDistanceMiles: number): PlaceOfInterest[] {
    const maxDistanceMeters = maxDistanceMiles * 1609.34; // Convert miles to meters
    const routePoints = this.decodePolyline(route.polyline);
    
    return candidates.filter(candidate => {
      // Check if candidate is within maxDistanceMeters of any route point
      return routePoints.some(routePoint => {
        const distance = this.calculateDistance(
          routePoint.lat, routePoint.lng,
          candidate.location.lat, candidate.location.lng
        );
        return distance <= maxDistanceMeters;
      });
    });
  }

  private rankCandidatesAsTopRecommendations(candidates: PlaceOfInterest[], userPreferences: any[], route: Route): PlaceOfInterest[] {
    // Score each candidate based on user preferences and other factors
    const scoredCandidates = candidates.map(candidate => {
      let score = 0;
      
      // Base score from rating (0-5 points)
      if (candidate.rating) {
        score += candidate.rating;
      }
      
      // Preference matching score (0-5 points per matching preference)
      userPreferences.forEach(pref => {
        if (this.matchesPreference(candidate, pref)) {
          score += pref.interestLevel;
        }
      });
      
      // Distance score (closer is better, 0-3 points)
      const routePoints = this.decodePolyline(route.polyline);
      const minDistance = Math.min(...routePoints.map(point => 
        this.calculateDistance(point.lat, point.lng, candidate.location.lat, candidate.location.lng)
      ));
      score += Math.max(0, 3 - (minDistance / 1000)); // 3 points for very close, decreasing with distance
      
      // Popularity score based on photos and reviews (0-2 points)
      if (candidate.photos && candidate.photos.length > 0) {
        score += Math.min(2, candidate.photos.length / 5);
      }
      
      return { ...candidate, score };
    });
    
    // Sort by score and return top recommendations
    return scoredCandidates
      .sort((a, b) => (b as any).score - (a as any).score)
      .slice(0, 20) // Return top 20 recommendations
      .map(({ score, ...candidate }) => candidate); // Remove score from final result
  }

  private matchesPreference(candidate: PlaceOfInterest, preference: any): boolean {
    const preferenceToTypes: { [key: string]: string[] } = {
      restaurant: ['restaurant', 'food', 'cafe', 'bakery'],
      museum: ['museum', 'art_gallery', 'library'],
      park: ['park', 'natural_feature', 'campground'],
      shopping: ['shopping_mall', 'store', 'department_store'],
      activity: ['amusement_park', 'aquarium', 'bowling_alley', 'movie_theater'],
      lodging: ['lodging', 'hotel'],
      photography: ['tourist_attraction', 'point_of_interest', 'establishment']
    };
    
    const matchingTypes = preferenceToTypes[preference.category] || [];
    return matchingTypes.includes(candidate.type);
  }

  // Enhanced search method that combines AI preferences with traditional search
  async searchPlacesWithAIPreferences(
    route: Route,
    userPreferences: any[],
    traditionalTypes: string[] = []
  ): Promise<PlaceOfInterest[]> {
    console.log('🔍 Searching places with AI preferences...');
    
    // Get AI-powered recommendations
    const aiRecommendations = await this.searchAIPoweredPlaces(route, userPreferences);
    
    // Get traditional search results
    const traditionalResults = await this.searchPlacesAlongRoute(route, traditionalTypes, 5);
    
    // Combine and deduplicate results
    const allResults = [...aiRecommendations, ...traditionalResults];
    const uniqueResults = this.removeDuplicatePlaces(allResults);
    
    // Mark AI recommendations with special flag
    const markedResults = uniqueResults.map(place => ({
      ...place,
      isAIRecommendation: aiRecommendations.some(ai => ai.placeId === place.placeId)
    }));
    
    console.log('Combined results:', {
      aiRecommendations: aiRecommendations.length,
      traditionalResults: traditionalResults.length,
      uniqueResults: markedResults.length
    });
    
    return markedResults;
  }
}

// Create singleton instance
const googleMapsService = new GoogleMapsService();
export default googleMapsService; 
import googleMapsService, { 
  Location, 
  Route, 
  PlaceOfInterest, 
  AutocompleteResult 
} from './GoogleMapsService';
import geminiService, { 
  UserPreference, 
  GeminiPlaceSuggestion, 
  GeminiAnalysis,
  RouteContext
} from './GeminiService';

export interface TravelRecommendation {
  id: string;
  name: string;
  type: string;
  description: string;
  location: Location;
  distance: number;
  rating?: number;
  importance: 'Must-visit' | 'Highly recommended' | 'Worth checking out';
  whyRecommended: string;
  estimatedVisitTime?: number;
  bestTimeToVisit?: string;
  costLevel?: string;
  accessibility?: string;
  seasonalRecommendation?: string;
  tags: string[];
  source: 'google' | 'gemini';
  placeId?: string;
}

export interface EnhancedRouteAnalysis {
  route: Route;
  recommendations: TravelRecommendation[];
  aiAnalysis: GeminiAnalysis;
  routeOptimization: {
    suggestedStops: string[];
    timeAllocation: Record<string, number>;
    costEstimate: {
      total: number;
      breakdown: Record<string, number>;
    };
  };
  weatherConsiderations?: string[];
  localInsights?: string[];
}

export interface TravelPreferences {
  userPreferences: UserPreference[];
  travelPurpose?: string;
  budget?: string;
  timeConstraints?: {
    maxTotalTime?: number;
    maxStopTime?: number;
  };
  accessibility?: {
    wheelchairAccessible?: boolean;
    limitedMobility?: boolean;
  };
}

class IntegratedTravelService {
  async getComprehensiveRecommendations(
    startLocation: string,
    endLocation: string,
    transportationMode: 'driving' | 'transit' | 'walking' | 'bicycling',
    preferences: TravelPreferences
  ): Promise<EnhancedRouteAnalysis> {
    try {
      console.log('Getting comprehensive recommendations for:', startLocation, 'to', endLocation);
      
      // Step 1: Get route from Google Maps
      console.log('Getting location details for start location...');
      const startDetails = await this.getLocationDetails(startLocation);
      console.log('Start location details:', startDetails);
      
      console.log('Getting location details for end location...');
      const endDetails = await this.getLocationDetails(endLocation);
      console.log('End location details:', endDetails);
      
      console.log('Getting route from Google Maps...');
      const route = await googleMapsService.getRoute(
        startDetails,
        endDetails,
        [],
        transportationMode
      );
      console.log('Route obtained:', route);

      // Step 2: Get POIs from Google Maps
      const placeTypes = this.getPlaceTypesFromPreferences(preferences.userPreferences);
      const pois = await googleMapsService.searchPlacesAlongRoute(route, placeTypes, 5);

      // Step 3: Get AI recommendations from Gemini
      const routeContext: RouteContext = {
        startLocation,
        endLocation,
        routeDistance: route.distance,
        routeDuration: route.duration,
        transportationMode,
        travelPurpose: preferences.travelPurpose
      };

      const geminiAnalysis = await geminiService.getPersonalizedRecommendations(
        routeContext,
        preferences.userPreferences,
        pois
      );

      // Step 4: Combine and enhance recommendations
      const recommendations = this.combineRecommendations(pois, geminiAnalysis.suggestions);

      return {
        route,
        recommendations,
        aiAnalysis: geminiAnalysis,
        routeOptimization: geminiAnalysis.routeOptimization,
        weatherConsiderations: geminiAnalysis.weatherConsiderations,
        localInsights: geminiAnalysis.localInsights
      };

    } catch (error) {
      console.error('Error getting comprehensive recommendations:', error);
      throw new Error('Failed to get travel recommendations');
    }
  }

  private async getLocationDetails(location: string): Promise<Location> {
    console.log('Getting location details for:', location);
    try {
      // First try to geocode the address
      console.log('Attempting to geocode address...');
      const geocodedLocation = await googleMapsService.geocodeAddress(location);
      console.log('Geocoding successful:', geocodedLocation);
      return geocodedLocation;
    } catch (error) {
      console.log('Geocoding failed, trying place predictions...');
      // If geocoding fails, try to get place predictions
      try {
        const predictions = await googleMapsService.getPlacePredictions(location);
        console.log('Place predictions:', predictions);
        if (predictions.length > 0) {
          console.log('Getting place details for first prediction...');
          const placeDetails = await googleMapsService.getPlaceDetails(predictions[0].placeId);
          console.log('Place details obtained:', placeDetails);
          return placeDetails;
        } else {
          throw new Error(`Location not found: ${location}`);
        }
      } catch (predictionError) {
        console.error('Place prediction failed:', predictionError);
        throw new Error(`Invalid location: ${location}`);
      }
    }
  }

  private getPlaceTypesFromPreferences(preferences: UserPreference[]): string[] {
    const typeMapping: Record<string, string[]> = {
      restaurant: ['restaurant', 'food'],
      museum: ['museum', 'art_gallery'],
      park: ['park', 'natural_feature'],
      shopping: ['shopping_mall', 'store'],
      activity: ['tourist_attraction', 'amusement_park'],
      lodging: ['lodging'],
      photography: ['tourist_attraction', 'natural_feature', 'museum']
    };

    const types: string[] = [];
    preferences.forEach(pref => {
      if (pref.interestLevel >= 3) { // Only include if user is interested
        const mappedTypes = typeMapping[pref.category] || [pref.category];
        types.push(...mappedTypes);
      }
    });

    return types.length > 0 ? types : ['restaurant', 'tourist_attraction'];
  }

  private combineRecommendations(
    pois: PlaceOfInterest[], 
    geminiSuggestions: GeminiPlaceSuggestion[]
  ): TravelRecommendation[] {
    const recommendations: TravelRecommendation[] = [];

    // Add Google Maps POIs
    pois.forEach(poi => {
      recommendations.push({
        id: poi.id,
        name: poi.name,
        type: poi.type,
        description: poi.description || `${poi.type} - ${poi.distance.toFixed(1)} km away`,
        location: poi.location,
        distance: poi.distance,
        rating: poi.rating,
        importance: this.calculateImportance(poi.rating || 0, poi.distance),
        whyRecommended: `Found along your route - ${poi.type}`,
        tags: poi.tags || [poi.type],
        source: 'google',
        placeId: poi.placeId
      });
    });

    // Add Gemini AI suggestions
    geminiSuggestions.forEach(suggestion => {
      recommendations.push({
        id: suggestion.id,
        name: suggestion.name,
        type: suggestion.type,
        description: suggestion.description,
        location: suggestion.location,
        distance: suggestion.distance,
        rating: suggestion.rating,
        importance: suggestion.importance as 'Must-visit' | 'Highly recommended' | 'Worth checking out',
        whyRecommended: suggestion.whyRecommended,
        estimatedVisitTime: suggestion.estimatedVisitTime,
        bestTimeToVisit: suggestion.bestTimeToVisit,
        costLevel: suggestion.costLevel,
        accessibility: suggestion.accessibility,
        seasonalRecommendation: suggestion.seasonalRecommendation,
        tags: suggestion.tags,
        source: 'gemini'
      });
    });

    // Sort by importance and distance
    return recommendations.sort((a, b) => {
      const importanceOrder = { 'Must-visit': 3, 'Highly recommended': 2, 'Worth checking out': 1 };
      const aImportance = importanceOrder[a.importance] || 0;
      const bImportance = importanceOrder[b.importance] || 0;
      
      if (aImportance !== bImportance) {
        return bImportance - aImportance;
      }
      
      return a.distance - b.distance;
    });
  }

  private calculateImportance(rating: number, distance: number): 'Must-visit' | 'Highly recommended' | 'Worth checking out' {
    if (rating >= 4.5 && distance <= 2) return 'Must-visit';
    if (rating >= 4.0 && distance <= 5) return 'Highly recommended';
    return 'Worth checking out';
  }

  async getOptimizedRoute(
    startLocation: string,
    endLocation: string,
    selectedPlaces: TravelRecommendation[],
    transportationMode: 'driving' | 'transit' | 'walking' | 'bicycling'
  ): Promise<Route> {
    try {
      const startDetails = await this.getLocationDetails(startLocation);
      const endDetails = await this.getLocationDetails(endLocation);
      
      const waypoints = selectedPlaces.map(place => place.location);
      
      return await googleMapsService.getRoute(
        startDetails,
        endDetails,
        waypoints,
        transportationMode
      );
    } catch (error) {
      console.error('Error getting optimized route:', error);
      throw new Error('Failed to optimize route');
    }
  }

  async getWeatherAwareRecommendations(
    routeContext: RouteContext,
    preferences: TravelPreferences,
    weatherData?: any
  ): Promise<{
    weatherTips: string[];
    alternativeRecommendations: TravelRecommendation[];
  }> {
    try {
      const weatherAnalysis = await geminiService.getWeatherAwareRecommendations(
        routeContext,
        preferences.userPreferences,
        weatherData
      );

      const alternativeRecommendations = weatherAnalysis.alternativeSuggestions.map(suggestion => ({
        id: suggestion.id,
        name: suggestion.name,
        type: suggestion.type,
        description: suggestion.description,
        location: suggestion.location,
        distance: suggestion.distance,
        importance: suggestion.importance as 'Must-visit' | 'Highly recommended' | 'Worth checking out',
        whyRecommended: suggestion.whyRecommended,
        tags: suggestion.tags,
        source: 'gemini' as const
      }));

      return {
        weatherTips: weatherAnalysis.weatherTips,
        alternativeRecommendations
      };
    } catch (error) {
      console.error('Error getting weather-aware recommendations:', error);
      return {
        weatherTips: ['Check local weather before departing'],
        alternativeRecommendations: []
      };
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      return await googleMapsService.getPlaceDetails(placeId);
    } catch (error) {
      console.error('Error getting place details:', error);
      throw new Error('Failed to get place details');
    }
  }

  async getAutocompleteSuggestions(input: string): Promise<AutocompleteResult[]> {
    try {
      return await googleMapsService.getPlacePredictions(input);
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }
}

export default new IntegratedTravelService(); 
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
      
      // Check API keys first
      const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      const geminiApiKey = process.env.REACT_APP_GEMINI_API_KEY;
      
      console.log('API Keys check:');
      console.log('- Google Maps API Key:', googleMapsApiKey ? '✅ Found' : '❌ Missing');
      console.log('- Gemini API Key:', geminiApiKey ? '✅ Found' : '❌ Missing');
      
      if (!googleMapsApiKey) {
        throw new Error('Google Maps API key is missing. Please set REACT_APP_GOOGLE_MAPS_API_KEY in your .env file');
      }
      
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
      console.log('Getting POIs along route...');
      const placeTypes = this.getPlaceTypesFromPreferences(preferences.userPreferences);
      console.log('Place types to search:', placeTypes);
      const pois = await googleMapsService.searchPlacesAlongRoute(route, placeTypes, 5);
      console.log('POIs found:', pois.length);

      let geminiAnalysis: GeminiAnalysis;
      let recommendations: TravelRecommendation[];

      // Step 3: Get AI recommendations from Gemini (if available)
      if (geminiApiKey) {
        console.log('Getting AI recommendations from Gemini...');
        const routeContext: RouteContext = {
          startLocation,
          endLocation,
          routeDistance: route.distance,
          routeDuration: route.duration,
          transportationMode,
          travelPurpose: preferences.travelPurpose
        };

        try {
          geminiAnalysis = await geminiService.getPersonalizedRecommendations(
            routeContext,
            preferences.userPreferences,
            pois
          );
          console.log('Gemini analysis completed');
          
          // Step 4: Combine and enhance recommendations
          console.log('Combining recommendations...');
          recommendations = this.combineRecommendations(pois, geminiAnalysis.suggestions);
        } catch (geminiError) {
          console.warn('Gemini API failed, using fallback recommendations:', geminiError);
          // Fallback: use only Google Maps POIs with enhanced descriptions
          recommendations = this.createFallbackRecommendations(pois, preferences);
          geminiAnalysis = this.createFallbackGeminiAnalysis(route, preferences);
        }
      } else {
        console.log('Gemini API key not available, using fallback recommendations');
        // Fallback: use only Google Maps POIs with enhanced descriptions
        recommendations = this.createFallbackRecommendations(pois, preferences);
        geminiAnalysis = this.createFallbackGeminiAnalysis(route, preferences);
      }

      console.log('Total recommendations:', recommendations.length);

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
      if (error instanceof Error) {
        throw new Error(`Failed to get travel recommendations: ${error.message}`);
      } else {
        throw new Error('Failed to get travel recommendations');
      }
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

  // Fallback methods for when Gemini API is not available
  private createFallbackRecommendations(pois: PlaceOfInterest[], preferences: TravelPreferences): TravelRecommendation[] {
    return pois.map(poi => {
      const importance = this.calculateImportance(poi.rating || 0, poi.distance);
      const whyRecommended = this.generateFallbackWhyRecommended(poi, preferences);
      
      return {
        id: poi.id,
        name: poi.name,
        type: poi.type,
        description: this.generateFallbackDescription(poi),
        location: poi.location,
        distance: poi.distance,
        rating: poi.rating,
        importance,
        whyRecommended,
        estimatedVisitTime: this.estimateVisitTime(poi.type),
        bestTimeToVisit: this.getBestTimeToVisit(poi.type),
        costLevel: this.estimateCostLevel(poi.type),
        accessibility: 'Check with venue for accessibility details',
        seasonalRecommendation: 'Year-round destination',
        tags: [poi.type, 'google-maps'],
        source: 'google',
        placeId: poi.placeId
      };
    });
  }

  private createFallbackGeminiAnalysis(route: Route, preferences: TravelPreferences): GeminiAnalysis {
    const totalTime = route.duration;
    const estimatedStops = Math.min(3, Math.floor(totalTime / 60)); // Max 3 stops, one per hour
    
    return {
      suggestions: [],
      routeInsights: `This ${route.distance.toFixed(1)}-mile journey takes approximately ${Math.round(route.duration / 60)} minutes. Consider making stops along the way to explore interesting places.`,
      personalizedTips: [
        'Plan your stops in advance to maximize your travel experience',
        'Check opening hours of places you want to visit',
        'Consider traffic conditions when planning your departure time',
        'Bring water and snacks for longer journeys',
        'Have a backup plan in case some places are closed'
      ],
      routeOptimization: {
        suggestedStops: ['Rest stop', 'Food break', 'Scenic viewpoint'],
        timeAllocation: {
          'Rest stop': 15,
          'Food break': 30,
          'Scenic viewpoint': 20
        },
        costEstimate: {
          total: 50,
          breakdown: {
            food: 30,
            activities: 15,
            transportation: 5
          }
        }
      },
      weatherConsiderations: [
        'Check weather forecast before departure',
        'Pack appropriate clothing for the journey',
        'Consider indoor alternatives if weather is poor'
      ],
      localInsights: [
        'Research local customs and etiquette',
        'Learn about local cuisine and specialties',
        'Check for any local events or festivals'
      ]
    };
  }

  private generateFallbackWhyRecommended(poi: PlaceOfInterest, preferences: TravelPreferences): string {
    const userPrefs = preferences.userPreferences || [];
    const matchingPref = userPrefs.find(pref => 
      pref.category.toLowerCase().includes(poi.type.toLowerCase()) ||
      poi.type.toLowerCase().includes(pref.category.toLowerCase())
    );

    if (matchingPref) {
      return `Matches your ${matchingPref.category} interest (${matchingPref.interestLevel}/5) and is conveniently located along your route.`;
    }

    return `Found along your route and offers a great opportunity to explore the area. ${poi.rating ? `Rated ${poi.rating}/5 by visitors.` : ''}`;
  }

  private generateFallbackDescription(poi: PlaceOfInterest): string {
    const typeDescriptions: Record<string, string> = {
      restaurant: 'A dining establishment offering various cuisines and dining experiences',
      cafe: 'A casual dining spot perfect for coffee, light meals, and relaxation',
      museum: 'An educational and cultural institution showcasing exhibits and artifacts',
      park: 'A green space offering recreation, relaxation, and outdoor activities',
      shopping_mall: 'A retail complex with multiple stores and shopping opportunities',
      tourist_attraction: 'A popular destination known for its unique features and experiences',
      lodging: 'Accommodation options for travelers and visitors',
      gas_station: 'Fuel and convenience services for travelers',
      bank: 'Financial services and ATM access',
      hospital: 'Medical services and emergency care',
      pharmacy: 'Medication and health supplies',
      grocery_store: 'Food and household supplies',
      convenience_store: 'Quick access to essentials and snacks'
    };

    return typeDescriptions[poi.type] || `${poi.type} - A place of interest along your route`;
  }

  private estimateVisitTime(type: string): number {
    const visitTimes: Record<string, number> = {
      restaurant: 60,
      cafe: 30,
      museum: 90,
      park: 45,
      shopping_mall: 120,
      tourist_attraction: 60,
      lodging: 0, // Not a visit destination
      gas_station: 10,
      bank: 15,
      hospital: 0, // Not a visit destination
      pharmacy: 15,
      grocery_store: 30,
      convenience_store: 10
    };

    return visitTimes[type] || 30;
  }

  private getBestTimeToVisit(type: string): string {
    const bestTimes: Record<string, string> = {
      restaurant: 'lunch or dinner hours',
      cafe: 'morning or afternoon',
      museum: 'morning (less crowded)',
      park: 'daylight hours',
      shopping_mall: 'afternoon or evening',
      tourist_attraction: 'morning (less crowded)',
      gas_station: 'anytime',
      bank: 'business hours',
      pharmacy: 'business hours',
      grocery_store: 'morning or evening',
      convenience_store: 'anytime'
    };

    return bestTimes[type] || 'anytime';
  }

  private estimateCostLevel(type: string): string {
    const costLevels: Record<string, string> = {
      restaurant: '$$',
      cafe: '$',
      museum: '$$',
      park: 'Free',
      shopping_mall: '$$$',
      tourist_attraction: '$$',
      gas_station: '$',
      bank: 'Free',
      pharmacy: '$',
      grocery_store: '$',
      convenience_store: '$'
    };

    return costLevels[type] || '$';
  }
}

export default new IntegratedTravelService(); 
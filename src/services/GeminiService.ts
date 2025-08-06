export interface UserPreference {
  category: string;
  interestLevel: number; // 1-5 scale
  description?: string;
}

export interface GeminiPlaceSuggestion {
  id: string;
  name: string;
  type: string;
  description: string;
  importance: string;
  location: {
    lat: number;
    lng: number;
  };
  distance: number;
  rating?: number;
  tags: string[];
  whyRecommended: string;
  estimatedVisitTime?: number; // in minutes
  bestTimeToVisit?: string;
  costLevel?: string;
  accessibility?: string;
  seasonalRecommendation?: string;
}

export interface GeminiAnalysis {
  suggestions: GeminiPlaceSuggestion[];
  routeInsights: string;
  personalizedTips: string[];
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

export interface RouteContext {
  startLocation: string;
  endLocation: string;
  routeDistance: number;
  routeDuration: number;
  transportationMode: string;
  timeOfDay?: string;
  dayOfWeek?: string;
  weatherConditions?: string;
  travelPurpose?: string;
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  async getPersonalizedRecommendations(
    routeContext: RouteContext,
    userPreferences: UserPreference[],
    existingPOIs: any[]
  ): Promise<GeminiAnalysis> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (interest level: ${pref.interestLevel}/5)${pref.description ? ` - ${pref.description}` : ''}`)
      .join(', ');

    const currentTime = new Date();
    const timeOfDay = currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 17 ? 'afternoon' : 'evening';
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][currentTime.getDay()];

    const prompt = `
You are an AI travel expert specializing in personalized route planning. Analyze this journey and provide comprehensive recommendations.

ROUTE CONTEXT:
- Start: ${routeContext.startLocation}
- End: ${routeContext.endLocation}
- Distance: ${routeContext.routeDistance} miles
- Duration: ${routeContext.routeDuration} minutes
- Transportation: ${routeContext.transportationMode}
- Time of Day: ${timeOfDay}
- Day of Week: ${dayOfWeek}
- Travel Purpose: ${routeContext.travelPurpose || 'general travel'}

USER PREFERENCES:
${preferencesText}

EXISTING PLACES ALONG ROUTE:
${existingPOIs.map(poi => `- ${poi.name} (${poi.type}, rating: ${poi.rating || 'N/A'})`).join('\n')}

TASK:
Provide a comprehensive travel analysis including:

1. **Personalized Place Suggestions** (3-5 places):
   - Name, type, and detailed description
   - Why it's perfect for this specific user
   - Estimated location along the route
   - Importance level (Must-visit, Highly recommended, Worth checking out)
   - Distance from route
   - Estimated visit time
   - Best time to visit
   - Cost level ($, $$, $$$)
   - Accessibility information
   - Seasonal considerations
   - Relevant tags

2. **Route Insights**: Analysis of the journey and what makes it special

3. **Personalized Tips**: 3-5 specific tips for this user

4. **Route Optimization**:
   - Suggested stops in optimal order
   - Time allocation for each stop
   - Cost estimate breakdown

5. **Weather Considerations**: If relevant for the route

6. **Local Insights**: Cultural or local knowledge

RESPONSE FORMAT (JSON):
{
  "suggestions": [
    {
      "id": "unique_id",
      "name": "Place Name",
      "type": "restaurant/museum/park/etc",
      "description": "Detailed description",
      "importance": "Must-visit|Highly recommended|Worth checking out",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "distance": 2.5,
      "rating": 4.5,
      "tags": ["cultural", "family-friendly"],
      "whyRecommended": "Detailed explanation of why this place matches the user's preferences",
      "estimatedVisitTime": 45,
      "bestTimeToVisit": "morning|afternoon|evening",
      "costLevel": "$|$$|$$$",
      "accessibility": "wheelchair accessible|limited accessibility",
      "seasonalRecommendation": "best in spring|year-round|seasonal"
    }
  ],
  "routeInsights": "Comprehensive analysis of the route and journey",
  "personalizedTips": [
    "Specific tip 1",
    "Specific tip 2",
    "Specific tip 3"
  ],
  "routeOptimization": {
    "suggestedStops": ["Stop 1", "Stop 2", "Stop 3"],
    "timeAllocation": {
      "Stop 1": 30,
      "Stop 2": 45,
      "Stop 3": 60
    },
    "costEstimate": {
      "total": 150,
      "breakdown": {
        "food": 80,
        "activities": 50,
        "transportation": 20
      }
    }
  },
  "weatherConsiderations": [
    "Weather tip 1",
    "Weather tip 2"
  ],
  "localInsights": [
    "Local insight 1",
    "Local insight 2"
  ]
}

Focus on creating a truly personalized experience that considers the user's interests, route context, timing, and practical travel considerations.
`;

    try {
      const response = await this.callGeminiAPI(prompt);
      const parsedResponse = JSON.parse(response);
      return parsedResponse;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to get AI recommendations');
    }
  }

  async getPlaceImportance(
    placeName: string,
    placeType: string,
    userPreferences: UserPreference[],
    routeContext: RouteContext
  ): Promise<string> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (${pref.interestLevel}/5)`)
      .join(', ');

    const prompt = `
You are an AI travel expert. Analyze this place and explain its importance to this specific user.

PLACE: ${placeName} (${placeType})
USER PREFERENCES: ${preferencesText}
ROUTE CONTEXT: ${routeContext.startLocation} to ${routeContext.endLocation}
TRANSPORTATION: ${routeContext.transportationMode}
TIME: ${new Date().toLocaleTimeString()}

Provide a brief, engaging explanation (2-3 sentences) of why this place is important or interesting for this user, considering their preferences, the journey context, and current timing.

Response should be conversational and highlight what makes this place special for this specific traveler at this specific time.
`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response.trim();
    } catch (error) {
      console.error('Gemini API error:', error);
      return "This place offers a unique experience along your route.";
    }
  }

  async getRouteOptimization(
    currentRoute: any,
    selectedPlace: GeminiPlaceSuggestion,
    userPreferences: UserPreference[],
    routeContext: RouteContext
  ): Promise<{
    shouldReroute: boolean;
    reason: string;
    estimatedTimeChange: number;
    tips: string[];
    alternativeRoute?: {
      distance: number;
      duration: number;
      waypoints: any[];
    };
  }> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (${pref.interestLevel}/5)`)
      .join(', ');

    const prompt = `
You are an AI travel expert. Analyze whether adding this place to the route is worth it.

CURRENT ROUTE:
- Distance: ${currentRoute.distance} miles
- Duration: ${currentRoute.duration} minutes
- Transportation: ${routeContext.transportationMode}

SELECTED PLACE:
- Name: ${selectedPlace.name}
- Type: ${selectedPlace.type}
- Distance from route: ${selectedPlace.distance} miles
- Importance: ${selectedPlace.importance}
- Estimated visit time: ${selectedPlace.estimatedVisitTime || 30} minutes
- Cost level: ${selectedPlace.costLevel || '$$'}

USER PREFERENCES: ${preferencesText}
ROUTE CONTEXT: ${routeContext.startLocation} to ${routeContext.endLocation}

Should the user reroute to include this place? Consider:
1. How well it matches their interests
2. Time/distance impact
3. Whether it's worth the detour
4. Current time and timing considerations
5. Transportation mode constraints

RESPONSE FORMAT (JSON):
{
  "shouldReroute": true/false,
  "reason": "Clear explanation of why they should/shouldn't reroute",
  "estimatedTimeChange": 15,
  "tips": [
    "Tip 1",
    "Tip 2"
  ],
  "alternativeRoute": {
    "distance": 25.5,
    "duration": 45,
    "waypoints": [
      {"lat": 40.7128, "lng": -74.0060}
    ]
  }
}
`;

    try {
      const response = await this.callGeminiAPI(prompt);
      const parsedResponse = JSON.parse(response);
      return parsedResponse;
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        shouldReroute: false,
        reason: "Unable to analyze route optimization at this time.",
        estimatedTimeChange: 0,
        tips: []
      };
    }
  }

  async getWeatherAwareRecommendations(
    routeContext: RouteContext,
    userPreferences: UserPreference[],
    weatherData?: any
  ): Promise<{
    weatherTips: string[];
    alternativeSuggestions: GeminiPlaceSuggestion[];
  }> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (${pref.interestLevel}/5)`)
      .join(', ');

    const weatherInfo = weatherData ? 
      `Weather: ${weatherData.condition}, Temperature: ${weatherData.temperature}°F, Precipitation: ${weatherData.precipitation}%` : 
      'Weather data not available';

    const prompt = `
You are an AI travel expert. Provide weather-aware recommendations for this journey.

ROUTE: ${routeContext.startLocation} to ${routeContext.endLocation}
TRANSPORTATION: ${routeContext.transportationMode}
${weatherInfo}

USER PREFERENCES: ${preferencesText}

Provide:
1. Weather-specific travel tips (3-5 tips)
2. Alternative indoor/weather-appropriate place suggestions if weather is challenging

RESPONSE FORMAT (JSON):
{
  "weatherTips": [
    "Weather tip 1",
    "Weather tip 2",
    "Weather tip 3"
  ],
  "alternativeSuggestions": [
    {
      "id": "weather_alt_1",
      "name": "Alternative Place Name",
      "type": "indoor_activity",
      "description": "Weather-appropriate alternative",
      "importance": "Highly recommended",
      "location": {"lat": 40.7128, "lng": -74.0060},
      "distance": 1.5,
      "tags": ["indoor", "weather-safe"],
      "whyRecommended": "Perfect for current weather conditions"
    }
  ]
}
`;

    try {
      const response = await this.callGeminiAPI(prompt);
      const parsedResponse = JSON.parse(response);
      return parsedResponse;
    } catch (error) {
      console.error('Gemini API error:', error);
      return {
        weatherTips: ["Check local weather before departing"],
        alternativeSuggestions: []
      };
    }
  }
}

export default new GeminiService(); 
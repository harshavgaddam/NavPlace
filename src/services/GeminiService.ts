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
}

export interface GeminiAnalysis {
  suggestions: GeminiPlaceSuggestion[];
  routeInsights: string;
  personalizedTips: string[];
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
    startLocation: string,
    endLocation: string,
    routeDistance: number,
    routeDuration: number,
    transportationMode: string,
    userPreferences: UserPreference[],
    existingPOIs: any[]
  ): Promise<GeminiAnalysis> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (interest level: ${pref.interestLevel}/5)${pref.description ? ` - ${pref.description}` : ''}`)
      .join(', ');

    const prompt = `
You are an AI travel expert. Analyze this route and provide personalized place recommendations.

ROUTE DETAILS:
- Start: ${startLocation}
- End: ${endLocation}
- Distance: ${routeDistance} miles
- Duration: ${routeDuration} minutes
- Transportation: ${transportationMode}

USER PREFERENCES:
${preferencesText}

EXISTING PLACES ALONG ROUTE:
${existingPOIs.map(poi => `- ${poi.name} (${poi.type})`).join('\n')}

TASK:
1. Analyze the route and user preferences
2. Suggest 3-5 additional places that would be perfect for this user
3. For each suggestion, provide:
   - Name and type
   - Why it's recommended for this specific user
   - Estimated location along the route
   - Importance level (Must-visit, Highly recommended, Worth checking out)
   - Distance from route
   - Relevant tags

RESPONSE FORMAT (JSON):
{
  "suggestions": [
    {
      "id": "unique_id",
      "name": "Place Name",
      "type": "restaurant/museum/park/etc",
      "description": "Brief description",
      "importance": "Must-visit|Highly recommended|Worth checking out",
      "location": {
        "lat": 40.7128,
        "lng": -74.0060
      },
      "distance": 2.5,
      "rating": 4.5,
      "tags": ["cultural", "family-friendly"],
      "whyRecommended": "Detailed explanation of why this place matches the user's preferences"
    }
  ],
  "routeInsights": "Brief analysis of the route and what makes it special",
  "personalizedTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}

Focus on places that truly match the user's interests and would enhance their journey. Consider the route context and transportation mode.
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
    routeContext: string
  ): Promise<string> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (${pref.interestLevel}/5)`)
      .join(', ');

    const prompt = `
You are an AI travel expert. Analyze this place and explain its importance to this specific user.

PLACE: ${placeName} (${placeType})
USER PREFERENCES: ${preferencesText}
ROUTE CONTEXT: ${routeContext}

Provide a brief, engaging explanation (2-3 sentences) of why this place is important or interesting for this user, considering their preferences and the journey context.

Response should be conversational and highlight what makes this place special for this specific traveler.
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
    userPreferences: UserPreference[]
  ): Promise<{
    shouldReroute: boolean;
    reason: string;
    estimatedTimeChange: number;
    tips: string[];
  }> {
    const preferencesText = userPreferences
      .map(pref => `${pref.category} (${pref.interestLevel}/5)`)
      .join(', ');

    const prompt = `
You are an AI travel expert. Analyze whether adding this place to the route is worth it.

CURRENT ROUTE:
- Distance: ${currentRoute.distance} miles
- Duration: ${currentRoute.duration} minutes

SELECTED PLACE:
- Name: ${selectedPlace.name}
- Type: ${selectedPlace.type}
- Distance from route: ${selectedPlace.distance} miles
- Importance: ${selectedPlace.importance}

USER PREFERENCES: ${preferencesText}

Should the user reroute to include this place? Consider:
1. How well it matches their interests
2. Time/distance impact
3. Whether it's worth the detour

RESPONSE FORMAT (JSON):
{
  "shouldReroute": true/false,
  "reason": "Clear explanation of why they should/shouldn't reroute",
  "estimatedTimeChange": 15,
  "tips": [
    "Tip 1",
    "Tip 2"
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
        shouldReroute: false,
        reason: "Unable to analyze route optimization at this time.",
        estimatedTimeChange: 0,
        tips: []
      };
    }
  }
}

export default new GeminiService(); 
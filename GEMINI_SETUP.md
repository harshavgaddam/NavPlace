# Gemini AI Integration Setup

This guide explains how to set up the Gemini AI integration for personalized travel recommendations.

## Prerequisites

1. Google Cloud Project with Gemini API enabled
2. Gemini API key

## Setup Steps

### 1. Enable Gemini API

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 2. Environment Variables

Add your Gemini API key to your `.env` file:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Features

The Gemini integration provides:

#### AI-Powered Recommendations
- **Personalized Suggestions**: Based on user preferences (1-5 scale for different categories)
- **Route Analysis**: AI analyzes the route and provides insights
- **Context-Aware Tips**: Personalized travel tips based on route and preferences

#### User Preferences
- **Restaurants & Food**: Culinary experiences and dining options
- **Museums & Culture**: Historical sites and cultural attractions
- **Parks & Nature**: Outdoor spaces and natural attractions
- **Shopping & Retail**: Shopping centers and retail experiences
- **Activities & Entertainment**: Entertainment venues and activities
- **Hotels & Accommodation**: Places to stay and accommodation options
- **Photography & Scenic**: Scenic spots and photo opportunities

#### Interactive Features
- **Clickable AI Markers**: Click on map markers to see detailed place information
- **Importance Analysis**: AI explains why each place is recommended for the user
- **Route Optimization**: AI suggests whether to reroute to include a place
- **Personalized Tips**: Context-aware travel advice

### 4. How It Works

1. **User Sets Preferences**: Users adjust interest levels (1-5) for different categories
2. **Route Planning**: When a route is planned, the system:
   - Gets basic POIs from Google Maps
   - Sends route + preferences to Gemini API
   - Receives personalized AI recommendations
3. **Interactive Map**: AI suggestions appear as special markers on the map
4. **Place Details**: Clicking markers shows AI-generated importance explanations
5. **Route Optimization**: AI analyzes whether adding a place is worth the detour

### 5. API Endpoints Used

- **Gemini Pro**: For generating personalized recommendations and analysis
- **Google Maps**: For route planning and basic POI data

### 6. Error Handling

The system gracefully handles:
- Missing API keys
- API rate limits
- Network errors
- Invalid responses

### 7. Customization

You can customize:
- **Preference Categories**: Add/remove categories in `PreferencesPanel.tsx`
- **AI Prompts**: Modify prompts in `GeminiService.ts`
- **Marker Colors**: Adjust colors based on importance levels
- **Response Format**: Change the JSON structure for AI responses

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the API key is correct
   - Check if Gemini API is enabled in your Google Cloud project
   - Ensure billing is set up

2. **No AI Recommendations**
   - Check browser console for errors
   - Verify network connectivity
   - Check API quotas and limits

3. **Slow Response Times**
   - Consider implementing caching
   - Optimize API prompts
   - Use request debouncing

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
REACT_APP_DEBUG=true
```

This will log API requests and responses to the console.

## Security Notes

- Never expose API keys in client-side code
- Use environment variables for all API keys
- Consider implementing rate limiting
- Monitor API usage and costs

## Cost Considerations

- Gemini API has usage-based pricing
- Monitor your API usage in Google Cloud Console
- Consider implementing caching to reduce API calls
- Set up billing alerts to avoid unexpected charges 
# Gemini API Setup for Vercel Deployment

## Overview
This guide explains how to integrate the Gemini API with your NavPlaces application deployed on Vercel. The Gemini API provides AI-powered travel recommendations based on user preferences.

## Features
- **Personalized Recommendations**: AI suggests places based on user interest levels
- **Route Analysis**: Analyzes routes and provides insights
- **Place Importance**: Explains why specific places are recommended
- **Route Optimization**: Suggests whether to reroute to include recommended places

## Setup Steps

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment Variables in Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to your Vercel dashboard
2. Select your NavPlaces project
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:
   - **Name**: `REACT_APP_GEMINI_API_KEY`
   - **Value**: Your Gemini API key
   - **Environment**: Production (and Preview if needed)
5. Click **Save**

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variable
vercel env add REACT_APP_GEMINI_API_KEY

# Deploy with environment variables
vercel --prod
```

### 3. Verify Configuration
After setting up the environment variable, redeploy your application:
```bash
vercel --prod
```

## How It Works

### 1. User Preferences
Users can set interest levels (1-5) for different categories:
- Restaurants
- Museums
- Parks
- Shopping
- Entertainment
- Historical Sites

### 2. AI Recommendations
When a user plans a route:
1. The app gets Google Places POIs
2. Sends route details + user preferences to Gemini API
3. Gemini analyzes and suggests personalized places
4. Suggestions appear on the map with color-coded importance

### 3. Place Details
When users click on AI-suggested places:
- Shows detailed information
- Displays AI analysis of why it's recommended
- Offers rerouting options

## API Endpoints Used

### Gemini API
- **Base URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`
- **Method**: POST
- **Authentication**: API Key in query parameter

### Request Format
```json
{
  "contents": [{
    "parts": [{
      "text": "Your prompt here"
    }]
  }]
}
```

## Error Handling

The application handles various error scenarios:
- Missing API key
- Network errors
- Invalid API responses
- Rate limiting

## Customization

### Modifying Prompts
Edit the prompts in `src/services/GeminiService.ts`:
- `getPersonalizedRecommendations()` - Main recommendation logic
- `getPlaceImportance()` - Place analysis
- `getRouteOptimization()` - Rerouting suggestions

### Adding New Categories
1. Update `PreferencesPanel.tsx` with new categories
2. Modify prompts in `GeminiService.ts`
3. Update UI components as needed

## Troubleshooting

### Common Issues

#### 1. "Gemini API key not configured"
- **Solution**: Ensure `REACT_APP_GEMINI_API_KEY` is set in Vercel environment variables
- **Check**: Verify the variable name is exactly as shown

#### 2. API calls failing
- **Solution**: Check your API key is valid and has proper permissions
- **Check**: Verify you're using the correct Gemini API endpoint

#### 3. No recommendations appearing
- **Solution**: Check browser console for errors
- **Check**: Ensure user has set some preferences

#### 4. CORS issues
- **Solution**: Gemini API supports CORS, but check your Vercel configuration
- **Check**: Ensure your domain is properly configured

### Debug Mode
Enable debug logging by adding this to your browser console:
```javascript
localStorage.setItem('debug_gemini', 'true');
```

## Security Notes

1. **API Key Security**: Never commit API keys to your repository
2. **Environment Variables**: Always use environment variables for sensitive data
3. **Rate Limiting**: Be aware of Gemini API rate limits
4. **Data Privacy**: User preferences are stored locally, not sent to external services

## Cost Considerations

- **Gemini API Pricing**: Check [Google AI Studio pricing](https://ai.google.dev/pricing)
- **Usage Monitoring**: Monitor API usage in Google AI Studio dashboard
- **Optimization**: Consider caching responses to reduce API calls

## Testing

### Local Testing
1. Create `.env.local` file in your project root
2. Add: `REACT_APP_GEMINI_API_KEY=your_api_key_here`
3. Run `npm start`

### Production Testing
1. Deploy to Vercel with environment variables
2. Test the preferences panel
3. Plan a route and verify AI recommendations appear
4. Click on AI-suggested places to test place details modal

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables in Vercel dashboard
3. Test API key directly in Google AI Studio
4. Check network tab for failed requests

## Next Steps

After successful setup:
1. Test all features thoroughly
2. Monitor API usage and costs
3. Consider adding more preference categories
4. Implement caching for better performance
5. Add analytics to track feature usage 
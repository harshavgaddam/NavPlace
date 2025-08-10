# API Setup Guide - Fix for "Failed to get travel recommendations" Error

## Problem Solved ✅

The error "Failed to get travel recommendations: Failed to get AI recommendations" has been fixed! The application now gracefully handles missing API keys and provides fallback functionality.

## What Changed

1. **Graceful API Key Handling**: The app no longer crashes when Gemini API key is missing
2. **Fallback Recommendations**: When Gemini API is unavailable, the app provides enhanced Google Maps recommendations
3. **Better Error Messages**: More informative error messages guide users on what's needed
4. **Optional AI Features**: AI-powered recommendations are now optional, not required

## Environment Variables Setup

### Required: Google Maps API Key
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**How to get it:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

### Optional: Gemini API Key (for AI recommendations)
```bash
REACT_APP_GEMINI_API_KEY=your_gemini_api_key_here
```

**How to get it:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## Setup Instructions

### Option 1: Local Development (.env.local)
1. Create a file named `.env.local` in your project root
2. Add your API keys:
```bash
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_google_maps_key
REACT_APP_GEMINI_API_KEY=your_actual_gemini_key
```
3. Restart your development server: `npm start`

### Option 2: Vercel Deployment
1. Go to your Vercel dashboard
2. Select your NavPlaces project
3. Go to **Settings** → **Environment Variables**
4. Add both environment variables
5. Redeploy your application

## What Works Now

### With Only Google Maps API Key:
- ✅ Route planning and directions
- ✅ Place search and autocomplete
- ✅ Enhanced POI recommendations
- ✅ Basic travel suggestions
- ✅ Map display and navigation

### With Both API Keys:
- ✅ All above features
- ✅ AI-powered personalized recommendations
- ✅ Advanced route analysis
- ✅ Context-aware suggestions
- ✅ Weather-aware planning

## Error Messages Explained

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Google Maps API key is missing" | No Google Maps API key | Add `REACT_APP_GOOGLE_MAPS_API_KEY` |
| "Unable to get travel recommendations" | Gemini API unavailable | Add `REACT_APP_GEMINI_API_KEY` (optional) |
| "Failed to plan route" | Network or API issue | Check internet connection and API key validity |

## Testing Your Setup

1. **Basic Functionality Test:**
   - Enter start and end locations
   - Click "Plan Route"
   - Should show route and basic recommendations

2. **AI Features Test:**
   - Set user preferences
   - Plan a route
   - Should show AI-powered recommendations (if Gemini API key is set)

## Troubleshooting

### Common Issues:

1. **"API key not valid"**
   - Check that your API key is correct
   - Ensure the APIs are enabled in Google Cloud Console
   - Verify domain restrictions if any

2. **"Quota exceeded"**
   - Check your Google Cloud billing
   - Monitor API usage in Google Cloud Console

3. **"CORS error"**
   - Ensure your domain is allowed in API key restrictions
   - Check that you're using the correct API endpoints

### Debug Mode:
Add this to your browser console to see detailed logs:
```javascript
localStorage.setItem('debug_navplaces', 'true');
```

## Security Notes

- Never commit API keys to your repository
- Use environment variables for all sensitive data
- Restrict API keys to specific domains/IPs
- Monitor API usage to control costs

## Cost Considerations

- **Google Maps API**: Free tier available, then pay-per-use
- **Gemini API**: Free tier available, then pay-per-use
- Monitor usage in respective dashboards

## Support

If you still encounter issues:
1. Check browser console for detailed error messages
2. Verify API keys are correctly set
3. Test API keys directly in their respective consoles
4. Check network tab for failed requests

---

**The application now works reliably with or without the Gemini API key!** 🎉 
# 🚀 Quick Setup Guide - NavPlace

## ⚡ Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
4. Create API credentials (API Key)
5. Copy the API key

### 3. Create Environment File
Create a `.env` file in the root directory:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 4. Start the Application
```bash
npm start
```

### 5. Test the Features
- Navigate to **Route Planner** page
- Enter start and end locations
- See autocomplete suggestions
- Plan a route and discover POIs

## 🎯 What's Working Now

✅ **Real Google Maps Integration**  
✅ **Autocomplete Location Search**  
✅ **Route Planning with Directions**  
✅ **POI Discovery Along Routes**  
✅ **Interactive Map Display**  
✅ **Light/Dark Theme Support**  
✅ **Responsive Design**  

## 🔧 Troubleshooting

### "Google Maps API not initialized"
- Check your API key in `.env` file
- Ensure all required APIs are enabled
- Verify API key restrictions

### No autocomplete suggestions
- Make sure Places API is enabled
- Check browser console for errors
- Verify API key permissions

### Route planning fails
- Ensure Directions API is enabled
- Check that locations are valid
- Verify API key restrictions

## 📱 Next Steps

1. **Test Route Planning** - Try planning routes between different cities
2. **Explore POIs** - Click on map markers to see place details
3. **Customize Preferences** - Set your interests in the Preferences page
4. **Deploy** - Ready for production deployment

## 🎨 Customization

### Change POI Types
Edit `src/pages/RoutePlanner.tsx` line ~200:
```typescript
const placeTypes = ['restaurant', 'museum', 'park', 'shopping_mall', 'tourist_attraction'];
```

### Adjust Search Radius
Edit `src/pages/RoutePlanner.tsx` line ~205:
```typescript
const pois = await googleMapsService.searchPlacesAlongRoute(route, placeTypes, 5); // 5km radius
```

### Modify Theme Colors
Edit `src/index.css` CSS variables for custom colors.

---

**Need help?** Check the detailed `GOOGLE_MAPS_SETUP.md` guide or create an issue. 
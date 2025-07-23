# 🗺️ Google Maps API Setup Guide

This guide will help you set up the Google Maps API for NavPlace.

## 📋 Prerequisites

- Google account
- Basic knowledge of Google Cloud Console

## 🚀 Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "NavPlace")
5. Click "Create"

### 2. Enable Required APIs

Navigate to the **APIs & Services > Library** section and enable these APIs:

#### Maps JavaScript API
- Search for "Maps JavaScript API"
- Click on it and press "Enable"

#### Places API
- Search for "Places API"
- Click on it and press "Enable"

#### Directions API
- Search for "Directions API"
- Click on it and press "Enable"

#### Geocoding API
- Search for "Geocoding API"
- Click on it and press "Enable"

### 3. Create API Credentials

1. Go to **APIs & Services > Credentials**
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

### 4. Restrict the API Key (Recommended)

For security, restrict your API key:

1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domains:
   - `localhost:3000/*` (for development)
   - `yourdomain.com/*` (for production)
4. Under "API restrictions", select "Restrict key"
5. Select all the APIs you enabled above
6. Click "Save"

## 🔧 **Step 5: Configure Environment Variables**

### **Create the `.env` file:**

1. **In your project root directory** (`D:\NavPlaces`), create a new file called `.env`

2. **Add this content to the `.env` file:**
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

3. **Replace `your_actual_api_key_here`** with the actual API key you got from Google Cloud Console

### **Example:**
If your API key is `AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz`, your `.env` file should look like:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrstuvwxyz
```

### **Important Notes:**
- ✅ **No quotes** around the API key
- ✅ **No spaces** around the `=` sign
- ✅ **Must start with `REACT_APP_`** for React to recognize it
- ✅ **Save the file** in the root directory (same level as `package.json`)

### **After creating the `.env` file:**

1. **Restart your development server** (if it's running):
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   npm start
   ```

2. **Test the functionality:**
   - Go to the **Route Planner** page
   - Try entering a location in the search fields
   - You should see autocomplete suggestions appear

### **File Structure:**
Your project should now look like this:
```
NavPlaces/
├── .env                    ← Your new file with API key
├── package.json
├── src/
├── README.md
└── ...
```

Once you've created the `.env` file with your API key, the Google Maps integration will work and you'll be able to:
- ✅ Use autocomplete search for locations
- ✅ Plan real routes with Google Directions
- ✅ Discover POIs along your routes
- ✅ See interactive maps with markers

Let me know when you've created the `.env` file and I can help you test the functionality!

### 6. Test the Setup

1. Start your development server: `npm start`
2. Navigate to the Route Planner page
3. Try entering a location in the search fields
4. You should see autocomplete suggestions

## 🔧 Troubleshooting

### Common Issues

#### "Google Maps API not initialized"
- Check that your API key is correct
- Ensure all required APIs are enabled
- Verify the API key has proper restrictions

#### "Autocomplete failed"
- Make sure Places API is enabled
- Check API key restrictions
- Verify billing is set up (if required)

#### "Directions failed"
- Ensure Directions API is enabled
- Check API key permissions
- Verify the locations are valid

### Billing Setup

Google Maps APIs have usage limits. For production use:

1. Go to **Billing** in Google Cloud Console
2. Link a billing account to your project
3. Set up billing alerts to monitor usage

### Usage Limits

- **Maps JavaScript API**: 25,000 map loads per day
- **Places API**: 1,000 requests per day
- **Directions API**: 2,500 requests per day
- **Geocoding API**: 2,500 requests per day

## 🛡️ Security Best Practices

1. **Always restrict API keys** to specific domains
2. **Use environment variables** for API keys
3. **Monitor usage** to prevent unexpected charges
4. **Rotate keys** periodically
5. **Use HTTPS** in production

## 📱 Production Deployment

When deploying to production:

1. Update API key restrictions to include your production domain
2. Remove `localhost` from allowed referrers
3. Set up proper billing
4. Monitor API usage

## 🔗 Useful Links

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
- [Usage Limits](https://developers.google.com/maps/usage)
- [Billing Setup](https://developers.google.com/maps/billing)

## 💡 Tips

- Start with a test project to avoid charges during development
- Use the Google Cloud Console to monitor API usage
- Set up billing alerts to avoid unexpected charges
- Consider using different API keys for development and production

---

**Need help?** Check the main README or create an issue in the repository. 
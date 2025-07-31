// Gemini API Test Utility
// Run this in browser console to test Gemini API integration

export const testGeminiAPI = async () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Gemini API key not found in environment variables');
    console.log('Make sure to set REACT_APP_GEMINI_API_KEY in Vercel environment variables');
    return false;
  }

  console.log('🔍 Testing Gemini API integration...');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello! Please respond with "Gemini API is working correctly" if you can read this message.'
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.candidates[0].content.parts[0].text;
    
    console.log('✅ Gemini API is working correctly!');
    console.log('Response:', result);
    return true;
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    console.log('Please check:');
    console.log('1. API key is correctly set in Vercel environment variables');
    console.log('2. API key has proper permissions');
    console.log('3. No network connectivity issues');
    return false;
  }
};

// Test function for preferences
export const testPreferences = () => {
  const preferences = [
    { category: 'Restaurants', interestLevel: 4 },
    { category: 'Museums', interestLevel: 3 },
    { category: 'Parks', interestLevel: 5 }
  ];
  
  console.log('📊 Test preferences:', preferences);
  return preferences;
};

// Test function for route data
export const testRouteData = () => {
  return {
    startLocation: 'New York, NY',
    endLocation: 'Boston, MA',
    routeDistance: 215,
    routeDuration: 240,
    transportationMode: 'driving',
    userPreferences: testPreferences(),
    existingPOIs: [
      { name: 'Central Park', type: 'Park' },
      { name: 'Metropolitan Museum', type: 'Museum' }
    ]
  };
};

// Usage in browser console:
// import { testGeminiAPI, testRouteData } from './src/utils/geminiTest.js';
// testGeminiAPI().then(result => console.log('Test result:', result)); 
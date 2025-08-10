// API Verification Utility for NavPlaces
// Run this in your browser console on the deployed site

const verifyAPIs = async () => {
  console.log('🔍 NavPlaces API Verification');
  console.log('==============================');
  
  // Check environment variables
  const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const geminiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  console.log('📋 Environment Variables:');
  console.log('- Google Maps API Key:', googleMapsKey ? '✅ Found' : '❌ Missing');
  console.log('- Gemini API Key:', geminiKey ? '✅ Found' : '❌ Missing');
  
  // Test Google Maps API
  if (googleMapsKey) {
    try {
      console.log('\n🗺️ Testing Google Maps API...');
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=New%20York&key=${googleMapsKey}`);
      const data = await response.json();
      
      if (data.status === 'OK') {
        console.log('✅ Google Maps API: Working correctly');
      } else {
        console.log('❌ Google Maps API Error:', data.status, data.error_message);
      }
    } catch (error) {
      console.log('❌ Google Maps API: Network error', error.message);
    }
  }
  
  // Test Gemini API
  if (geminiKey) {
    try {
      console.log('\n🤖 Testing Gemini API...');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Hello, this is a test message.'
            }]
          }]
        })
      });
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]) {
        console.log('✅ Gemini API: Working correctly');
      } else {
        console.log('❌ Gemini API Error:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.log('❌ Gemini API: Network error', error.message);
    }
  }
  
  // Check localStorage for preferences
  console.log('\n💾 Local Storage:');
  const savedPreferences = localStorage.getItem('navplaces_user_preferences');
  if (savedPreferences) {
    try {
      const parsed = JSON.parse(savedPreferences);
      console.log('✅ User preferences found:', parsed.userPreferences?.length || 0, 'categories');
    } catch (error) {
      console.log('❌ Corrupted preferences data');
    }
  } else {
    console.log('ℹ️ No saved preferences found');
  }
  
  console.log('\n🎯 Recommendations:');
  if (!googleMapsKey) {
    console.log('⚠️ Add REACT_APP_GOOGLE_MAPS_API_KEY to Vercel environment variables');
  }
  if (!geminiKey) {
    console.log('⚠️ Add REACT_APP_GEMINI_API_KEY to Vercel environment variables for AI features');
  }
  if (googleMapsKey && geminiKey) {
    console.log('✅ All APIs configured - AI features should work!');
  }
};

// Auto-run verification
verifyAPIs();

// Export for manual use
window.verifyNavPlacesAPIs = verifyAPIs; 
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import googleMapsService from '../services/GoogleMapsService';

const GoogleMapsTest: React.FC = () => {
  const [status, setStatus] = useState<string>('Testing...');
  const [error, setError] = useState<string>('');
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    // Direct environment variable check
    console.log('=== DIRECT ENV CHECK ===');
    console.log('process.env.REACT_APP_GOOGLE_MAPS_API_KEY:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    console.log('All REACT_APP_ env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    console.log('========================');
    
    testGoogleMapsAPI();
  }, []);

  const testGoogleMapsAPI = async () => {
    try {
      setStatus('Testing Google Maps API initialization...');
      
      // Test autocomplete
      const results = await googleMapsService.getPlacePredictions('orlando');
      
      setPredictions(results);
      setStatus(`✅ Google Maps API working! Found ${results.length} predictions for "orlando"`);
    } catch (err: any) {
      setError(`❌ Google Maps API failed: ${err.message}`);
      setStatus('Failed');
    }
  };

  return (
    <Box sx={{ p: 3, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Google Maps API Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        {status}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {predictions.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Sample predictions for "orlando":
          </Typography>
          <ul>
            {predictions.slice(0, 3).map((pred, index) => (
              <li key={index}>{pred.description}</li>
            ))}
          </ul>
        </Box>
      )}

      <Button 
        variant="contained" 
        onClick={testGoogleMapsAPI}
        sx={{ mt: 2 }}
      >
        Test Again
      </Button>
    </Box>
  );
};

export default GoogleMapsTest; 
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  Avatar,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
// import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MuseumIcon from '@mui/icons-material/Museum';
import ParkIcon from '@mui/icons-material/Park';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HotelIcon from '@mui/icons-material/Hotel';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StraightenIcon from '@mui/icons-material/Straighten';
import SpeedIcon from '@mui/icons-material/Speed';
import ShareIcon from '@mui/icons-material/Share';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExploreIcon from '@mui/icons-material/Explore';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import TrainIcon from '@mui/icons-material/Train';

import integratedTravelService, { 
  TravelRecommendation, 
  EnhancedRouteAnalysis,
  TravelPreferences
} from '../services/IntegratedTravelService';
import { UserPreference } from '../services/GeminiService';
import { Location, Route, PlaceOfInterest, AutocompleteResult } from '../services/GoogleMapsService';
import PreferencesPanel from '../components/PreferencesPanel';
import PlaceDetailsModal from '../components/PlaceDetailsModal';

// Types
interface RoutePlannerState {
  startLocation: string;
  endLocation: string;
  startLocationDetails: Location | null;
  endLocationDetails: Location | null;
  route: Route | null;
  recommendations: TravelRecommendation[];
  loading: boolean;
  error: string;
  startPredictions: AutocompleteResult[];
  endPredictions: AutocompleteResult[];
  showStartPredictions: boolean;
  showEndPredictions: boolean;
  transportationMode: 'driving' | 'transit' | 'walking' | 'bicycling';
  userPreferences: UserPreference[];
  enhancedAnalysis: EnhancedRouteAnalysis | null;
  showPreferences: boolean;
  selectedPlace: TravelRecommendation | null;
  showPlaceModal: boolean;
}

// Transportation mode options
const transportationModes = [
  {
    value: 'driving',
    label: 'Car',
    icon: <DirectionsCarIcon sx={{ fontSize: '1.75rem' }} />,
    description: 'Fastest route',
    color: '#0ea5e9',
  },
  {
    value: 'transit',
    label: 'Transit',
    icon: <DirectionsBusIcon sx={{ fontSize: '1.75rem' }} />,
    description: 'Public transport',
    color: '#8b5cf6',
  },
  {
    value: 'walking',
    label: 'Walking',
    icon: <DirectionsWalkIcon sx={{ fontSize: '1.75rem' }} />,
    description: 'Walking route',
    color: '#10b981',
  },
  {
    value: 'bicycling',
    label: 'Bicycle',
    icon: <DirectionsBikeIcon sx={{ fontSize: '1.75rem' }} />,
    description: 'Bike route',
    color: '#f59e0b',
  },
];

// Add debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const RoutePlanner: React.FC = () => {
  const [state, setState] = useState<RoutePlannerState>({
    startLocation: '',
    endLocation: '',
    startLocationDetails: null,
    endLocationDetails: null,
    route: null,
    recommendations: [],
    loading: false,
    error: '',
    startPredictions: [],
    endPredictions: [],
    showStartPredictions: false,
    showEndPredictions: false,
    transportationMode: 'driving',
    userPreferences: [], // Start with empty preferences
    enhancedAnalysis: null,
    showPreferences: false,
    selectedPlace: null,
    showPlaceModal: false,
  });
  const [startLoading, setStartLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');
  const [isUpdatingAI, setIsUpdatingAI] = useState(false);

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // Load saved preferences on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('navplaces_user_preferences');
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        if (parsed.userPreferences && parsed.userPreferences.length > 0) {
          setState(prev => ({
            ...prev,
            userPreferences: parsed.userPreferences
          }));
          console.log('Loaded saved preferences:', parsed.userPreferences);
        }
      } catch (error) {
        console.error('Error loading saved preferences:', error);
      }
    }
  }, []);

  // Debounced handlers
  const debouncedStart = useRef(
    debounce(async (value: string) => {
      if (value.length > 2) {
        setStartLoading(true);
        setStartError('');
        try {
          const predictions = await integratedTravelService.getAutocompleteSuggestions(value);
          setState(prev => ({
            ...prev,
            startPredictions: predictions.slice(0, 5),
            showStartPredictions: true
          }));
        } catch (error: any) {
          setStartError(error.message || 'Autocomplete error');
          setState(prev => ({
            ...prev,
            startPredictions: [],
            showStartPredictions: false
          }));
        } finally {
          setStartLoading(false);
        }
      } else {
        setState(prev => ({
          ...prev,
          startPredictions: [],
          showStartPredictions: false
        }));
        setStartLoading(false);
        setStartError('');
      }
    }, 300)
  ).current;

  const debouncedEnd = useRef(
    debounce(async (value: string) => {
      if (value.length > 2) {
        setEndLoading(true);
        setEndError('');
        try {
          const predictions = await integratedTravelService.getAutocompleteSuggestions(value);
          setState(prev => ({
            ...prev,
            endPredictions: predictions.slice(0, 5),
            showEndPredictions: true
          }));
        } catch (error: any) {
          setEndError(error.message || 'Autocomplete error');
          setState(prev => ({
            ...prev,
            endPredictions: [],
            showEndPredictions: false
          }));
        } finally {
          setEndLoading(false);
        }
      } else {
        setState(prev => ({
          ...prev,
          endPredictions: [],
          showEndPredictions: false
        }));
        setEndLoading(false);
        setEndError('');
      }
    }, 300)
  ).current;

  // Handle autocomplete for start location
  const handleStartLocationChange = (value: string) => {
    setState(prev => ({ ...prev, startLocation: value, showStartPredictions: true }));
    debouncedStart(value);
  };

  // Handle autocomplete for end location
  const handleEndLocationChange = (value: string) => {
    setState(prev => ({ ...prev, endLocation: value, showEndPredictions: true }));
    debouncedEnd(value);
  };

  // Handle prediction selection
  const handlePredictionSelect = async (prediction: AutocompleteResult, isStart: boolean) => {
    try {
      if (isStart) setStartLoading(true); else setEndLoading(true);
      const locationDetails = await integratedTravelService.getPlaceDetails(prediction.placeId);
      if (isStart) {
        setState(prev => ({
          ...prev,
          startLocation: prediction.description,
          startLocationDetails: locationDetails,
          startPredictions: [],
          showStartPredictions: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          endLocation: prediction.description,
          endLocationDetails: locationDetails,
          endPredictions: [],
          showEndPredictions: false,
        }));
      }
    } catch (error) {
      console.error('Failed to get place details:', error);
    } finally {
      if (isStart) setStartLoading(false); else setEndLoading(false);
    }
  };

    const handlePlanRoute = async () => {
    if (!state.startLocation || !state.endLocation) {
      setState(prev => ({ ...prev, error: 'Please enter both start and end locations' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      // Check if user has set preferences
      const hasPreferences = state.userPreferences.length > 0;
      
      if (!hasPreferences) {
        console.log('No user preferences set - using default recommendations');
      } else {
        console.log('Using user preferences for AI recommendations:', state.userPreferences);
      }

      // Get comprehensive recommendations using integrated service
      const travelPreferences: TravelPreferences = {
        userPreferences: state.userPreferences,
        travelPurpose: 'general travel'
      };

      console.log('Planning route from:', state.startLocation, 'to:', state.endLocation);

      const enhancedAnalysis = await integratedTravelService.getComprehensiveRecommendations(
        state.startLocation,
        state.endLocation,
        state.transportationMode,
        travelPreferences
      );

      setState(prev => ({
        ...prev,
        route: enhancedAnalysis.route,
        recommendations: enhancedAnalysis.recommendations,
        enhancedAnalysis,
        loading: false,
      }));
    } catch (error) {
      console.error('Route planning error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to plan route. Please try again.',
      }));
    }
  };

  const getPoiIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <RestaurantIcon sx={{ color: '#ef4444' }} />;
      case 'museum':
        return <MuseumIcon sx={{ color: '#10b981' }} />;
      case 'park':
        return <ParkIcon sx={{ color: '#3b82f6' }} />;
      case 'shopping_mall':
        return <ShoppingCartIcon sx={{ color: '#8b5cf6' }} />;
      case 'tourist_attraction':
        return <LocalActivityIcon sx={{ color: '#f59e0b' }} />;
      case 'lodging':
        return <HotelIcon sx={{ color: '#ec4899' }} />;
      default:
        return <LocationOnIcon sx={{ color: 'var(--color-ocean)' }} />;
    }
  };

  const getPoiColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '#ef4444';
      case 'museum':
        return '#10b981';
      case 'park':
        return '#3b82f6';
      case 'shopping_mall':
        return '#8b5cf6';
      case 'tourist_attraction':
        return '#f59e0b';
      case 'lodging':
        return '#ec4899';
      default:
        return 'var(--color-ocean)';
    }
  };

  const getAIMarkerIcon = (type: string) => {
    // AI recommendations get special icons with AI indicator
    const baseIcon = getPoiIcon(type);
    return React.cloneElement(baseIcon, {
      sx: { 
        ...baseIcon.props.sx,
        filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
        transform: 'scale(1.2)'
      }
    });
  };

  const getAIMarkerColor = (type: string) => {
    // AI recommendations get enhanced colors
    const baseColor = getPoiColor(type);
    return baseColor;
  };

  // Helper function to format duration
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  // Helper function to convert km to miles and format distance
  const formatDistance = (kilometers: number) => {
    const miles = kilometers * 0.621371;
    return `${miles.toFixed(1)} mi`;
  };

  // Handle preferences change
  const handlePreferencesChange = (newPreferences: UserPreference[]) => {
    setState(prev => ({ ...prev, userPreferences: newPreferences }));
  };

  const handleRealTimePreferenceUpdate = async (newPreferences: UserPreference[]) => {
    // Only update if we have a route and preferences have changed
    if (!state.route || newPreferences.length === 0) return;

    setIsUpdatingAI(true);
    
    try {
      console.log('Real-time AI update with preferences:', newPreferences);
      
      const travelPreferences: TravelPreferences = {
        userPreferences: newPreferences,
        travelPurpose: 'general travel'
      };

      const enhancedAnalysis = await integratedTravelService.getComprehensiveRecommendations(
        state.startLocation,
        state.endLocation,
        state.transportationMode,
        travelPreferences
      );

      setState(prev => ({
        ...prev,
        recommendations: enhancedAnalysis.recommendations,
        enhancedAnalysis,
        userPreferences: newPreferences,
      }));

      console.log('AI recommendations updated with', enhancedAnalysis.recommendations.length, 'new suggestions');
      
      // Show a brief success message
      const aiSuggestions = enhancedAnalysis.recommendations.filter(r => r.source === 'gemini').length;
      if (aiSuggestions > 0) {
        console.log(`✨ AI updated with ${aiSuggestions} personalized suggestions!`);
      }
    } catch (error) {
      console.error('Real-time AI update failed:', error);
      // Don't show error to user for real-time updates, just log it
    } finally {
      setIsUpdatingAI(false);
    }
  };

  // Handle place selection from map
  const handlePlaceSelect = (place: TravelRecommendation) => {
    setState(prev => ({ 
      ...prev, 
      selectedPlace: place, 
      showPlaceModal: true 
    }));
  };

  // Handle place modal close
  const handlePlaceModalClose = () => {
    setState(prev => ({ 
      ...prev, 
      showPlaceModal: false, 
      selectedPlace: null 
    }));
  };

  // Handle reroute with selected place
  const handleReroute = (place: TravelRecommendation) => {
    // TODO: Implement rerouting logic
    console.log('Rerouting to include:', place.name);
    handlePlaceModalClose();
  };

  // Get color for Gemini suggestions based on importance
  const getGeminiSuggestionColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'must-visit':
        return '#ef4444'; // Red
      case 'highly recommended':
        return '#f59e0b'; // Orange
      case 'worth checking out':
        return '#10b981'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  // Google Maps rendering logic
  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    function renderMap() {
      const mapDiv = document.getElementById('google-map');
      if (!mapDiv || !window.google) return;
      
      const center = state.route
        ? { lat: state.route.start.lat, lng: state.route.start.lng }
        : { lat: 40.7128, lng: -74.0060 };
      
      const map = new window.google.maps.Map(mapDiv, {
        center,
        zoom: state.route ? 10 : 12,
        mapTypeId: 'roadmap',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add start/end markers if route exists
      if (state.route) {
        // Start marker
        new window.google.maps.Marker({
          position: { lat: state.route.start.lat, lng: state.route.start.lng },
          map,
          label: {
            text: 'A',
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#0ea5e9',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        // End marker
        new window.google.maps.Marker({
          position: { lat: state.route.end.lat, lng: state.route.end.lng },
          map,
          label: {
            text: 'B',
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2
          }
        });

        // Draw actual route using Directions Service
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true, // We'll add our own markers
          polylineOptions: {
            strokeColor: getRouteColor(state.transportationMode),
            strokeOpacity: 0.8,
            strokeWeight: 4,
            geodesic: true
          }
        });

        const request = {
          origin: { lat: state.route.start.lat, lng: state.route.start.lng },
          destination: { lat: state.route.end.lat, lng: state.route.end.lng },
          travelMode: getGoogleMapsTravelMode(state.transportationMode),
          transitOptions: state.transportationMode === 'transit' ? {
            modes: ['BUS', 'TRAIN', 'SUBWAY'],
            routingPreference: 'FEWER_TRANSFERS'
          } : undefined
        };

        directionsService.route(request, (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
          if (status === 'OK' && result.routes && result.routes.length > 0) {
            directionsRenderer.setDirections(result);
            
            // Fit map to show the entire route
            const bounds = new window.google.maps.LatLngBounds();
            result.routes[0].legs.forEach((leg: google.maps.DirectionsLeg) => {
              bounds.extend(leg.start_location);
              bounds.extend(leg.end_location);
            });
            map.fitBounds(bounds);
          } else {
            console.error('Directions request failed due to ' + status);
            // Fallback to simple polyline if directions fail
            if (state.route) {
              const routePath = [
                { lat: state.route.start.lat, lng: state.route.start.lng },
                ...state.route.waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
                { lat: state.route.end.lat, lng: state.route.end.lng },
              ];
              
              new window.google.maps.Polyline({
                path: routePath,
                geodesic: true,
                strokeColor: getRouteColor(state.transportationMode),
                strokeOpacity: 0.8,
                strokeWeight: 4,
              }).setMap(map);
            }
          }
        });
      }

             // Add recommendation markers
      state.recommendations.forEach((recommendation) => {
        // Check if this is an AI recommendation
        const isAIRecommendation = (recommendation as any).isAIRecommendation || recommendation.source === 'gemini';
        
        const marker = new window.google.maps.Marker({
          position: { lat: recommendation.location.lat, lng: recommendation.location.lng },
          map,
          title: `${recommendation.name}${isAIRecommendation ? ' (AI Recommended)' : ''}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: isAIRecommendation ? 10 : 6, // AI recommendations are larger
            fillColor: isAIRecommendation ? 
              getAIMarkerColor(recommendation.type) : 
              getPoiColor(recommendation.type),
            fillOpacity: isAIRecommendation ? 0.95 : 0.8,
            strokeColor: isAIRecommendation ? '#3b82f6' : '#ffffff', // AI recommendations have blue border
            strokeWeight: isAIRecommendation ? 3 : 1
          }
        });

        // Add click listener for recommendations
        marker.addListener('click', () => {
          handlePlaceSelect(recommendation);
        });

        // Add hover effect for AI recommendations
        if (isAIRecommendation) {
          marker.addListener('mouseover', () => {
            marker.setIcon({
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12, // Slightly larger on hover
              fillColor: getAIMarkerColor(recommendation.type),
              fillOpacity: 1,
              strokeColor: '#3b82f6',
              strokeWeight: 4
            });
          });

          marker.addListener('mouseout', () => {
            marker.setIcon({
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: getAIMarkerColor(recommendation.type),
              fillOpacity: 0.95,
              strokeColor: '#3b82f6',
              strokeWeight: 3
            });
          });
        }
      });
    }

    // Helper function to get Google Maps travel mode
    const getGoogleMapsTravelMode = (mode: string) => {
      switch (mode) {
        case 'driving':
          return window.google.maps.TravelMode.DRIVING;
        case 'transit':
          return window.google.maps.TravelMode.TRANSIT;
        case 'walking':
          return window.google.maps.TravelMode.WALKING;
        case 'bicycling':
          return window.google.maps.TravelMode.BICYCLING;
        default:
          return window.google.maps.TravelMode.DRIVING;
      }
    };

         // Get color based on transportation mode
     const getRouteColor = (mode: string) => {
       switch (mode) {
         case 'driving':
           return '#0ea5e9'; // Blue
         case 'transit':
           return '#8b5cf6'; // Purple
         case 'walking':
           return '#10b981'; // Green
         case 'bicycling':
           return '#f59e0b'; // Orange
         default:
           return '#0ea5e9';
       }
     };



    if (!window.google && apiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.onload = () => {
        renderMap();
      };
      document.body.appendChild(script);
    } else if (window.google) {
      renderMap();
    }
    // Re-render map when state.route or state.recommendations changes
  }, [state.route, state.recommendations, state.transportationMode]);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: { xs: 2, sm: 3, md: 4 }, 
      position: 'relative',
      overflow: 'visible',
    }}>
      {/* Background decorative elements - hidden on mobile */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(44, 90, 160, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Container maxWidth="xl" sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        zIndex: 1,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            className="text-primary"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Plan Your Journey
          </Typography>
          <Typography
            variant="h6"
            className="text-muted"
            sx={{
              mb: { xs: 3, md: 4 },
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Discover amazing places along your route with AI-powered recommendations
          </Typography>
        </motion.div>

                 {/* Route Planning Form */}
         <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ alignItems: 'flex-start', minHeight: 'fit-content' }}>
           {/* Route Planning Form */}
           <Grid item xs={12} lg={4} sx={{ position: 'sticky', top: { lg: 20 }, height: 'fit-content' }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                             <Paper
                 sx={{
                   p: { xs: 2, sm: 3, md: 4 },
                   maxHeight: { lg: 'calc(100vh - 60px)' },
                   overflow: { lg: 'auto' },
                   background: 'var(--bg-glass)',
                   backdropFilter: 'blur(20px)',
                   border: '1px solid var(--border-primary)',
                   borderRadius: { xs: 2, md: 4 },
                   position: 'relative',
                 }}
               >
                <Typography
                  variant="h5"
                  gutterBottom
                  className="text-primary"
                  sx={{ 
                    fontWeight: 700, 
                    mb: { xs: 2, md: 3 }, 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Enter Your Journey
                </Typography>

                                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
                   {/* AI Preferences Status */}
                   <Box sx={{ 
                     p: 2, 
                     borderRadius: 2, 
                     background: state.userPreferences.length > 0 
                       ? 'rgba(16, 185, 129, 0.1)' 
                       : 'rgba(245, 158, 11, 0.1)',
                     border: `1px solid ${state.userPreferences.length > 0 ? '#10b981' : '#f59e0b'}`,
                     display: 'flex',
                     alignItems: 'center',
                     gap: 1
                   }}>
                     <Box sx={{
                       width: 8,
                       height: 8,
                       borderRadius: '50%',
                       background: state.userPreferences.length > 0 ? '#10b981' : '#f59e0b'
                     }} />
                     <Typography variant="body2" sx={{ 
                       color: state.userPreferences.length > 0 ? '#10b981' : '#f59e0b',
                       fontWeight: 500
                     }}>
                       {state.userPreferences.length > 0 
                         ? `AI Preferences Set (${state.userPreferences.length} categories)`
                         : 'Set your preferences for personalized AI recommendations'
                       }
                     </Typography>
                   </Box>

                   {/* AI Preferences Panel */}
                   <PreferencesPanel
                     preferences={state.userPreferences}
                     onPreferencesChange={handlePreferencesChange}
                     onRealTimeUpdate={handleRealTimePreferenceUpdate}
                     isOpen={state.showPreferences}
                     onToggle={() => setState(prev => ({ ...prev, showPreferences: !prev.showPreferences }))}
                     isUpdating={isUpdatingAI}
                   />

                   {/* Start Location */}
                   <Box sx={{ position: 'relative' }}>
                     <TextField
                       fullWidth
                       label="Start Location"
                       value={state.startLocation}
                       onChange={(e) => handleStartLocationChange(e.target.value)}
                       placeholder="Enter starting point"
                       variant="outlined"
                       ref={startInputRef}
                                               sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: state.showStartPredictions ? '12px 12px 0 0' : '12px',
                          },
                        }}
                       InputProps={{
                         startAdornment: (
                           <LocationOnIcon sx={{ mr: 1 }} className="icon-muted" />
                         ),
                       }}
                     />
                    
                    {/* Start Location Predictions */}
                    <AnimatePresence>
                      {state.showStartPredictions && (
                        <motion.div
                          className="prediction-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '0 0 12px 12px',
                            maxHeight: 200,
                            overflow: 'auto',
                            backdropFilter: 'blur(10px)',
                            boxShadow: 'var(--shadow-soft)',
                            marginTop: '-1px',
                            borderTop: 'none',
                          }}
                        >
                          {startLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                              <CircularProgress size={24} />
                            </Box>
                          )}
                          {startError && (
                            <Alert severity="error" sx={{ m: 1 }}>{startError}</Alert>
                          )}
                          {!startLoading && !startError && state.startPredictions.length > 0 && (
                            <List dense>
                              {state.startPredictions.map((prediction) => (
                                <ListItem
                                  key={prediction.placeId}
                                  button
                                  onMouseDown={() => handlePredictionSelect(prediction, true)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'var(--bg-tertiary)',
                                    },
                                  }}
                                >
                                  <ListItemIcon>
                                    <LocationOnIcon className="icon-muted" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={prediction.description}
                                    className="text-primary"
                                  />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                                     {/* End Location */}
                   <Box sx={{ position: 'relative' }}>
                     <TextField
                       fullWidth
                       label="Destination"
                       value={state.endLocation}
                       onChange={(e) => handleEndLocationChange(e.target.value)}
                       placeholder="Enter destination"
                       variant="outlined"
                       ref={endInputRef}
                       sx={{
                         '& .MuiOutlinedInput-root': {
                           borderRadius: state.showEndPredictions ? '12px 12px 0 0' : '12px',
                         },
                       }}
                       InputProps={{
                         startAdornment: (
                           <LocationOnIcon sx={{ mr: 1 }} className="icon-muted" />
                         ),
                       }}
                     />
                    
                    {/* End Location Predictions */}
                    <AnimatePresence>
                      {state.showEndPredictions && (
                        <motion.div
                          className="prediction-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: '0 0 12px 12px',
                            maxHeight: 200,
                            overflow: 'auto',
                            backdropFilter: 'blur(10px)',
                            boxShadow: 'var(--shadow-soft)',
                            marginTop: '-1px',
                            borderTop: 'none',
                          }}
                        >
                          {endLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 2 }}>
                              <CircularProgress size={24} />
                            </Box>
                          )}
                          {endError && (
                            <Alert severity="error" sx={{ m: 1 }}>{endError}</Alert>
                          )}
                          {!endLoading && !endError && state.endPredictions.length > 0 && (
                            <List dense>
                              {state.endPredictions.map((prediction) => (
                                <ListItem
                                  key={prediction.placeId}
                                  button
                                  onMouseDown={() => handlePredictionSelect(prediction, false)}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'var(--bg-tertiary)',
                                    },
                                  }}
                                >
                                  <ListItemIcon>
                                    <LocationOnIcon className="icon-muted" />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={prediction.description}
                                    className="text-primary"
                                  />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  {/* Transportation Mode Selection */}
                  <Box sx={{ mt: { xs: 2, md: 3 } }}>
                    <Typography 
                      variant="subtitle2" 
                      className="text-muted"
                      sx={{ 
                        mb: 1,
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      Transportation Mode
                    </Typography>
                    <Typography 
                      variant="body2" 
                      className="text-secondary"
                      sx={{ 
                        mb: 2, 
                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                        textAlign: { xs: 'center', md: 'left' },
                      }}
                    >
                      Choose your preferred mode of transportation for accurate route calculation
                    </Typography>
                    <Box sx={{ 
                      width: '100%',
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: { xs: 2, md: 4 },
                      p: { xs: 0.5, md: 1 },
                      display: 'flex',
                      flexDirection: 'row',
                      gap: { xs: 0.5, md: 1 },
                      flexWrap: 'nowrap',
                      overflow: 'hidden',
                    }}>
                      {transportationModes.map((mode) => (
                        <Tooltip
                          key={mode.value}
                          title={`${mode.description} - Click to select ${mode.label} mode`}
                          placement="top"
                          arrow
                          sx={{
                            '& .MuiTooltip-tooltip': {
                              background: 'var(--bg-glass-strong)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-primary)',
                              borderRadius: 2,
                              fontSize: '0.875rem',
                              backdropFilter: 'blur(10px)',
                            },
                          }}
                        >
                          <Button
                            variant={state.transportationMode === mode.value ? "contained" : "outlined"}
                            onClick={() => {
                              setState(prev => ({ ...prev, transportationMode: mode.value as 'driving' | 'transit' | 'walking' | 'bicycling' }));
                              // Auto-recalculate route if we have both locations
                              if (state.startLocationDetails && state.endLocationDetails && state.route) {
                                handlePlanRoute();
                              }
                            }}
                            sx={{
                              flex: 1,
                              minHeight: { xs: 60, sm: 70, md: 80 },
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: { xs: 0.25, sm: 0.5, md: 0.75 },
                              p: { xs: 0.75, sm: 1, md: 1.5 },
                              borderRadius: 3,
                              border: '1px solid transparent',
                              transition: 'all 0.2s ease',
                              background: state.transportationMode === mode.value 
                                ? 'var(--primary-gradient)' 
                                : 'var(--bg-glass)',
                              color: state.transportationMode === mode.value 
                                ? 'white' 
                                : 'var(--text-primary)',
                              '&:hover': {
                                background: state.transportationMode === mode.value 
                                  ? 'var(--primary-gradient)' 
                                  : 'var(--bg-tertiary)',
                                transform: 'translateY(-1px)',
                              },
                              '& .MuiSvgIcon-root': {
                                fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                                transition: 'color 0.2s ease',
                                color: state.transportationMode === mode.value 
                                  ? 'white' 
                                  : 'var(--text-primary)',
                              },
                              '& .MuiTypography-root': {
                                color: state.transportationMode === mode.value 
                                  ? 'white' 
                                  : 'var(--text-primary)',
                                transition: 'color 0.2s ease',
                              },
                            }}
                          >
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              mb: 0.5,
                            }}>
                              {React.cloneElement(mode.icon, { 
                                className: state.transportationMode === mode.value ? 'icon-primary' : 'icon-muted',
                                sx: { 
                                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                                  color: state.transportationMode === mode.value ? 'white' : 'var(--text-primary)',
                                }
                              })}
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                                textAlign: 'center',
                                lineHeight: 1.2,
                                color: state.transportationMode === mode.value 
                                  ? 'white' 
                                  : 'var(--text-primary)',
                              }}
                            >
                              {mode.label}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                textAlign: 'center',
                                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                                lineHeight: 1.1,
                                opacity: 0.8,
                                display: { xs: 'none', sm: 'block' },
                                color: state.transportationMode === mode.value 
                                  ? 'white' 
                                  : 'var(--text-muted)',
                              }}
                            >
                              {mode.description}
                            </Typography>
                          </Button>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handlePlanRoute}
                    disabled={state.loading || !state.startLocationDetails || !state.endLocationDetails}
                    startIcon={state.loading ? <CircularProgress size={20} /> : <DirectionsIcon className="icon-primary" />}
                    className="btn-primary"
                    sx={{
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      width: '100%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: 'var(--primary-gradient)',
                        transform: 'translateY(-1px)',
                      },
                      '&:disabled': {
                        opacity: 0.6,
                        transform: 'none',
                      },
                    }}
                  >
                    {state.loading ? 'Planning Route...' : 'Plan Route'}
                  </Button>

                  <AnimatePresence>
                    {state.error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <Alert severity="error" sx={{ mt: 2 }}>
                          {state.error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>

                {/* Route Summary */}
                <AnimatePresence>
                  {state.route && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                    >
                      <Box sx={{ mt: 4 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          className="text-primary"
                          sx={{ fontWeight: 700, mb: 2 }}
                        >
                          Route Summary
                        </Typography>
                        <Card
                          sx={{
                            background: 'var(--bg-glass-strong)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid var(--border-primary)',
                            borderRadius: 3,
                          }}
                        >
                          <CardContent>
                            {/* Transportation Mode */}
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              {React.cloneElement(transportationModes.find(mode => mode.value === state.transportationMode)?.icon || <div />, { className: 'icon-primary' })}
                              <Typography variant="body1" className="text-primary" sx={{ ml: 1 }}>
                                <strong>Mode:</strong> {transportationModes.find(mode => mode.value === state.transportationMode)?.label}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <StraightenIcon sx={{ mr: 1 }} className="icon-accent" />
                              <Typography variant="body1" className="text-primary">
                                <strong>Distance:</strong> {formatDistance(state.route.distance)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AccessTimeIcon sx={{ mr: 1 }} className="icon-accent" />
                              <Typography variant="body1" className="text-primary">
                                <strong>Duration:</strong> {formatDuration(Math.round(state.route.duration))}
                                {state.transportationMode === 'transit' && ' (including transfers)'}
                                {state.transportationMode === 'walking' && ' (walking time)'}
                                {state.transportationMode === 'bicycling' && ' (cycling time)'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <SpeedIcon sx={{ mr: 1 }} className="icon-accent" />
                              <Typography variant="body1" className="text-primary">
                                <strong>Recommendations Found:</strong> {state.recommendations.length}
                              </Typography>
                            </Box>
                            {/* Mode-specific information */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" className="text-secondary">
                                {state.transportationMode === 'driving' && '🚗 Best route for car travel'}
                                {state.transportationMode === 'transit' && '🚌 Public transportation route'}
                                {state.transportationMode === 'walking' && '🚶 Walking-friendly route'}
                                {state.transportationMode === 'bicycling' && '🚴 Bike-friendly route'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Paper>
            </motion.div>
          </Grid>

          {/* Map */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper
                sx={{
                  p: { xs: 1, sm: 2 },
                  height: { xs: 350, sm: 450, md: 550, lg: 650 },
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: { xs: 2, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ 
                  flex: 1, 
                  borderRadius: 2, 
                  overflow: 'hidden',
                  minHeight: { xs: 300, sm: 400, md: 500, lg: 600 },
                }}>
                  <div
                    id="google-map"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      borderRadius: 'inherit',
                      minHeight: 'inherit',
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Travel Recommendations */}
          <AnimatePresence>
            {state.recommendations.length > 0 && (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3, md: 4 },
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: { xs: 2, md: 4 },
                    }}
                  >
                                         <Typography variant="h4" className="text-primary" sx={{ 
                       fontWeight: 800, 
                       mb: 3,
                       display: 'flex',
                       alignItems: 'center',
                       gap: 2,
                       flexWrap: 'wrap'
                     }}>
                       <ExploreIcon sx={{ 
                         mr: { xs: 0, sm: 2 }, 
                         mb: { xs: 1, sm: 0 },
                         fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                       }} className="icon-accent" />
                       AI-Powered Recommendations ({state.recommendations.length})
                       {isUpdatingAI && (
                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           <CircularProgress size={20} />
                           <Typography variant="caption" className="text-accent" sx={{ fontWeight: 600 }}>
                             Updating...
                           </Typography>
                         </Box>
                       )}
                     </Typography>

                     {state.enhancedAnalysis && (
                       <Box sx={{ mb: 3, p: 2, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                         <Typography variant="body1" className="text-primary" sx={{ fontWeight: 600, mb: 1 }}>
                           🤖 AI Route Analysis
                         </Typography>
                         <Typography variant="body2" className="text-secondary" sx={{ mb: 2 }}>
                           {state.enhancedAnalysis.aiAnalysis.routeInsights}
                         </Typography>
                         {state.enhancedAnalysis.aiAnalysis.personalizedTips.length > 0 && (
                           <Box>
                             <Typography variant="body2" className="text-accent" sx={{ fontWeight: 600, mb: 1 }}>
                               Personalized Tips:
                             </Typography>
                             {state.enhancedAnalysis.aiAnalysis.personalizedTips.map((tip: string, index: number) => (
                               <Typography key={index} variant="body2" className="text-secondary" sx={{ ml: 2 }}>
                                 • {tip}
                               </Typography>
                             ))}
                           </Box>
                         )}
                       </Box>
                     )}
                    
                                         <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ alignItems: 'stretch' }}>
                       {/* Travel Recommendations */}
                       {state.recommendations.slice(0, 8).map((recommendation, index) => {
                         const isAIRecommendation = (recommendation as any).isAIRecommendation || recommendation.source === 'gemini';
                         
                         return (
                           <Grid item xs={12} sm={6} lg={4} key={recommendation.id} sx={{ display: 'flex' }}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                            >
                              <Card
                                sx={{
                                  background: isAIRecommendation ? 'var(--bg-glass-strong)' : 'var(--bg-glass)',
                                  backdropFilter: 'blur(10px)',
                                  border: isAIRecommendation ? 
                                    `2px solid ${getAIMarkerColor(recommendation.type)}` : 
                                    '1px solid var(--border-primary)',
                                  borderRadius: { xs: 2, md: 3 },
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  cursor: 'pointer',
                                  position: 'relative',
                                  '&:hover': {
                                    transform: { xs: 'none', md: 'translateY(-4px)' },
                                    boxShadow: isAIRecommendation ? 
                                      `0 8px 32px ${getAIMarkerColor(recommendation.type)}40` : 
                                      'var(--shadow-strong)',
                                  },
                                }}
                                onClick={() => handlePlaceSelect(recommendation)}
                              >
                                {/* AI Recommendation Badge */}
                                {isAIRecommendation && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: -8,
                                      right: -8,
                                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                      color: 'white',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: 2,
                                      fontSize: '0.7rem',
                                      fontWeight: 700,
                                      zIndex: 1,
                                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                                    }}
                                  >
                                    🤖 AI
                                  </Box>
                                )}
                                
                                <CardContent sx={{ 
                                  p: { xs: 2, md: 3 },
                                  flex: 1,
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'flex-start', 
                                    mb: 2,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    textAlign: { xs: 'center', sm: 'left' },
                                  }}>
                                    <Avatar
                                      sx={{
                                        background: isAIRecommendation ? 
                                          getAIMarkerColor(recommendation.type) : 
                                          getPoiColor(recommendation.type),
                                        mr: { xs: 0, sm: 2 },
                                        mb: { xs: 1, sm: 0 },
                                        width: { xs: 40, sm: 48 },
                                        height: { xs: 40, sm: 48 },
                                        boxShadow: isAIRecommendation ? 
                                          `0 4px 12px ${getAIMarkerColor(recommendation.type)}40` : 
                                          'none',
                                      }}
                                    >
                                      {isAIRecommendation ? '🤖' : getPoiIcon(recommendation.type)}
                                    </Avatar>
                                    <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography
                                          variant="h6"
                                          className="text-primary"
                                          sx={{ 
                                            fontWeight: 700, 
                                            fontSize: { xs: '1rem', sm: '1.25rem' },
                                          }}
                                        >
                                        {recommendation.name}
                                    </Typography>
                                      {recommendation.source === 'gemini' && (
                                        <Chip
                                          label={recommendation.importance}
                                          size="small"
                                          sx={{
                                            background: getGeminiSuggestionColor(recommendation.importance),
                                            color: 'white',
                                            fontSize: '0.6rem',
                                            height: 20,
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Typography variant="body2" className="text-muted">
                                      {recommendation.type} • {formatDistance(recommendation.distance)} from route
                                    </Typography>
                                  </Box>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    gap: 0.5,
                                    justifyContent: { xs: 'center', sm: 'flex-start' },
                                    mt: { xs: 1, sm: 0 },
                                  }}>
                                    <Tooltip title="Save">
                                      <IconButton size="small" className="icon-muted">
                                        <BookmarkIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share">
                                      <IconButton size="small" className="icon-muted">
                                        <ShareIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>

                                <Typography
                                  variant="body2"
                                  className="text-secondary"
                                  sx={{
                                    mb: 2,
                                    lineHeight: 1.5,
                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                    textAlign: { xs: 'center', sm: 'left' },
                                  }}
                                >
                                  {recommendation.description}
                                </Typography>

                                <Box sx={{ 
                                  display: 'flex', 
                                  flexWrap: 'wrap', 
                                  gap: 1, 
                                  mb: 2,
                                  justifyContent: { xs: 'center', sm: 'flex-start' },
                                }}>
                                  {recommendation.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Chip
                                      key={tagIndex}
                                      label={tag}
                                      size="small"
                                      sx={{
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)',
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                      }}
                                    />
                                  ))}
                                </Box>

                                <Divider sx={{ my: 2, borderColor: 'var(--border-primary)' }} />

                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  flexDirection: { xs: 'column', sm: 'row' },
                                  gap: { xs: 1, sm: 0 },
                                  mt: 'auto',
                                }}>
                                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    {recommendation.costLevel && (
                                      <Typography
                                        variant="body2"
                                        sx={{ 
                                          color: 'var(--text-secondary)', 
                                          mb: 0.5,
                                          fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                        }}
                                      >
                                        <strong>Cost:</strong> {recommendation.costLevel}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant="body2"
                                      sx={{ 
                                        color: 'var(--text-secondary)',
                                        fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                      }}
                                    >
                                      <strong>Distance:</strong> {formatDistance(recommendation.distance)} away
                                    </Typography>
                                  </Box>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<CameraAltIcon />}
                                    sx={{
                                      borderColor: 'var(--border-primary)',
                                      color: 'var(--text-primary)',
                                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                      '&:hover': {
                                        borderColor: 'var(--color-sunset)',
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                      },
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </Box>
                              </CardContent>
                            </Card>
                          </motion.div>
                                                 </Grid>
                       );
                       })}


                     </Grid>
                  </Paper>
                </motion.div>
              </Grid>
            )}
                     </AnimatePresence>
         </Grid>
       </Container>

       {/* Place Details Modal */}
       <PlaceDetailsModal
         open={state.showPlaceModal}
         onClose={handlePlaceModalClose}
         place={state.selectedPlace}
         userPreferences={state.userPreferences}
         routeContext={`${state.startLocation} to ${state.endLocation}`}
         onReroute={handleReroute}
       />
     </Box>
   );
 };

export default RoutePlanner; 
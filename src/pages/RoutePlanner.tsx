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


import googleMapsService, { 
  Location, 
  Route, 
  PlaceOfInterest, 
  AutocompleteResult 
} from '../services/GoogleMapsService';

// Types
interface RoutePlannerState {
  startLocation: string;
  endLocation: string;
  startLocationDetails: Location | null;
  endLocationDetails: Location | null;
  route: Route | null;
  pois: PlaceOfInterest[];
  loading: boolean;
  error: string;
  startPredictions: AutocompleteResult[];
  endPredictions: AutocompleteResult[];
  showStartPredictions: boolean;
  showEndPredictions: boolean;
}

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
    pois: [],
    loading: false,
    error: '',
    startPredictions: [],
    endPredictions: [],
    showStartPredictions: false,
    showEndPredictions: false,
  });
  const [startLoading, setStartLoading] = useState(false);
  const [endLoading, setEndLoading] = useState(false);
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // Debounced handlers
  const debouncedStart = useRef(
    debounce(async (value: string) => {
      if (value.length > 2) {
        setStartLoading(true);
        setStartError('');
        try {
          const predictions = await googleMapsService.getPlacePredictions(value);
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
          const predictions = await googleMapsService.getPlacePredictions(value);
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
      const locationDetails = await googleMapsService.getPlaceDetails(prediction.placeId);
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
    if (!state.startLocationDetails || !state.endLocationDetails) {
      setState(prev => ({ ...prev, error: 'Please select valid start and end locations' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      // Get route
      const route = await googleMapsService.getRoute(
        state.startLocationDetails,
        state.endLocationDetails
      );

      // Get POIs along the route based on user preferences
      const placeTypes = ['restaurant', 'museum', 'park', 'shopping_mall', 'tourist_attraction'];
      const pois = await googleMapsService.searchPlacesAlongRoute(route, placeTypes, 5);

      setState(prev => ({
        ...prev,
        route,
        pois,
        loading: false,
      }));
    } catch (error) {
      console.error('Route planning error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to plan route. Please try again.',
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
      });
      // Add start/end markers if route exists
      if (state.route) {
        new window.google.maps.Marker({
          position: { lat: state.route.start.lat, lng: state.route.start.lng },
          map,
          label: 'A',
        });
        new window.google.maps.Marker({
          position: { lat: state.route.end.lat, lng: state.route.end.lng },
          map,
          label: 'B',
        });
        // Draw route polyline
        const routePath = [
          { lat: state.route.start.lat, lng: state.route.start.lng },
          ...state.route.waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
          { lat: state.route.end.lat, lng: state.route.end.lng },
        ];
        new window.google.maps.Polyline({
          path: routePath,
          geodesic: true,
          strokeColor: '#0ea5e9',
          strokeOpacity: 0.8,
          strokeWeight: 4,
        }).setMap(map);
      }
      // Add POI markers
      state.pois.forEach((poi) => {
        new window.google.maps.Marker({
          position: { lat: poi.location.lat, lng: poi.location.lng },
          map,
          title: poi.name,
        });
      });
    }
    if (!window.google && apiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.onload = () => {
        renderMap();
      };
      document.body.appendChild(script);
    } else if (window.google) {
      renderMap();
    }
    // Re-render map when state.route or state.pois changes
  }, [state.route, state.pois]);

  return (
    <Box sx={{ minHeight: '100vh', py: 4, position: 'relative' }}>
      {/* Background decorative elements */}
      <motion.div
        className="float"
        style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(44, 90, 160, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              mb: 1,
              color: 'var(--text-primary)',
            }}
          >
            Plan Your Journey
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: 'var(--text-muted)',
              fontWeight: 400,
            }}
          >
            Discover amazing places along your route with AI-powered recommendations
          </Typography>
        </motion.div>

        {/* Route Planning Form */}
        <Grid container spacing={4}>
          {/* Route Planning Form */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper
                sx={{
                  p: 4,
                  height: 'fit-content',
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 4,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3, color: 'var(--text-primary)' }}
                >
                  Enter Your Journey
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon sx={{ mr: 1, color: 'var(--text-muted)' }} />
                        ),
                      }}
                    />
                    
                    {/* Start Location Predictions */}
                    <AnimatePresence>
                      {state.showStartPredictions && (
                        <motion.div
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
                            borderRadius: 4,
                            maxHeight: 200,
                            overflow: 'auto',
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
                                    <LocationOnIcon sx={{ color: 'var(--text-muted)' }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={prediction.description}
                                    sx={{ color: 'var(--text-primary)' }}
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
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon sx={{ mr: 1, color: 'var(--text-muted)' }} />
                        ),
                      }}
                    />
                    
                    {/* End Location Predictions */}
                    <AnimatePresence>
                      {state.showEndPredictions && (
                        <motion.div
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
                            borderRadius: 4,
                            maxHeight: 200,
                            overflow: 'auto',
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
                                    <LocationOnIcon sx={{ color: 'var(--text-muted)' }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={prediction.description}
                                    sx={{ color: 'var(--text-primary)' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handlePlanRoute}
                      disabled={state.loading || !state.startLocationDetails || !state.endLocationDetails}
                      startIcon={state.loading ? <CircularProgress size={20} /> : <DirectionsIcon />}
                      sx={{
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        background: 'var(--primary-gradient)',
                        boxShadow: 'var(--shadow-soft)',
                        '&:hover': {
                          background: 'var(--primary-gradient)',
                          transform: 'translateY(-2px)',
                          boxShadow: 'var(--shadow-strong)',
                        },
                      }}
                    >
                      {state.loading ? 'Planning Route...' : 'Plan Route'}
                    </Button>
                  </motion.div>

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
                          sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 2 }}
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
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <StraightenIcon sx={{ mr: 1, color: 'var(--color-ocean)' }} />
                              <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                                <strong>Distance:</strong> {state.route.distance.toFixed(1)} km
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <AccessTimeIcon sx={{ mr: 1, color: 'var(--color-ocean)' }} />
                              <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                                <strong>Duration:</strong> {Math.round(state.route.duration)} minutes
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <SpeedIcon sx={{ mr: 1, color: 'var(--color-ocean)' }} />
                              <Typography variant="body1" sx={{ color: 'var(--text-primary)' }}>
                                <strong>POIs Found:</strong> {state.pois.length}
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
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Paper
                sx={{
                  p: 2,
                  height: 600,
                  background: 'var(--bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 4,
                }}
              >
                <Box sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
                  <div
                    id="google-map"
                    style={{ width: '100%', height: '100%', borderRadius: 'inherit' }}
                  />
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Points of Interest */}
          <AnimatePresence>
            {state.pois.length > 0 && (
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 4,
                    }}
                  >
                    <Typography
                      variant="h4"
                      gutterBottom
                      sx={{
                        fontWeight: 700,
                        mb: 3,
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ExploreIcon sx={{ mr: 2, color: 'var(--color-ocean)' }} />
                      Recommended Places ({state.pois.length})
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {state.pois.slice(0, 8).map((poi, index) => (
                        <Grid item xs={12} md={6} key={poi.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                          >
                            <Card
                              sx={{
                                background: 'var(--bg-glass-strong)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid var(--border-primary)',
                                borderRadius: 3,
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: 'var(--shadow-strong)',
                                },
                              }}
                            >
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                  <Avatar
                                    sx={{
                                      background: getPoiColor(poi.type),
                                      mr: 2,
                                      width: 48,
                                      height: 48,
                                    }}
                                  >
                                    {getPoiIcon(poi.type)}
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}
                                    >
                                      {poi.name}
                                    </Typography>
                                    {poi.rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Rating value={poi.rating} readOnly size="small" />
                                        <Typography
                                          variant="body2"
                                          sx={{ ml: 1, color: 'var(--text-secondary)' }}
                                        >
                                          {poi.rating}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                                    <Tooltip title="Save">
                                      <IconButton size="small" sx={{ color: 'var(--text-muted)' }}>
                                        <BookmarkIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Share">
                                      <IconButton size="small" sx={{ color: 'var(--text-muted)' }}>
                                        <ShareIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>

                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: 'var(--text-secondary)',
                                    mb: 2,
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {poi.description || `${poi.type} - ${poi.distance.toFixed(1)}km away`}
                                </Typography>

                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                  {poi.tags?.slice(0, 3).map((tag) => (
                                    <Chip
                                      key={tag}
                                      label={tag}
                                      size="small"
                                      sx={{
                                        background: 'var(--bg-tertiary)',
                                        color: 'var(--text-primary)',
                                        fontSize: '0.75rem',
                                      }}
                                    />
                                  ))}
                                </Box>

                                <Divider sx={{ my: 2, borderColor: 'var(--border-primary)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Box>
                                    {poi.price && (
                                      <Typography
                                        variant="body2"
                                        sx={{ color: 'var(--text-secondary)', mb: 0.5 }}
                                      >
                                        <strong>Price:</strong> {poi.price}
                                      </Typography>
                                    )}
                                    <Typography
                                      variant="body2"
                                      sx={{ color: 'var(--text-secondary)' }}
                                    >
                                      <strong>Distance:</strong> {poi.distance.toFixed(1)} km away
                                    </Typography>
                                  </Box>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<CameraAltIcon />}
                                    sx={{
                                      borderColor: 'var(--border-primary)',
                                      color: 'var(--text-primary)',
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
                      ))}
                    </Grid>
                  </Paper>
                </motion.div>
              </Grid>
            )}
          </AnimatePresence>
        </Grid>
      </Container>
    </Box>
  );
};

export default RoutePlanner; 
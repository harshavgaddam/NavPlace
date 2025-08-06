import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Avatar,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Directions as DirectionsIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPreference } from '../services/GeminiService';
import { TravelRecommendation } from '../services/IntegratedTravelService';
import geminiService from '../services/GeminiService';

interface PlaceDetailsModalProps {
  open: boolean;
  onClose: () => void;
  place: TravelRecommendation | null;
  userPreferences: UserPreference[];
  routeContext: string;
  onReroute: (place: TravelRecommendation) => void;
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  open,
  onClose,
  place,
  userPreferences,
  routeContext,
  onReroute,
}) => {
  const [importance, setImportance] = useState<string>('');
  const [loadingImportance, setLoadingImportance] = useState(false);
  const [routeOptimization, setRouteOptimization] = useState<any>(null);
  const [loadingOptimization, setLoadingOptimization] = useState(false);

  useEffect(() => {
    if (place && open) {
      loadPlaceImportance();
    }
  }, [place, open]);

  const loadPlaceImportance = async () => {
    if (!place) return;
    
    setLoadingImportance(true);
    try {
      const routeContextObj = {
        startLocation: routeContext.split(' to ')[0] || '',
        endLocation: routeContext.split(' to ')[1] || '',
        routeDistance: 0,
        routeDuration: 0,
        transportationMode: 'driving'
      };
      
      const importanceText = await geminiService.getPlaceImportance(
        place.name,
        place.type,
        userPreferences,
        routeContextObj
      );
      setImportance(importanceText);
    } catch (error) {
      console.error('Failed to load place importance:', error);
      setImportance("This place offers a unique experience along your route.");
    } finally {
      setLoadingImportance(false);
    }
  };

  const handleReroute = async () => {
    if (!place) return;
    
    setLoadingOptimization(true);
    try {
      const routeContextObj = {
        startLocation: routeContext.split(' to ')[0] || '',
        endLocation: routeContext.split(' to ')[1] || '',
        routeDistance: 0,
        routeDuration: 0,
        transportationMode: 'driving'
      };
      
      const optimization = await geminiService.getRouteOptimization(
        { distance: 0, duration: 0 }, // Mock route data
        place,
        userPreferences,
        routeContextObj
      );
      setRouteOptimization(optimization);
      
      if (optimization.shouldReroute) {
        onReroute(place);
      }
    } catch (error) {
      console.error('Failed to analyze route optimization:', error);
    } finally {
      setLoadingOptimization(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
      case 'must-visit':
        return '#ef4444';
      case 'highly recommended':
        return '#f59e0b';
      case 'worth checking out':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getPlaceIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '🍽️';
      case 'museum':
        return '🏛️';
      case 'park':
        return '🌳';
      case 'shopping':
        return '🛍️';
      case 'activity':
        return '🎯';
      case 'lodging':
        return '🏨';
      case 'photography':
        return '📸';
      default:
        return '📍';
    }
  };

  if (!place) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-primary)',
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                background: getImportanceColor(place.importance),
                width: 48,
                height: 48,
                fontSize: '1.5rem',
              }}
            >
              {getPlaceIcon(place.type)}
            </Avatar>
            <Box>
              <Typography variant="h6" className="text-primary" sx={{ fontWeight: 700 }}>
                {place.name}
              </Typography>
              <Typography variant="body2" className="text-muted">
                {place.type} • {formatDistance(place.distance)} from route
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} className="icon-muted">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Box sx={{ mb: 3 }}>
          <Chip
            label={place.importance}
            size="small"
            sx={{
              background: getImportanceColor(place.importance),
              color: 'white',
              fontWeight: 600,
              mb: 2,
            }}
          />
          
          <Typography variant="body1" className="text-primary" sx={{ mb: 2 }}>
            {place.description}
          </Typography>

          {loadingImportance ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" className="text-muted">
                Analyzing importance...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <InfoIcon className="icon-accent" sx={{ fontSize: '1rem' }} />
                <Typography variant="subtitle2" className="text-accent" sx={{ fontWeight: 600 }}>
                  AI Analysis
                </Typography>
              </Box>
              <Typography variant="body2" className="text-secondary">
                {importance}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {place.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.7rem',
                }}
              />
            ))}
          </Box>

          {place.rating && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={place.rating} readOnly size="small" />
              <Typography variant="body2" className="text-secondary">
                {place.rating}
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2, borderColor: 'var(--border-primary)' }} />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" className="text-primary" sx={{ fontWeight: 600, mb: 1 }}>
            Why Recommended
          </Typography>
          <Typography variant="body2" className="text-secondary">
            {place.whyRecommended}
          </Typography>
        </Box>

        {routeOptimization && (
          <Alert severity={routeOptimization.shouldReroute ? "success" : "info"} sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Route Analysis:</strong> {routeOptimization.reason}
            </Typography>
            {routeOptimization.tips.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Tips:
                </Typography>
                {routeOptimization.tips.map((tip: string, index: number) => (
                  <Typography key={index} variant="body2" sx={{ ml: 1 }}>
                    • {tip}
                  </Typography>
                ))}
              </Box>
            )}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: 'var(--border-primary)',
            color: 'var(--text-primary)',
          }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          onClick={handleReroute}
          disabled={loadingOptimization}
          startIcon={loadingOptimization ? <CircularProgress size={16} /> : <RouteIcon />}
          className="btn-primary"
          sx={{
            background: 'var(--primary-gradient)',
            '&:hover': {
              background: 'var(--primary-gradient)',
            },
          }}
        >
          {loadingOptimization ? 'Analyzing...' : 'Add to Route'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper function to format distance
const formatDistance = (kilometers: number) => {
  const miles = kilometers * 0.621371;
  return `${miles.toFixed(1)} mi`;
};

export default PlaceDetailsModal; 
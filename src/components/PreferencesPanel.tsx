import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Restaurant as RestaurantIcon,
  Museum as MuseumIcon,
  Park as ParkIcon,
  ShoppingCart as ShoppingIcon,
  LocalActivity as ActivityIcon,
  Hotel as HotelIcon,
  CameraAlt as CameraIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPreference } from '../services/GeminiService';

interface PreferencesPanelProps {
  preferences: UserPreference[];
  onPreferencesChange: (preferences: UserPreference[]) => void;
  isOpen: boolean;
  onToggle: () => void;
  onRealTimeUpdate?: (preferences: UserPreference[]) => void;
  isUpdating?: boolean;
}

const preferenceCategories = [
  {
    key: 'restaurant',
    label: 'Restaurants & Food',
    icon: <RestaurantIcon />,
    description: 'Culinary experiences and dining options',
  },
  {
    key: 'museum',
    label: 'Museums & Culture',
    icon: <MuseumIcon />,
    description: 'Historical sites and cultural attractions',
  },
  {
    key: 'park',
    label: 'Parks & Nature',
    icon: <ParkIcon />,
    description: 'Outdoor spaces and natural attractions',
  },
  {
    key: 'shopping',
    label: 'Shopping & Retail',
    icon: <ShoppingIcon />,
    description: 'Shopping centers and retail experiences',
  },
  {
    key: 'activity',
    label: 'Activities & Entertainment',
    icon: <ActivityIcon />,
    description: 'Entertainment venues and activities',
  },
  {
    key: 'lodging',
    label: 'Hotels & Accommodation',
    icon: <HotelIcon />,
    description: 'Places to stay and accommodation options',
  },
  {
    key: 'photography',
    label: 'Photography & Scenic',
    icon: <CameraIcon />,
    description: 'Scenic spots and photo opportunities',
  },
];

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onPreferencesChange,
  isOpen,
  onToggle,
  onRealTimeUpdate,
  isUpdating,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Debounced real-time update function
  const debouncedRealTimeUpdate = useCallback((updatedPreferences: UserPreference[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      onRealTimeUpdate?.(updatedPreferences);
    }, 1000); // 1 second delay
    
    setDebounceTimer(timer);
  }, [onRealTimeUpdate, debounceTimer]);

  const handlePreferenceChange = (category: string, value: number) => {
    const updatedPreferences = preferences.map(pref =>
      pref.category === category ? { ...pref, interestLevel: value } : pref
    );
    onPreferencesChange(updatedPreferences);
    
    // Trigger real-time update with debouncing
    debouncedRealTimeUpdate(updatedPreferences);
  };

  const getInterestLabel = (value: number) => {
    if (value <= 1) return 'Not interested';
    if (value <= 2) return 'Slightly interested';
    if (value <= 3) return 'Somewhat interested';
    if (value <= 4) return 'Interested';
    return 'Very interested';
  };

  const getInterestColor = (value: number) => {
    if (value <= 1) return '#6b7280';
    if (value <= 2) return '#9ca3af';
    if (value <= 3) return '#fbbf24';
    if (value <= 4) return '#f59e0b';
    return '#d97706';
  };

  return (
    <Paper
      sx={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-primary)',
        borderRadius: { xs: 2, md: 4 },
        overflow: 'hidden',
        mb: 2,
      }}
    >
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '&:hover': {
            background: 'var(--bg-tertiary)',
          },
        }}
        onClick={onToggle}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <SettingsIcon className="icon-primary" />
          <Typography variant="h6" className="text-primary" sx={{ fontWeight: 600 }}>
            AI Travel Preferences
          </Typography>
        </Box>
        <IconButton size="small" className="icon-muted">
          {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={isOpen}>
        <Box sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="body2" className="text-secondary">
              Drag the sliders to adjust your interests. AI recommendations will update automatically.
            </Typography>
            {isUpdating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="caption" className="text-accent">
                  Updating AI recommendations...
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {preferenceCategories.map((category) => {
              const currentPreference = preferences.find(p => p.category === category.key);
              const value = currentPreference?.interestLevel || 1;

              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Box 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      borderRadius: 2, 
                      background: 'var(--bg-tertiary)',
                      border: `2px solid ${getInterestColor(value)}20`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: `${getInterestColor(value)}40`,
                        background: 'var(--bg-glass)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ color: getInterestColor(value) }}>
                        {category.icon}
                      </Box>
                      <Typography variant="subtitle1" className="text-primary" sx={{ fontWeight: 600 }}>
                        {category.label}
                      </Typography>
                      <Chip
                        label={getInterestLabel(value)}
                        size="small"
                        sx={{
                          ml: 'auto',
                          background: getInterestColor(value),
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" className="text-muted" sx={{ mb: 2 }}>
                      {category.description}
                    </Typography>
                    <Slider
                      value={value}
                      onChange={(_, newValue) => handlePreferenceChange(category.key, newValue as number)}
                      min={1}
                      max={5}
                      step={1}
                      marks
                      valueLabelDisplay="auto"
                      sx={{
                        '& .MuiSlider-track': {
                          background: `linear-gradient(to right, #6b7280, ${getInterestColor(value)})`,
                          height: 6,
                          borderRadius: 3,
                        },
                        '& .MuiSlider-thumb': {
                          background: getInterestColor(value),
                          width: 20,
                          height: 20,
                          boxShadow: `0 0 0 4px ${getInterestColor(value)}20`,
                          '&:hover': {
                            boxShadow: `0 0 0 6px ${getInterestColor(value)}30`,
                          },
                          '&:active': {
                            boxShadow: `0 0 0 8px ${getInterestColor(value)}40`,
                          },
                        },
                        '& .MuiSlider-mark': {
                          background: getInterestColor(value),
                          width: 2,
                          height: 2,
                        },
                        '& .MuiSlider-markLabel': {
                          color: 'var(--text-secondary)',
                          fontSize: '0.75rem',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" className="text-muted">
                        Not interested
                      </Typography>
                      <Typography variant="caption" className="text-muted">
                        Very interested
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </Box>

          {preferences.some(p => p.interestLevel > 1) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Alert 
                severity="info" 
                icon={<AutoAwesomeIcon />}
                sx={{ 
                  mt: 2,
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <Typography variant="body2">
                  <strong>AI is learning your preferences!</strong> Your route recommendations will be personalized based on these interests.
                </Typography>
              </Alert>
            </motion.div>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PreferencesPanel; 
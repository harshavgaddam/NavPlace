import React, { useState } from 'react';
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
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPreference } from '../services/GeminiService';

interface PreferencesPanelProps {
  preferences: UserPreference[];
  onPreferencesChange: (preferences: UserPreference[]) => void;
  isOpen: boolean;
  onToggle: () => void;
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
}) => {
  const [expanded, setExpanded] = useState(false);

  const handlePreferenceChange = (category: string, value: number) => {
    const updatedPreferences = preferences.map(pref =>
      pref.category === category ? { ...pref, interestLevel: value } : pref
    );
    onPreferencesChange(updatedPreferences);
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
          <Typography variant="body2" className="text-secondary" sx={{ mb: 3 }}>
            Set your interest levels to get personalized AI recommendations along your route
          </Typography>

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
                >
                  <Box sx={{ mb: 2 }}>
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
                        },
                        '& .MuiSlider-thumb': {
                          background: getInterestColor(value),
                        },
                      }}
                    />
                  </Box>
                </motion.div>
              );
            })}
          </Box>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid var(--border-primary)' }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>AI-Powered Recommendations:</strong> Based on your preferences, our AI will suggest 
                places that match your interests along your route.
              </Typography>
            </Alert>
            
            <Button
              variant="outlined"
              size="small"
              onClick={() => setExpanded(!expanded)}
              sx={{
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
                '&:hover': {
                  borderColor: 'var(--color-sunset)',
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                },
              }}
            >
              {expanded ? 'Hide' : 'Show'} Advanced Options
            </Button>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2, p: 2, background: 'var(--bg-tertiary)', borderRadius: 2 }}>
                <Typography variant="body2" className="text-secondary">
                  <strong>Advanced Features:</strong>
                </Typography>
                <Typography variant="body2" className="text-muted" sx={{ mt: 1 }}>
                  • AI analyzes your route and suggests optimal stops<br/>
                  • Personalized place importance explanations<br/>
                  • Route optimization recommendations<br/>
                  • Context-aware travel tips
                </Typography>
              </Box>
            </Collapse>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PreferencesPanel; 
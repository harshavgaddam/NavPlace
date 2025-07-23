import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Slider,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import MuseumIcon from '@mui/icons-material/Museum';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ParkIcon from '@mui/icons-material/Park';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HistoryIcon from '@mui/icons-material/History';
import NatureIcon from '@mui/icons-material/Nature';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SaveIcon from '@mui/icons-material/Save';
import { AnimatePresence } from 'framer-motion';

interface InterestCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  selected: boolean;
  weight: number;
}

const Preferences: React.FC = () => {
  const [interests, setInterests] = useState<InterestCategory[]>([
    {
      id: 'historic',
      name: 'Historic Sites',
      icon: <HistoryIcon />,
      description: 'Museums, monuments, and historical landmarks',
      selected: false,
      weight: 5,
    },
    {
      id: 'art',
      name: 'Art & Culture',
      icon: <MuseumIcon />,
      description: 'Art galleries, theaters, and cultural venues',
      selected: false,
      weight: 5,
    },
    {
      id: 'nature',
      name: 'Nature & Parks',
      icon: <NatureIcon />,
      description: 'Parks, gardens, and outdoor activities',
      selected: false,
      weight: 5,
    },
    {
      id: 'food',
      name: 'Food & Dining',
      icon: <RestaurantIcon />,
      description: 'Restaurants, cafes, and local cuisine',
      selected: false,
      weight: 5,
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: <LocalActivityIcon />,
      description: 'Amusement parks, cinemas, and entertainment venues',
      selected: false,
      weight: 5,
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: <ShoppingCartIcon />,
      description: 'Malls, markets, and retail districts',
      selected: false,
      weight: 5,
    },
    {
      id: 'sports',
      name: 'Sports & Recreation',
      icon: <SportsEsportsIcon />,
      description: 'Sports venues, gyms, and recreational facilities',
      selected: false,
      weight: 5,
    },
    {
      id: 'outdoor',
      name: 'Outdoor Activities',
      icon: <ParkIcon />,
      description: 'Hiking trails, beaches, and adventure sports',
      selected: false,
      weight: 5,
    },
  ]);

  const [preferences, setPreferences] = useState({
    maxDetour: 10,
    maxStops: 5,
    avoidHighways: false,
    preferScenicRoutes: false,
    includeRestStops: true,
  });

  const [saved, setSaved] = useState(false);

  const handleInterestToggle = (id: string) => {
    setInterests(prev =>
      prev.map(interest =>
        interest.id === id
          ? { ...interest, selected: !interest.selected }
          : interest
      )
    );
  };

  const handleWeightChange = (id: string, value: number) => {
    setInterests(prev =>
      prev.map(interest =>
        interest.id === id ? { ...interest, weight: value } : interest
      )
    );
  };

  const handleSavePreferences = () => {
    // Here you would typically save to backend/localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const selectedInterests = interests.filter(interest => interest.selected);

  const getInterestColor = (id: string) => {
    switch (id) {
      case 'historic':
        return '#10b981';
      case 'art':
        return '#8b5cf6';
      case 'nature':
        return '#16a34a';
      case 'food':
        return '#ef4444';
      case 'entertainment':
        return '#f59e0b';
      case 'shopping':
        return '#ec4899';
      case 'sports':
        return '#3b82f6';
      case 'outdoor':
        return '#0ea5e9';
      default:
        return 'var(--color-ocean)';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, position: 'relative' }}>
      {/* Background decorative elements */}
      <motion.div
        className="float"
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(44, 90, 160, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <motion.div
        className="float"
        style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: 150,
          height: 150,
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 0,
        }}
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
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
              mb: 2,
              color: 'var(--text-primary)',
            }}
          >
            Your Travel Preferences
          </Typography>
          <Typography 
            variant="h6" 
            paragraph 
            sx={{ 
              mb: 4, 
              color: 'var(--text-muted)',
              fontWeight: 400,
            }}
          >
            Customize your journey by selecting your interests and travel preferences.
            We'll use these to recommend the best places along your route.
          </Typography>
        </motion.div>

        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#10b981',
                }}
              >
                Your preferences have been saved successfully!
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Grid container spacing={4}>
          {/* Interest Categories */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                  }}
                >
                  Select Your Interests
                </Typography>
                <Grid container spacing={3}>
                  {interests.map((interest, index) => (
                    <Grid item xs={12} sm={6} key={interest.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      >
                        <Card
                          sx={{
                            cursor: 'pointer',
                            border: interest.selected ? 2 : 1,
                            borderColor: interest.selected 
                              ? getInterestColor(interest.id) 
                              : 'var(--border-primary)',
                            background: interest.selected 
                              ? `rgba(${getInterestColor(interest.id)}, 0.1)` 
                              : 'var(--bg-glass-strong)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 'var(--shadow-strong)',
                              borderColor: getInterestColor(interest.id),
                              background: `rgba(${getInterestColor(interest.id)}, 0.15)`,
                            },
                          }}
                          onClick={() => handleInterestToggle(interest.id)}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Box 
                                sx={{ 
                                  color: getInterestColor(interest.id), 
                                  mr: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                {interest.icon}
                              </Box>
                              <Typography 
                                variant="h6" 
                                sx={{ 
                                  fontWeight: 600,
                                  color: 'var(--text-primary)',
                                }}
                              >
                                {interest.name}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mb: 2,
                                color: 'var(--text-secondary)',
                                lineHeight: 1.5,
                              }}
                            >
                              {interest.description}
                            </Typography>
                            {interest.selected && (
                              <Box sx={{ mt: 2 }}>
                                <Typography 
                                  variant="body2" 
                                  gutterBottom
                                  sx={{ color: 'var(--text-primary)', fontWeight: 500 }}
                                >
                                  Interest Level: {interest.weight}/10
                                </Typography>
                                <Slider
                                  value={interest.weight}
                                  onChange={(_, value) => handleWeightChange(interest.id, value as number)}
                                  min={1}
                                  max={10}
                                  marks
                                  valueLabelDisplay="auto"
                                  size="small"
                                  sx={{
                                    color: getInterestColor(interest.id),
                                    '& .MuiSlider-thumb': {
                                      backgroundColor: getInterestColor(interest.id),
                                    },
                                    '& .MuiSlider-track': {
                                      backgroundColor: getInterestColor(interest.id),
                                    },
                                    '& .MuiSlider-rail': {
                                      backgroundColor: 'var(--bg-tertiary)',
                                    },
                                  }}
                                />
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </motion.div>
          </Grid>

          {/* Travel Preferences */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
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
                  }}
                >
                  Travel Settings
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Box>
                    <Typography 
                      variant="body1" 
                      gutterBottom
                      sx={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      Maximum Detour Distance: {preferences.maxDetour} km
                    </Typography>
                    <Slider
                      value={preferences.maxDetour}
                      onChange={(_, value) =>
                        setPreferences(prev => ({ ...prev, maxDetour: value as number }))
                      }
                      min={1}
                      max={20}
                      marks
                      valueLabelDisplay="auto"
                      sx={{
                        color: 'var(--color-sunset)',
                        '& .MuiSlider-thumb': {
                          backgroundColor: 'var(--color-sunset)',
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: 'var(--color-sunset)',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: 'var(--bg-tertiary)',
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography 
                      variant="body1" 
                      gutterBottom
                      sx={{ color: 'var(--text-primary)', fontWeight: 500 }}
                    >
                      Maximum Stops: {preferences.maxStops}
                    </Typography>
                    <Slider
                      value={preferences.maxStops}
                      onChange={(_, value) =>
                        setPreferences(prev => ({ ...prev, maxStops: value as number }))
                      }
                      min={1}
                      max={10}
                      marks
                      valueLabelDisplay="auto"
                      sx={{
                        color: 'var(--color-sunset)',
                        '& .MuiSlider-thumb': {
                          backgroundColor: 'var(--color-sunset)',
                        },
                        '& .MuiSlider-track': {
                          backgroundColor: 'var(--color-sunset)',
                        },
                        '& .MuiSlider-rail': {
                          backgroundColor: 'var(--bg-tertiary)',
                        },
                      }}
                    />
                  </Box>

                  <Divider sx={{ borderColor: 'var(--border-primary)' }} />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.avoidHighways}
                        onChange={(e) =>
                          setPreferences(prev => ({ ...prev, avoidHighways: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        Avoid Highways
                      </Typography>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.preferScenicRoutes}
                        onChange={(e) =>
                          setPreferences(prev => ({ ...prev, preferScenicRoutes: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        Prefer Scenic Routes
                      </Typography>
                    }
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.includeRestStops}
                        onChange={(e) =>
                          setPreferences(prev => ({ ...prev, includeRestStops: e.target.checked }))
                        }
                      />
                    }
                    label={
                      <Typography sx={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                        Include Rest Stops
                      </Typography>
                    }
                  />
                </Box>
              </Paper>

              {/* Selected Interests Summary */}
              {selectedInterests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Paper 
                    sx={{ 
                      p: 4, 
                      mt: 3,
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 4,
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        mb: 2,
                      }}
                    >
                      Selected Interests ({selectedInterests.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedInterests.map((interest) => (
                        <Chip
                          key={interest.id}
                          label={`${interest.name} (${interest.weight})`}
                          sx={{
                            background: `rgba(${getInterestColor(interest.id)}, 0.2)`,
                            border: `1px solid ${getInterestColor(interest.id)}`,
                            color: getInterestColor(interest.id),
                            fontWeight: 600,
                            '&:hover': {
                              background: `rgba(${getInterestColor(interest.id)}, 0.3)`,
                            },
                          }}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Paper>
                </motion.div>
              )}
            </motion.div>
          </Grid>
        </Grid>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleSavePreferences}
                startIcon={<SaveIcon />}
                sx={{ 
                  px: 6, 
                  py: 2, 
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  background: 'var(--primary-gradient)',
                  boxShadow: 'var(--shadow-soft)',
                  '&:hover': {
                    background: 'var(--primary-gradient)',
                    transform: 'translateY(-3px)',
                    boxShadow: 'var(--shadow-strong)',
                  },
                }}
              >
                Save Preferences
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Preferences; 
import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Avatar,
  Rating,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ExploreIcon from '@mui/icons-material/Explore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RouteIcon from '@mui/icons-material/Route';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <RouteIcon sx={{ fontSize: 48, color: 'var(--color-ocean)' }} />,
      title: 'Smart Route Planning',
      description: 'AI-powered route optimization with personalized POI recommendations',
      gradient: 'var(--primary-gradient)',
    },
    {
      icon: <ExploreIcon sx={{ fontSize: 48, color: 'var(--color-sunset)' }} />,
      title: 'Discover Hidden Gems',
      description: 'Find unique places and local favorites along your journey',
      gradient: 'var(--secondary-gradient)',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48, color: 'var(--color-forest)' }} />,
      title: 'Personalized Experience',
      description: 'Tailored recommendations based on your interests and preferences',
      gradient: 'var(--accent-gradient)',
    },
  ];

  const stats = [
    { icon: <TrendingUpIcon />, value: '2M+', label: 'Routes Planned' },
    { icon: <LocationOnIcon />, value: '50K+', label: 'POIs Discovered' },
    { icon: <StarIcon />, value: '4.9★', label: 'User Rating' },
    { icon: <SpeedIcon />, value: '95%', label: 'Accuracy Rate' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      avatar: 'SJ',
      rating: 5,
      text: 'NavPlace transformed my road trips! I discovered amazing places I never knew existed.',
      location: 'Travel Enthusiast',
    },
    {
      name: 'Mike Chen',
      avatar: 'MC',
      rating: 5,
      text: 'The personalized recommendations are spot-on. It feels like having a local guide!',
      location: 'Business Traveler',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 4, sm: 6, md: 8, lg: 12 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  component="h1"
                  gutterBottom
                  className="text-primary"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1,
                    mb: { xs: 2, md: 3 },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Discover Amazing
                  <br />
                  <span style={{ 
                    background: 'var(--primary-gradient)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent', 
                    backgroundClip: 'text' 
                  }}>
                    Places
                  </span>
                </Typography>
                
                <Typography
                  variant="h5"
                  paragraph
                  className="text-secondary"
                  sx={{
                    mb: { xs: 3, md: 4 },
                    lineHeight: 1.6,
                    fontWeight: 400,
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    textAlign: { xs: 'center', md: 'left' },
                  }}
                >
                  Transform every car journey into an adventure with AI-powered personalized recommendations. 
                  From historic landmarks to hidden gems, discover the best places along your route.
                </Typography>

                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 1, sm: 2 }, 
                  flexWrap: 'wrap', 
                  mb: { xs: 4, md: 6 },
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/plan')}
                      startIcon={<RouteIcon />}
                      sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 700,
                        borderRadius: 3,
                        background: 'var(--primary-gradient)',
                        boxShadow: 'var(--shadow-soft)',
                        '&:hover': {
                          background: 'var(--primary-gradient)',
                          transform: { xs: 'none', md: 'translateY(-3px)' },
                          boxShadow: 'var(--shadow-strong)',
                        },
                      }}
                    >
                      Start Planning
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/preferences')}
                      startIcon={<FavoriteIcon />}
                      sx={{
                        px: { xs: 3, sm: 4 },
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 700,
                        borderRadius: 3,
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                        '&:hover': {
                          borderColor: 'var(--color-sunset)',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          transform: { xs: 'none', md: 'translateY(-3px)' },
                        },
                      }}
                    >
                      Set Preferences
                    </Button>
                  </motion.div>
                </Box>

                {/* Stats */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: { xs: 2, sm: 3, md: 4 }, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}>
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography
                          variant="h4"
                          className="text-accent"
                          sx={{
                            fontWeight: 800,
                            mb: 0.5,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="text-muted"
                          sx={{
                            fontWeight: 500,
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      width: 400,
                      height: 400,
                      border: '2px solid var(--border-primary)',
                      borderRadius: '50%',
                    }}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      width: 300,
                      height: 300,
                      border: '2px solid var(--color-ocean)',
                      borderRadius: '50%',
                      opacity: 0.2,
                    }}
                  />
                  <Box
                    sx={{
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '50%',
                      width: 200,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  >
                    <DirectionsCarIcon sx={{ fontSize: 80, color: 'var(--color-sunset)', opacity: 0.9 }} />
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ 
        py: { xs: 6, sm: 8, md: 12 }, 
        position: 'relative', 
        zIndex: 1,
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            gutterBottom
            className="text-primary"
            sx={{
              fontWeight: 800,
              mb: { xs: 1, md: 2 },
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
            }}
          >
            Why Choose NavPlace?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            className="text-muted"
            sx={{ 
              mb: { xs: 6, md: 8 }, 
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
            }}
          >
            Experience the future of travel planning with cutting-edge AI technology
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    p: { xs: 3, md: 4 },
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: { xs: 2, md: 4 },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: { xs: 'none', md: 'translateY(-12px) scale(1.03)' },
                      boxShadow: 'var(--shadow-strong)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: feature.gradient,
                      borderRadius: '50%',
                      width: { xs: 80, sm: 90, md: 100 },
                      height: { xs: 80, sm: 90, md: 100 },
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: { xs: 2, md: 3 },
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  >
                    {React.cloneElement(feature.icon, {
                      sx: { fontSize: { xs: 36, sm: 42, md: 48 } }
                    })}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      className="text-primary"
                      sx={{ 
                        fontWeight: 700, 
                        mb: { xs: 1, md: 2 }, 
                        fontSize: { xs: '1.25rem', sm: '1.5rem' },
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              gutterBottom
              className="text-primary"
              sx={{
                fontWeight: 800,
                mb: { xs: 1, md: 2 },
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
              }}
            >
              What Our Users Say
            </Typography>
          </motion.div>

          <Grid container spacing={{ xs: 3, md: 4 }} sx={{ mt: { xs: 3, md: 4 } }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
                >
                  <Paper
                    sx={{
                      p: { xs: 3, md: 4 },
                      background: 'var(--bg-glass)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: { xs: 2, md: 4 },
                    }}
                  >
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: { xs: 2, md: 3 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      textAlign: { xs: 'center', sm: 'left' },
                    }}>
                      <Avatar
                        sx={{
                          width: { xs: 48, sm: 56 },
                          height: { xs: 48, sm: 56 },
                          mr: { xs: 0, sm: 2 },
                          mb: { xs: 1, sm: 0 },
                          background: 'var(--primary-gradient)',
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          className="text-primary"
                          sx={{ 
                            fontWeight: 600, 
                            fontSize: { xs: '1.125rem', sm: '1.25rem' },
                          }}
                        >
                          {testimonial.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          className="text-muted"
                          sx={{ 
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                          }}
                        >
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 2 }}>
                      <Rating value={testimonial.rating} readOnly />
                    </Box>
                    <Typography 
                      variant="body1" 
                      className="text-secondary"
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        textAlign: { xs: 'center', sm: 'left' },
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 6, sm: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Paper
              sx={{
                p: { xs: 3, sm: 4, md: 8 },
                textAlign: 'center',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-primary)',
                borderRadius: { xs: 2, md: 4 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                className="text-primary"
                sx={{
                  fontWeight: 800,
                  mb: { xs: 2, md: 3 },
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                }}
              >
                Ready to Start Your Adventure?
              </Typography>
              <Typography
                variant="h6"
                paragraph
                className="text-secondary"
                sx={{ 
                  mb: { xs: 3, md: 4 }, 
                  fontWeight: 400,
                  fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                }}
              >
                Join millions of travelers who have discovered amazing places with NavPlace.
                Start planning your next unforgettable journey today.
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/plan')}
                  startIcon={<RouteIcon className="icon-primary" />}
                  className="btn-primary"
                  sx={{
                    px: { xs: 4, sm: 5, md: 6 },
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    fontWeight: 700,
                    borderRadius: 3,
                    '&:hover': {
                      background: 'var(--primary-gradient)',
                      transform: { xs: 'none', md: 'translateY(-3px)' },
                      boxShadow: 'var(--shadow-strong)',
                    },
                  }}
                >
                  Start Planning Now
                </Button>
              </motion.div>
            </Paper>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage; 
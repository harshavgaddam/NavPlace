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
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Floating background elements */}
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

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
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
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    color: 'var(--text-primary)',
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
                  sx={{
                    mb: 4,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  Transform every car journey into an adventure with AI-powered personalized recommendations. 
                  From historic landmarks to hidden gems, discover the best places along your route.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 6 }}>
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
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
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
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                        '&:hover': {
                          borderColor: 'var(--color-sunset)',
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          transform: 'translateY(-3px)',
                        },
                      }}
                    >
                      Set Preferences
                    </Button>
                  </motion.div>
                </Box>

                {/* Stats */}
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
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
                          sx={{
                            fontWeight: 800,
                            color: 'var(--color-ocean)',
                            mb: 0.5,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'var(--text-muted)',
                            fontWeight: 500,
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
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
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
            sx={{
              fontWeight: 800,
              mb: 2,
              color: 'var(--text-primary)',
            }}
          >
            Why Choose NavPlace?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 8, color: 'var(--text-muted)', fontWeight: 400 }}
          >
            Experience the future of travel planning with cutting-edge AI technology
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
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
                    p: 4,
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 4,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.03)',
                      boxShadow: 'var(--shadow-strong)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      background: feature.gradient,
                      borderRadius: '50%',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: 'var(--shadow-soft)',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 700, mb: 2, color: 'var(--text-primary)' }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}
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
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
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
              sx={{
                fontWeight: 800,
                mb: 2,
                color: 'var(--text-primary)',
              }}
            >
              What Our Users Say
            </Typography>
          </motion.div>

          <Grid container spacing={4} sx={{ mt: 4 }}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
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
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          mr: 2,
                          background: 'var(--primary-gradient)',
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                          {testimonial.location}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
      <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Paper
              sx={{
                p: { xs: 4, md: 8 },
                textAlign: 'center',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border-primary)',
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  color: 'var(--text-primary)',
                }}
              >
                Ready to Start Your Adventure?
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{ mb: 4, color: 'var(--text-secondary)', fontWeight: 400 }}
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
                  startIcon={<RouteIcon />}
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
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Explore as ExploreIcon,
  Directions as DirectionsIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import integratedTravelService, { 
  TravelRecommendation, 
  TravelPreferences 
} from '../services/IntegratedTravelService';
import { UserPreference } from '../services/GeminiService';

const AITravelDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<TravelRecommendation[]>([]);
  const [error, setError] = useState<string>('');

  const demoPreferences: TravelPreferences = {
    userPreferences: [
      { category: 'restaurant', interestLevel: 5 },
      { category: 'museum', interestLevel: 4 },
      { category: 'park', interestLevel: 3 },
      { category: 'shopping', interestLevel: 2 },
      { category: 'activity', interestLevel: 4 },
      { category: 'lodging', interestLevel: 1 },
      { category: 'photography', interestLevel: 5 },
    ],
    travelPurpose: 'leisure',
    budget: 'moderate'
  };

  const handleDemoRequest = async () => {
    setLoading(true);
    setError('');
    
    try {
      const analysis = await integratedTravelService.getComprehensiveRecommendations(
        'New York, NY',
        'Boston, MA',
        'driving',
        demoPreferences
      );
      
      setRecommendations(analysis.recommendations);
    } catch (err) {
      setError('Failed to get AI recommendations. Please check your API keys.');
      console.error('Demo error:', err);
    } finally {
      setLoading(false);
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

  const formatDistance = (kilometers: number) => {
    const miles = kilometers * 0.621371;
    return `${miles.toFixed(1)} mi`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="text-primary" sx={{ fontWeight: 700 }}>
        🤖 AI Travel Recommendations Demo
      </Typography>
      
      <Typography variant="body1" className="text-secondary" sx={{ mb: 3 }}>
        Experience the power of AI-driven travel recommendations that combine Google Maps data with Gemini AI analysis.
      </Typography>

      <Paper sx={{ p: 3, mb: 3, background: 'var(--bg-glass)', backdropFilter: 'blur(20px)' }}>
        <Typography variant="h6" gutterBottom className="text-primary">
          Demo Route: New York → Boston
        </Typography>
        <Typography variant="body2" className="text-secondary" sx={{ mb: 2 }}>
          User Preferences: Food enthusiast (5/5), Museum lover (4/5), Photography enthusiast (5/5)
        </Typography>
        
        <Button
          variant="contained"
          onClick={handleDemoRequest}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <ExploreIcon />}
          sx={{
            background: 'var(--primary-gradient)',
            '&:hover': {
              background: 'var(--primary-gradient)',
            },
          }}
        >
          {loading ? 'Getting AI Recommendations...' : 'Get AI Recommendations'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {recommendations.length > 0 && (
        <Box>
          <Typography variant="h5" gutterBottom className="text-primary" sx={{ fontWeight: 700 }}>
            AI-Powered Recommendations ({recommendations.length})
          </Typography>
          
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    background: 'var(--bg-glass-strong)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border-primary)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 'var(--shadow-strong)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                      <Avatar
                        sx={{
                          background: getImportanceColor(recommendation.importance),
                          width: 48,
                          height: 48,
                          fontSize: '1.5rem',
                        }}
                      >
                        {recommendation.source === 'gemini' ? '🤖' : '📍'}
                      </Avatar>
                      
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="h6" className="text-primary" sx={{ fontWeight: 700 }}>
                            {recommendation.name}
                          </Typography>
                          <Chip
                            label={recommendation.importance}
                            size="small"
                            sx={{
                              background: getImportanceColor(recommendation.importance),
                              color: 'white',
                              fontSize: '0.6rem',
                            }}
                          />
                          <Chip
                            label={recommendation.source}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'var(--border-primary)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.6rem',
                            }}
                          />
                        </Box>
                        
                        <Typography variant="body2" className="text-muted">
                          {recommendation.type} • {formatDistance(recommendation.distance)} from route
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" className="text-secondary" sx={{ mb: 2 }}>
                      {recommendation.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {recommendation.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
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

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {recommendation.estimatedVisitTime && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <TimeIcon sx={{ fontSize: '1rem' }} className="icon-muted" />
                            <Typography variant="caption" className="text-muted">
                              {recommendation.estimatedVisitTime}m
                            </Typography>
                          </Box>
                        )}
                        
                        {recommendation.costLevel && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MoneyIcon sx={{ fontSize: '1rem' }} className="icon-muted" />
                            <Typography variant="caption" className="text-muted">
                              {recommendation.costLevel}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <Typography variant="caption" className="text-muted">
                        {formatDistance(recommendation.distance)} away
                      </Typography>
                    </Box>

                    {recommendation.source === 'gemini' && (
                      <Box sx={{ mt: 2, p: 1, background: 'var(--bg-tertiary)', borderRadius: 1 }}>
                        <Typography variant="caption" className="text-accent" sx={{ fontWeight: 600 }}>
                          AI Recommendation:
                        </Typography>
                        <Typography variant="caption" className="text-secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {recommendation.whyRecommended}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AITravelDemo; 
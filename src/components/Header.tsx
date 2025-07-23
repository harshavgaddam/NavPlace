import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Badge,
  useTheme as useMuiTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { theme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/plan', label: 'Plan Route' },
    { path: '/preferences', label: 'Preferences' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: theme === 'light' 
          ? 'rgba(255, 255, 255, 0.9)' 
          : 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                background: theme === 'light' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 8px 32px rgba(44, 90, 160, 0.3)',
              }}
            >
              <DirectionsCarIcon sx={{ color: '#f8fafc', fontSize: 24 }} />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 800,
                background: theme === 'light' 
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
                  : 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              NavPlace
            </Typography>
          </Box>
        </motion.div>

        {/* Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <motion.div
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: location.pathname === item.path ? '#f59e0b' : (theme === 'light' ? '#1e293b' : '#f8fafc'),
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        )}

        {/* Right side icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              sx={{
                color: theme === 'light' ? '#1e293b' : '#f8fafc',
                background: 'rgba(148, 163, 184, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Badge badgeContent={3} color="warning">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              sx={{
                color: theme === 'light' ? '#1e293b' : '#f8fafc',
                background: 'rgba(148, 163, 184, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                '&:hover': {
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  color: '#f59e0b',
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <PersonIcon />
            </IconButton>
          </motion.div>

          {isMobile && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                sx={{
                  color: theme === 'light' ? '#1e293b' : '#f8fafc',
                  background: 'rgba(148, 163, 184, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    color: '#f59e0b',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 
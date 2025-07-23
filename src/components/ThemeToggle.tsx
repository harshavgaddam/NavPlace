import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: theme === 'light' ? '#1e293b' : '#f8fafc',
            background: 'rgba(148, 163, 184, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: '#f59e0b',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'light' ? 0 : 180 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {theme === 'light' ? (
              <DarkModeIcon sx={{ fontSize: 20 }} />
            ) : (
              <LightModeIcon sx={{ fontSize: 20 }} />
            )}
          </motion.div>
        </IconButton>
      </Tooltip>
    </motion.div>
  );
};

export default ThemeToggle; 
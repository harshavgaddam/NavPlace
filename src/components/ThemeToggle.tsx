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
          className="btn-secondary"
          sx={{
            color: 'var(--text-primary)',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-primary)',
            borderRadius: '50%',
            width: 40,
            height: 40,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-accent)',
              borderColor: 'var(--border-accent)',
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
              <DarkModeIcon sx={{ fontSize: 20 }} className="icon-primary" />
            ) : (
              <LightModeIcon sx={{ fontSize: 20 }} className="icon-primary" />
            )}
          </motion.div>
        </IconButton>
      </Tooltip>
    </motion.div>
  );
};

export default ThemeToggle; 
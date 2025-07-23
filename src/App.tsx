import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RoutePlanner from './pages/RoutePlanner';
import Preferences from './pages/Preferences';

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: {
        main: theme === 'light' ? '#3b82f6' : '#2c5aa0',
        light: theme === 'light' ? '#60a5fa' : '#3b82f6',
        dark: theme === 'light' ? '#1d4ed8' : '#1e3a8a',
      },
      secondary: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      background: {
        default: theme === 'light' ? '#ffffff' : '#0f172a',
        paper: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)',
      },
      text: {
        primary: theme === 'light' ? '#1e293b' : '#f8fafc',
        secondary: theme === 'light' ? '#475569' : '#cbd5e1',
      },
      success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
      },
      warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
      },
      error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3.5rem',
        lineHeight: 1.2,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.3,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      h3: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.4,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
        color: theme === 'light' ? '#1e293b' : '#f8fafc',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
        color: theme === 'light' ? '#475569' : '#cbd5e1',
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: theme === 'light' ? '#64748b' : '#94a3b8',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        fontSize: '1rem',
      },
    },
    shape: {
      borderRadius: 16,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            padding: '12px 24px',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: theme === 'light' 
              ? '0 8px 32px rgba(0, 0, 0, 0.1)' 
              : '0 8px 32px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme === 'light' 
                ? '0 20px 60px rgba(0, 0, 0, 0.15)' 
                : '0 20px 60px rgba(0, 0, 0, 0.4)',
            },
          },
          contained: {
            background: theme === 'light' 
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' 
              : 'linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)',
            color: '#f8fafc',
            '&:hover': {
              background: theme === 'light' 
                ? 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)' 
                : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            },
          },
          outlined: {
            borderColor: theme === 'light' 
              ? 'rgba(148, 163, 184, 0.3)' 
              : 'rgba(148, 163, 184, 0.3)',
            color: theme === 'light' ? '#1e293b' : '#f8fafc',
            '&:hover': {
              borderColor: '#f59e0b',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: theme === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme === 'light' 
              ? 'rgba(148, 163, 184, 0.2)' 
              : 'rgba(148, 163, 184, 0.2)'}`,
            borderRadius: 24,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-8px) scale(1.02)',
              boxShadow: theme === 'light' 
                ? '0 20px 60px rgba(0, 0, 0, 0.15)' 
                : '0 20px 60px rgba(0, 0, 0, 0.4)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: theme === 'light' 
              ? 'rgba(255, 255, 255, 0.8)' 
              : 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${theme === 'light' 
              ? 'rgba(148, 163, 184, 0.2)' 
              : 'rgba(148, 163, 184, 0.2)'}`,
            borderRadius: 24,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              background: theme === 'light' 
                ? 'rgba(248, 250, 252, 0.6)' 
                : 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${theme === 'light' 
                ? 'rgba(148, 163, 184, 0.2)' 
                : 'rgba(148, 163, 184, 0.2)'}`,
              borderRadius: 16,
              color: theme === 'light' ? '#1e293b' : '#f8fafc',
              '&:hover': {
                borderColor: 'rgba(245, 158, 11, 0.5)',
              },
              '&.Mui-focused': {
                borderColor: '#f59e0b',
              },
            },
            '& .MuiInputLabel-root': {
              color: theme === 'light' ? '#64748b' : '#94a3b8',
              '&.Mui-focused': {
                color: '#f59e0b',
              },
            },
            '& .MuiInputBase-input': {
              color: theme === 'light' ? '#1e293b' : '#f8fafc',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: theme === 'light' 
              ? 'rgba(255, 255, 255, 0.9)' 
              : 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${theme === 'light' 
              ? 'rgba(148, 163, 184, 0.2)' 
              : 'rgba(148, 163, 184, 0.2)'}`,
            boxShadow: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            background: theme === 'light' 
              ? 'rgba(248, 250, 252, 0.8)' 
              : 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${theme === 'light' 
              ? 'rgba(148, 163, 184, 0.2)' 
              : 'rgba(148, 163, 184, 0.2)'}`,
            color: theme === 'light' ? '#1e293b' : '#f8fafc',
            fontWeight: 500,
          },
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            color: '#f59e0b',
          },
          thumb: {
            backgroundColor: '#f59e0b',
          },
          track: {
            backgroundColor: '#f59e0b',
          },
          rail: {
            backgroundColor: theme === 'light' ? '#cbd5e1' : '#475569',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: '#f59e0b',
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#f59e0b',
            },
          },
        },
      },
      MuiRating: {
        styleOverrides: {
          root: {
            color: '#fbbf24',
          },
        },
      },
    },
  });

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/plan" element={<RoutePlanner />} />
              <Route path="/preferences" element={<Preferences />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 
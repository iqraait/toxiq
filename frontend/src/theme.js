import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1e3a8a',      // Royal Blue
      dark: '#172554',
      light: '#3b82f6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0d9488',      // Teal
      dark: '#115e59',
      light: '#2dd4bf',
      contrastText: '#ffffff',
    },
    accent: {
      main: '#7c3aed',      // Deep Purple
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',   // Light Slate
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      light: '#94a3b8',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#047857',
    },
  },
  typography: {
    fontFamily: "'Raleway', 'Inter', sans-serif",
    h1: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 800,
    },
    h2: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Raleway', sans-serif",
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: "'Raleway', sans-serif",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '30px',
          padding: '8px 22px',
          boxShadow: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.03)',
          border: '1px solid #f1f5f9',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
  },
});

export default theme;
export const glassmorphismStyles = {
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.45)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.06)',
};
export const purpleGradientText = {
  background: 'linear-gradient(135deg, #1e3a8a 30%, #7c3aed 90%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

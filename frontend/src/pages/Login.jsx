import React, { useState, useContext, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

import { AuthContext } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    const result = await login(username, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)',
        py: 6
      }}
    >
      <Container maxWidth="sm">
        <GlassCard sx={{ p: 4.5, border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <Box 
              sx={{ 
                bgcolor: 'primary.main', 
                color: '#fff', 
                p: 1.5, 
                borderRadius: '50%', 
                mb: 2,
                boxShadow: '0 4px 20px rgba(30, 58, 138, 0.25)'
              }}
            >
              <LocalHospitalIcon fontSize="large" />
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="900" 
              fontFamily="'Raleway', sans-serif" 
              sx={purpleGradientText}
              gutterBottom
            >
              TOXIQ Portal
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              Please authenticate to access program management panel.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.5, 
                fontSize: '1rem', 
                fontWeight: 'bold',
                borderRadius: '30px'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </form>
          
          <Box mt={3} display="flex" justifyContent="center">
            <Typography variant="caption" color="text.light" align="center">
              TOXIQ Program Security Secretariate &copy; {new Date().getFullYear()}
            </Typography>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  );
};

export default Login;

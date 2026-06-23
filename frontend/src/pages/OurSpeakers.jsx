import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, 
  Avatar, CardContent, Alert, Stack, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const OurSpeakers = () => {
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const host = API.defaults.baseURL.replace(/\/api\/?$/, '');
    let cleanPath = path;
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    if (!cleanPath.startsWith('/media/')) {
      cleanPath = '/media' + cleanPath;
    }
    return `${host}${cleanPath}`;
  };

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await API.get('cms/home/');
        setSpeakers(res.data.speakers || []);
      } catch (err) {
        console.error('Error fetching speakers:', err);
        setError('Failed to load guest speakers.');
      } finally {
        setLoading(false);
      }
    };
    fetchSpeakers();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} mb={6}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button 
              variant="outlined" 
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ borderRadius: '20px' }}
            >
              Back
            </Button>
            <Typography 
              variant="h4" 
              fontWeight="950" 
              fontFamily="'Raleway', sans-serif" 
              sx={purpleGradientText}
            >
              Distinguished Guest Speakers
            </Typography>
          </Stack>
          
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/article-submission')}
            sx={{ 
              borderRadius: '20px', 
              px: 3.5, 
              py: 1.2, 
              fontWeight: 850,
              boxShadow: '0 6px 20px rgba(13, 148, 136, 0.2)'
            }}
          >
            Submit Article
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={12}>
            <CircularProgress color="secondary" size={60} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : speakers.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: '12px' }}>No speakers have been added yet. Please check back later.</Alert>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: '30px',
              alignItems: 'stretch'
            }}
          >
            {speakers.map((sp) => (
              <GlassCard 
                key={sp.id}
                sx={{ 
                  height: '100%', 
                  bgcolor: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.03)',
                  border: '1.5px solid rgba(226, 232, 240, 0.8)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 20px 50px rgba(13, 148, 136, 0.08)',
                    borderColor: 'secondary.main'
                  }
                }}
              >
                <CardContent sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'flex-start', flexGrow: 1, flexDirection: 'row' }}>
                  <Avatar 
                    src={getImageUrl(sp.photo)} 
                    alt={sp.name} 
                    sx={{ 
                      width: 75, 
                      height: 75, 
                      flexShrink: 0, 
                      border: '3px solid rgba(13, 148, 136, 0.15)', 
                      boxShadow: '0 6px 16px rgba(13, 148, 136, 0.1)',
                      bgcolor: 'secondary.main',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '1.4rem'
                    }}
                  >
                    {sp.name.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  
                  <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" flexGrow={1}>
                    <Box>
                      <Typography variant="h6" fontWeight="900" mb={0.5} color="primary.main" sx={{ fontSize: '1.25rem', fontFamily: "'Raleway', sans-serif" }}>
                        {sp.name}
                      </Typography>
                      <Typography variant="caption" fontWeight="800" color="secondary.main" mb={1.8} sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {sp.designation}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6, fontSize: '0.88rem' }}>
                        {sp.description}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </GlassCard>
            ))}
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default OurSpeakers;

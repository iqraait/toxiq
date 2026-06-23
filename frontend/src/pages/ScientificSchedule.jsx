import React from 'react';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const ScientificSchedule = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="md" sx={{ py: 12, flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <GlassCard sx={{ 
          p: 6, 
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #0d9488 0%, #7c3aed 100%)',
            borderRadius: '16px 16px 0 0'
          }
        }}>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              bgcolor: 'rgba(13, 148, 136, 0.08)', 
              border: '3px solid #0d9488',
              color: '#0d9488',
              mb: 4,
              animation: 'pulse 2s infinite'
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: '2.5rem' }} />
          </Box>

          <Typography 
            variant="h3" 
            fontWeight="950" 
            fontFamily="'Raleway', sans-serif" 
            sx={{ ...purpleGradientText, mb: 2 }}
          >
            Scientific Schedule
          </Typography>

          <Typography 
            variant="h5" 
            color="primary.main" 
            fontWeight="800" 
            sx={{ mb: 3, letterSpacing: '0.5px' }}
          >
            COMING SOON
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 5, maxWidth: '550px', mx: 'auto', lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            The detailed schedule of scientific keynotes, panel discussions, toxicology quiz rounds, and abstract paper presentations is currently being finalized by our academic committee. 
            Register today to receive the program schedule updates directly in your email.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
            <Button 
              variant="outlined" 
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ px: 4, py: 1.5, borderRadius: '30px', fontWeight: '800' }}
            >
              Go Back
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/registration')}
              sx={{ 
                px: 5, 
                py: 1.5, 
                borderRadius: '30px', 
                fontWeight: '850',
                boxShadow: '0 8px 20px rgba(13, 148, 136, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 28px rgba(13, 148, 136, 0.35)'
                }
              }}
            >
              Register Now
            </Button>
          </Stack>
        </GlassCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default ScientificSchedule;

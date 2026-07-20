import React, { useState } from 'react';
import { 
  Container, Typography, Box, Button, Stack, 
  Dialog, DialogContent, IconButton, Tooltip, Chip 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PaymentIcon from '@mui/icons-material/Payment';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

import schedulePage1 from '../assets/schedule_page1.jpg';
import schedulePage2 from '../assets/schedule_page2.jpg';
import schedulePage3 from '../assets/schedule_page3.jpg';

const schedulePages = [
  { id: 1, title: 'Day 1 — Saturday, 1 August 2026 (Morning & Midday Sessions)', src: schedulePage1 },
  { id: 2, title: 'Day 1 — Saturday, 1 August 2026 (Afternoon & Evening Sessions)', src: schedulePage2 },
  { id: 3, title: 'Day 2 — Sunday, 2 August 2026 (Full Day & Valedictory)', src: schedulePage3 },
];

const ScientificSchedule = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenImage = (src) => {
    setSelectedImage(src);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        {/* Header Card */}
        <GlassCard sx={{ 
          p: { xs: 3, md: 5 }, 
          mb: 5, 
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #1e3a8a 0%, #0d9488 50%, #7c3aed 100%)',
            borderRadius: '16px 16px 0 0'
          }
        }}>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: 70, 
              height: 70, 
              borderRadius: '50%', 
              bgcolor: 'rgba(13, 148, 136, 0.08)', 
              border: '3px solid #0d9488',
              color: '#0d9488',
              mb: 2.5
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: '2.4rem' }} />
          </Box>

          <Typography 
            variant="h3" 
            fontWeight="950" 
            fontFamily="'Raleway', sans-serif" 
            sx={{ ...purpleGradientText, mb: 1, fontSize: { xs: '2rem', md: '2.8rem' } }}
          >
            Scientific Program Schedule
          </Typography>

          <Typography 
            variant="h6" 
            color="primary.main" 
            fontWeight="700" 
            sx={{ mb: 3 }}
          >
            TOXIQ '26 — National Clinical Toxicology Conference | 1 & 2 August 2026
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" alignItems="center">
            <Button 
              variant="outlined" 
              color="secondary"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ px: 3.5, py: 1.2, borderRadius: '30px', fontWeight: '800' }}
            >
              Go Back
            </Button>
            
            <Button 
              variant="contained" 
              color="secondary"
              startIcon={<PaymentIcon />}
              onClick={() => navigate('/registration')}
              sx={{ 
                px: 4.5, 
                py: 1.2, 
                borderRadius: '30px', 
                fontWeight: '850',
                boxShadow: '0 8px 20px rgba(13, 148, 136, 0.25)',
                '&:hover': {
                  boxShadow: '0 12px 28px rgba(13, 148, 136, 0.35)'
                }
              }}
            >
              Register For Conference
            </Button>
          </Stack>
        </GlassCard>

        {/* Big High-Res Schedule Images Section */}
        <Stack spacing={5}>
          {schedulePages.map((page) => (
            <GlassCard 
              key={page.id}
              sx={{ 
                p: { xs: 1.5, sm: 2.5, md: 3 }, 
                border: '1px solid rgba(30, 58, 138, 0.12)', 
                boxShadow: '0 15px 45px rgba(0,0,0,0.06)',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 20px 55px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} px={1}>
                <Chip 
                  label={page.title} 
                  color="primary" 
                  sx={{ 
                    fontWeight: '800', 
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    py: 2.2, 
                    px: 1.5,
                    borderRadius: '12px',
                    bgcolor: '#1e3a8a'
                  }} 
                />

                <Stack direction="row" spacing={1}>
                  <Tooltip title="Click to view full screen">
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      startIcon={<ZoomInIcon />}
                      onClick={() => handleOpenImage(page.src)}
                      sx={{ borderRadius: '20px', fontWeight: '700' }}
                    >
                      Enlarge
                    </Button>
                  </Tooltip>
                  <Tooltip title="Download Image">
                    <IconButton 
                      component="a" 
                      href={page.src} 
                      download={`TOXIQ2026_Schedule_Page_${page.id}.jpg`}
                      color="primary"
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box 
                onClick={() => handleOpenImage(page.src)}
                sx={{ 
                  cursor: 'zoom-in', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  bgcolor: '#ffffff',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <img 
                  src={page.src} 
                  alt={page.title} 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block', 
                    borderRadius: '12px',
                    objectFit: 'contain'
                  }} 
                />
              </Box>
            </GlassCard>
          ))}
        </Stack>

        {/* Bottom CTA Card */}
        <Box mt={6} textAlign="center">
          <GlassCard sx={{ p: 4, borderRadius: '20px', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
            <Typography variant="h5" fontWeight="800" color="primary.main" mb={1.5}>
              Ready to attend TOXIQ '26?
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              Reserve your seat for India's premier clinical toxicology conference.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary"
              size="large"
              startIcon={<PaymentIcon />}
              onClick={() => navigate('/registration')}
              sx={{ px: 6, py: 1.5, borderRadius: '30px', fontWeight: '800', fontSize: '1.1rem' }}
            >
              Register Now
            </Button>
          </GlassCard>
        </Box>
      </Container>

      {/* Fullscreen Image Lightbox Modal */}
      <Dialog 
        open={Boolean(selectedImage)} 
        onClose={handleCloseImage}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            overflow: 'hidden',
            p: 1
          }
        }}
      >
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton 
            onClick={handleCloseImage} 
            sx={{ color: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 1, overflow: 'auto' }}>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Scientific Schedule Fullscreen" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '85vh', 
                objectFit: 'contain',
                borderRadius: '8px'
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default ScientificSchedule;


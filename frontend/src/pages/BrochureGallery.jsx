import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Button, 
  Card, CardContent, Stack, useTheme, CardActions,
  Divider, CircularProgress
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';

const BrochureGallery = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const host = API.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${host}${path}`;
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await API.get('cms/home/');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching brochures and gallery:', err);
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" className="gradient-bg">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={50} color="primary" />
          <Typography variant="body1" color="textSecondary">Loading Brochures & Gallery...</Typography>
        </Stack>
      </Box>
    );
  }

  const { brochures = [], gallery = [], content = {} } = data || {};
  const contact = content.contact_details || {};

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      {/* Hero Header */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          py: 8,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none'
          }}
        />
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 900, 
              mb: 2,
              fontFamily: "'Raleway', sans-serif",
              letterSpacing: '-1px'
            }}
          >
            Brochures & Gallery
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#2dd4bf', 
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto',
              opacity: 0.9,
              fontSize: '1.1rem'
            }}
          >
            Download official conference brochures, programs, schedules, and view highlights from previous symposiums.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        
        {/* Brochures Section */}
        <Box mb={10}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: 'primary.main', 
              mb: 1, 
              fontFamily: "'Raleway', sans-serif" 
            }}
          >
            Official Downloads & Brochures
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4}>
            Click the download buttons below to view or save the official program PDF guides.
          </Typography>

          {brochures.length === 0 ? (
            <GlassCard sx={{ p: 6, textAlign: 'center' }}>
              <PictureAsPdfIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" fontWeight="bold">
                No Brochures Available
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Please check back later for official PDF downloads.
              </Typography>
            </GlassCard>
          ) : (
            <Grid container spacing={3}>
              {brochures.map((b) => (
                <Grid item xs={12} sm={6} md={4} key={b.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      bgcolor: '#ffffff',
                      borderRadius: '20px',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                      border: '1.5px solid rgba(226, 232, 240, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.06)',
                        borderColor: '#0d9488'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction="row" spacing={2.5} alignItems="flex-start" mb={2.5}>
                        <Box 
                          sx={{ 
                            width: 50, 
                            height: 50, 
                            borderRadius: '12px', 
                            bgcolor: 'rgba(239, 68, 68, 0.08)',
                            border: '1.5px solid rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <PictureAsPdfIcon sx={{ fontSize: '1.8rem' }} />
                        </Box>
                        <Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="800" 
                            color="text.primary"
                            sx={{ fontSize: '1.15rem', lineHeight: 1.3, fontFamily: "'Raleway', sans-serif" }}
                          >
                            {b.name}
                          </Typography>
                        </Box>
                      </Stack>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6, minHeight: '60px' }}>
                        {b.description || 'No description provided.'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 4, pb: 4, pt: 0 }}>
                      <Button 
                        variant="contained" 
                        color="secondary" 
                        fullWidth
                        startIcon={<CloudDownloadIcon />}
                        href={getFileUrl(b.pdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          py: 1.2, 
                          borderRadius: '12px', 
                          fontWeight: '800',
                          textTransform: 'none'
                        }}
                      >
                       Read Me 
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Gallery Section */}
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: 'primary.main', 
              mb: 1, 
              fontFamily: "'Raleway', sans-serif" 
            }}
          >
            Symposium Gallery
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={5}>
            Highlights from the previous TOXIQ events and clinical emergency workshops.
          </Typography>

          {gallery.length === 0 ? (
            <GlassCard sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No gallery images uploaded.
              </Typography>
            </GlassCard>
          ) : (
            <Grid container spacing={2.5}>
              {gallery.map((g) => (
                <Grid item xs={12} sm={6} md={3} key={g.id}>
                  <Box 
                    sx={{ 
                      position: 'relative', 
                      borderRadius: 4, 
                      overflow: 'hidden', 
                      height: '240px', 
                      boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                      border: '1.5px solid rgba(226, 232, 240, 0.6)',
                      '&:hover img': { transform: 'scale(1.08)' },
                      '&:hover .caption-overlay': { opacity: 1 }
                    }}
                  >
                    <img 
                      src={getFileUrl(g.image)} 
                      alt={g.caption} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease-in-out' }}
                    />
                    <Box 
                      className="caption-overlay"
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, left: 0, right: 0, 
                        bgcolor: 'rgba(15, 23, 42, 0.85)', 
                        color: '#fff', 
                        p: 2, 
                        opacity: 0, 
                        transition: 'opacity 0.3s ease-in-out',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.85rem' }}>
                        {g.caption || 'TOXIQ Conference'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

      </Container>

      <Footer contact={contact} />
    </Box>
  );
};

export default BrochureGallery;

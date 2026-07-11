import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Button, 
  Card, CardContent, Stack, useTheme, CardActions,
  Divider, CircularProgress, Chip, Dialog, IconButton
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CollectionsIcon from '@mui/icons-material/Collections';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';

const BrochureGallery = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxCaption, setLightboxCaption] = useState('');

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
            Download official conference brochures, programs, schedules, and view highlights from Toxiq 2026
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
              mb: 4, 
              fontFamily: "'Raleway', sans-serif" 
            }}
          >
            Symposium Gallery
          </Typography>

          {gallery.length === 0 ? (
            <GlassCard sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                No gallery images uploaded.
              </Typography>
            </GlassCard>
          ) : (() => {
            // Group gallery images by folders dynamically
            const folderMap = {};
            gallery.forEach((g) => {
              let folderName = 'Symposium Highlights';
              let cleanCaption = g.caption || 'TOXIQ Highlight';
              
              if (g.caption) {
                if (g.caption.includes(':')) {
                  const parts = g.caption.split(':');
                  folderName = parts[0].trim();
                  cleanCaption = parts.slice(1).join(':').trim();
                } else if (g.caption.includes(' - ')) {
                  const parts = g.caption.split(' - ');
                  folderName = parts[0].trim();
                  cleanCaption = parts.slice(1).join(' - ').trim();
                } else if (g.caption.includes('/')) {
                  const parts = g.caption.split('/');
                  folderName = parts[0].trim();
                  cleanCaption = parts.slice(1).join('/').trim();
                }
              }
              
              if (!folderMap[folderName]) {
                folderMap[folderName] = [];
              }
              
              folderMap[folderName].push({
                ...g,
                cleanCaption
              });
            });

            const folderNames = Object.keys(folderMap);

            if (!selectedFolder) {
              return (
                <Grid container spacing={3.5}>
                  {folderNames.map((folderName) => {
                    const imagesInFolder = folderMap[folderName];
                    const coverImage = imagesInFolder[0]?.image;
                    const coverUrl = getFileUrl(coverImage);
                    
                    return (
                      <Grid item xs={12} sm={6} md={4} key={folderName}>
                        <Card 
                          onClick={() => setSelectedFolder(folderName)}
                          sx={{ 
                            cursor: 'pointer',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            position: 'relative',
                            height: '280px',
                            border: '1.5px solid rgba(226, 232, 240, 0.7)',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
                            transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 20px 40px rgba(13, 148, 136, 0.12)',
                              borderColor: 'secondary.main',
                              '& .folder-cover': { transform: 'scale(1.08)' },
                              '& .folder-badge': { bgcolor: 'secondary.main', color: '#fff' }
                            }
                          }}
                        >
                          {coverUrl ? (
                            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
                              <img 
                                src={coverUrl} 
                                alt={folderName} 
                                className="folder-cover"
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover', 
                                  transition: 'all 0.4s ease-in-out' 
                                }}
                              />
                              <Box sx={{ 
                                position: 'absolute', 
                                top: 0, left: 0, right: 0, bottom: 0, 
                                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 60%, rgba(15, 23, 42, 0.15) 100%)' 
                              }} />
                            </Box>
                          ) : (
                            <Box sx={{ 
                              position: 'absolute', 
                              top: 0, left: 0, right: 0, bottom: 0, 
                              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <CollectionsIcon sx={{ fontSize: '4rem', color: 'rgba(255,255,255,0.15)' }} />
                            </Box>
                          )}

                          <Box sx={{
                            position: 'absolute',
                            top: 20,
                            left: 20,
                            bgcolor: 'rgba(15, 23, 42, 0.75)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '12px',
                            px: 2,
                            py: 0.8,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            zIndex: 2
                          }}>
                            <FolderIcon sx={{ color: '#2dd4bf', fontSize: '1.2rem' }} />
                            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              Album
                            </Typography>
                          </Box>

                          <Box sx={{ p: 4, zIndex: 2, color: '#ffffff' }}>
                            <Typography 
                              variant="h5" 
                              fontWeight="900" 
                              sx={{ 
                                fontFamily: "'Raleway', sans-serif", 
                                mb: 1,
                                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                              }}
                            >
                              {folderName}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Chip 
                                className="folder-badge"
                                label={`${imagesInFolder.length} Photo${imagesInFolder.length > 1 ? 's' : ''}`}
                                size="small"
                                sx={{ 
                                  bgcolor: 'rgba(255,255,255,0.15)', 
                                  color: '#ffffff', 
                                  fontWeight: '800',
                                  fontSize: '0.75rem',
                                  transition: 'all 0.3s ease'
                                }}
                              />
                              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Click to explore &rarr;
                              </Typography>
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            }

            return (
              <Box>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4}>
                  <Box>
                    <Button 
                      startIcon={<ArrowBackIcon />}
                      onClick={() => setSelectedFolder(null)}
                      sx={{ 
                        mb: 2, 
                        color: 'primary.main', 
                        fontWeight: '800',
                        textTransform: 'none',
                        borderRadius: '12px',
                        border: '1.5px solid',
                        borderColor: 'primary.main',
                        px: 2.5,
                        py: 1,
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: '#ffffff'
                        }
                      }}
                    >
                      Back to Albums
                    </Button>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 900, 
                        color: 'primary.main', 
                        fontFamily: "'Raleway', sans-serif",
                        mt: 1
                      }}
                    >
                      {selectedFolder}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Viewing {folderMap[selectedFolder].length} images in this album. Click an image to view in full resolution.
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={2.5}>
                  {folderMap[selectedFolder].map((g) => (
                    <Grid item xs={12} sm={6} md={3} key={g.id}>
                      <Box 
                        onClick={() => {
                          setLightboxImage(getFileUrl(g.image));
                          setLightboxCaption(g.cleanCaption || 'TOXIQ Highlight');
                        }}
                        sx={{ 
                          position: 'relative', 
                          borderRadius: '20px', 
                          overflow: 'hidden', 
                          height: '240px', 
                          cursor: 'pointer',
                          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                          border: '1.5px solid rgba(226, 232, 240, 0.8)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': { 
                            transform: 'scale(1.03) translateY(-4px)',
                            boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
                            borderColor: 'secondary.main',
                            '& img': { transform: 'scale(1.05)' },
                            '& .caption-overlay': { opacity: 1 }
                          }
                        }}
                      >
                        <img 
                          src={getFileUrl(g.image)} 
                          alt={g.cleanCaption} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            transition: 'all 0.4s ease-in-out' 
                          }}
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
                            textAlign: 'center',
                            backdropFilter: 'blur(3px)'
                          }}
                        >
                          <Typography variant="body2" fontWeight="800" sx={{ fontSize: '0.85rem' }}>
                            {g.cleanCaption}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })()}
        </Box>

        {/* Lightbox Modal */}
        <Dialog 
          open={!!lightboxImage} 
          onClose={() => setLightboxImage(null)}
          maxWidth="lg"
          PaperProps={{
            sx: {
              bgcolor: 'rgba(15, 23, 42, 0.95)',
              boxShadow: 'none',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        >
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, pt: 6 }}>
            <IconButton 
              onClick={() => setLightboxImage(null)}
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                color: '#ffffff',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <CloseIcon />
            </IconButton>
            
            {lightboxImage && (
              <img 
                src={lightboxImage} 
                alt={lightboxCaption} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '75vh', 
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                }} 
              />
            )}
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#ffffff', 
                mt: 3, 
                fontWeight: '700',
                textAlign: 'center',
                fontFamily: "'Raleway', sans-serif"
              }}
            >
              {lightboxCaption}
            </Typography>
          </Box>
        </Dialog>

      </Container>

      <Footer contact={contact} />
    </Box>
  );
};

export default BrochureGallery;

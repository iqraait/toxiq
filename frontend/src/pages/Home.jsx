import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Button, 
  Card, CardContent, Avatar, Chip, Stack, useTheme, Alert,
  Link, Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupsIcon from '@mui/icons-material/Groups';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import MedicationIcon from '@mui/icons-material/Medication';
import HubIcon from '@mui/icons-material/Hub';

import API from '../services/api';
import GlassCard from '../components/GlassCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { purpleGradientText } from '../theme';
import anverPhoto from '../assets/anver.jpg';
import shamsudeenPhoto from '../assets/shamsudeen.jpg';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
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
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creditOpen, setCreditOpen] = useState(false);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const res = await API.get('cms/home/');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching home content:', err);
        setError('Failed to load page content.');
      } finally {
        setLoading(false);
      }
    };
    fetchHomeContent();
  }, []);

  useEffect(() => {
    if (!loading && location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [loading, location]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h6" color="textSecondary">Loading TOXIQ Conference Portal...</Typography>
      </Box>
    );
  }

  const { banners = [], speakers = [], sponsors = [], gallery = [], content = {} } = data || {};
  const activeBanner = banners[0] || {
    title: '12th Annual Clinical Toxicology Symposium',
    subtitle: 'TOXIQ 2026: Navigating Complex Poisoning & Venomous Bites',
    cta_text: 'Register Now',
    cta_link: '/registration'
  };

  const about = content.about_content || { title: 'About TOXIQ Program', text: '<p>Loading about information...</p>' };
  const dates = content.important_dates || { registration_open: 'N/A', registration_close: 'N/A', article_deadline: 'N/A' };
  const contact = content.contact_details || {};
  
  // Custom highlights
  const highlights = [
    { 
      title: 'ToxIQUEST', 
      desc: 'National Toxicology Quiz Competition', 
      icon: <MedicationIcon sx={{ fontSize: 24, color: '#ffffff' }} />,
      color: '#0d9488',
      link: '/toxiquest'
    },
    { 
      title: 'Abstract Submission Guidelines', 
      desc: 'Guidelines for case reports, case series, completed research, and oral/poster presentations.', 
      icon: <AssignmentIcon sx={{ fontSize: 24, color: '#ffffff' }} />,
      color: '#1e3a8a',
      link: '/abstract-guidelines'
    },
    { 
      title: 'Credit Hours', 
      desc: 'Earn CME credit hours recognized by medical councils.', 
      icon: <GroupsIcon sx={{ fontSize: 24, color: '#ffffff' }} />,
      color: '#7c3aed',
      link: 'popup:credit-hours'
    }
  ];

  const handleBannerCta = () => {
    const link = activeBanner.cta_link || '/registration';
    if (link.startsWith('#')) {
      const id = link.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.startsWith('/')) {
      navigate(link);
    } else {
      window.location.href = link;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      {/* Hero Banner Section */}
      {!(activeBanner.title || activeBanner.subtitle) && activeBanner.image ? (
        <Box sx={{ width: '100%', overflow: 'hidden' }}>
          <img 
            src={getImageUrl(activeBanner.image)} 
            alt="TOXIQ Conference Banner" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </Box>
      ) : (
        <Box 
          sx={{ 
            background: activeBanner.image 
              ? `linear-gradient(rgba(4, 27, 58, 0.82), rgba(3, 20, 45, 0.88)), url('${getImageUrl(activeBanner.image)}') no-repeat center center / cover`
              : 'linear-gradient(135deg, #091b29 0%, #062425 100%)', // Fallback premium dark gradient
            color: '#ffffff',
            py: activeBanner.title || activeBanner.subtitle ? { xs: 10, md: 15 } : 0,
            minHeight: activeBanner.title || activeBanner.subtitle ? 'auto' : { xs: '250px', sm: '400px', md: '500px' },
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          {/* Subtle grid background pattern */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: 0.05,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0), radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
              pointerEvents: 'none'
            }}
          />
          
          {(activeBanner.title || activeBanner.subtitle) && (
            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {activeBanner.title && (
                  <Typography 
                    variant="h2" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 2, 
                      fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem' },
                      letterSpacing: '-1.5px',
                      lineHeight: 1.15,
                      textShadow: '0 4px 15px rgba(0,0,0,0.5)'
                    }}
                  >
                    {activeBanner.title}
                  </Typography>
                )}
                
                {activeBanner.subtitle && (
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 3, 
                      color: '#2dd4bf', 
                      fontWeight: 700,
                      fontSize: { xs: '1.15rem', sm: '1.4rem', md: '1.75rem' },
                      lineHeight: 1.3,
                      textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      maxWidth: '800px'
                    }}
                  >
                    {activeBanner.subtitle}
                  </Typography>
                )}
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 5, 
                    color: '#cbd5e1', 
                    fontWeight: 400,
                    maxWidth: '650px',
                    lineHeight: 1.8,
                    fontSize: { xs: '0.95rem', md: '1.08rem' },
                    textShadow: '0 2px 6px rgba(0,0,0,0.5)'
                  }}
                >
                  Join experts, researchers, and healthcare professionals for a comprehensive toxicology program with hands-on learning and scientific exchange.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    sx={{ px: 5, py: 1.8, borderRadius: '30px', fontSize: '1rem', fontWeight: 800, minWidth: '180px' }}
                    onClick={handleBannerCta}
                  >
                    {activeBanner.cta_text || 'Register Now'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    sx={{ 
                      px: 5, 
                      py: 1.8, 
                      borderRadius: '30px', 
                      fontSize: '1rem', 
                      color: '#ffffff', 
                      borderColor: 'rgba(255,255,255,0.4)',
                      fontWeight: 800,
                      minWidth: '180px',
                      '&:hover': {
                        borderColor: '#2dd4bf',
                        color: '#2dd4bf',
                        bgcolor: 'rgba(45, 212, 191, 0.05)'
                      }
                    }}
                    onClick={() => {
                      const docSection = document.getElementById('about-section');
                      if (docSection) docSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    View Program
                  </Button>
                </Stack>
              </Box>
            </Container>
          )}
        </Box>
      )}

      {/* Statistics / Highlights Section */}
      <Container 
        maxWidth={false} 
        sx={{ 
          maxWidth: '1400px', 
          mx: 'auto', 
          mt: (activeBanner.title || activeBanner.subtitle) ? -6 : { xs: 2, sm: 4, md: 6 }, 
          mb: 8, 
          zIndex: 10,
          px: { xs: 2, sm: 3, md: 4 }
        }}
      >
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
          {highlights.map((hl, idx) => (
            <Card 
              key={idx}
              onClick={() => {
                if (hl.link === 'popup:credit-hours') {
                  setCreditOpen(true);
                } else if (hl.link.startsWith('#')) {
                  const element = document.getElementById(hl.link.substring(1));
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate(hl.link);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              sx={{ 
                height: '100%', 
                bgcolor: '#ffffff',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
                border: '1.5px solid rgba(226, 232, 240, 0.8)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
                  borderColor: hl.color
                }
              }}
            >
              <CardContent sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'flex-start', flexGrow: 1, flexDirection: 'row' }}>
                <Avatar sx={{ bgcolor: hl.color, width: 60, height: 60, flexShrink: 0, boxShadow: `0 8px 20px ${hl.color}20` }}>
                  {React.cloneElement(hl.icon, { sx: { fontSize: 28, color: '#ffffff' } })}
                </Avatar>
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" flexGrow={1}>
                  <Box>
                    <Typography variant="h6" fontWeight="800" mb={1.5} color="text.primary" sx={{ fontSize: '1.2rem', fontFamily: "'Raleway', sans-serif" }}>
                      {hl.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6, mb: 2.5, fontSize: '0.9rem' }}>
                      {hl.desc}
                    </Typography>
                  </Box>
                  <Typography 
                    sx={{ 
                      color: hl.color, 
                      fontWeight: '700', 
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      width: 'fit-content',
                      transition: 'gap 0.2s ease',
                      '&:hover': { 
                        textDecoration: 'underline',
                        gap: 1.0
                      }
                    }}
                  >
                    Learn More &rarr;
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Patrons & Organising Committee Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <GlassCard sx={{ p: { xs: 4, md: 6 }, border: '1px solid rgba(30, 58, 138, 0.08)' }}>
          <Typography 
            variant="h4" 
            fontWeight="900" 
            color="primary.main" 
            align="center" 
            gutterBottom
            sx={{ fontFamily: "'Raleway', sans-serif", mb: 5 }}
          >
            Patrons & Organising Committee
          </Typography>

          {/* Patrons Row */}
          <Typography 
            variant="h5" 
            fontWeight="800" 
            color="secondary.main" 
            align="center" 
            sx={{ fontFamily: "'Raleway', sans-serif", mb: 4 }}
          >
            Patrons
          </Typography>

          <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
            <Grid item xs={12} sm={6} md={5}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.7)', 
                borderRadius: '16px', 
                border: '1px solid rgba(226,232,240,0.8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                height: '100%'
              }}>
                <Avatar 
                  src={anverPhoto} 
                  alt="Dr P C Anver" 
                  sx={{ width: 140, height: 140, mb: 2, border: '3px solid #1e3a8a', boxShadow: '0 8px 24px rgba(30, 58, 138, 0.15)' }} 
                />
                <Typography variant="h6" fontWeight="800" color="primary.main" align="center">
                  Dr P C Anver
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" fontWeight="600" sx={{ mt: 0.5 }}>
                  Executive Director
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={5}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.7)', 
                borderRadius: '16px', 
                border: '1px solid rgba(226,232,240,0.8)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                height: '100%'
              }}>
                <Avatar 
                  src={shamsudeenPhoto} 
                  alt="Dr Shamsudeen M" 
                  sx={{ width: 140, height: 140, mb: 2, border: '3px solid #1e3a8a', boxShadow: '0 8px 24px rgba(30, 58, 138, 0.15)' }} 
                />
                <Typography variant="h6" fontWeight="800" color="primary.main" align="center">
                  Dr Shamsudeen M
                </Typography>
                <Typography variant="body2" color="textSecondary" align="center" fontWeight="600" sx={{ mt: 0.5 }}>
                  Chief of Medical Services
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 5 }} />

          {/* Organising Committee Header */}
          <Typography 
            variant="h5" 
            fontWeight="800" 
            color="secondary.main" 
            align="center" 
            sx={{ fontFamily: "'Raleway', sans-serif", mb: 4 }}
          >
            Organising Committee
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {/* Chairperson Card */}
            <Grid item xs={12} md={10}>
              <Card sx={{ 
                bgcolor: 'rgba(255,255,255,0.75)', 
                borderRadius: '16px', 
                border: '1.5px solid rgba(13, 148, 136, 0.15)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                p: 3,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '4px',
                  bgcolor: 'secondary.main'
                }
              }}>
                <Typography variant="subtitle2" color="secondary.main" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: '1.5px', mb: 1 }}>
                  Organising Chairperson
                </Typography>
                <Typography variant="h5" fontWeight="900" color="primary.main" gutterBottom>
                  Mr Jazeel Nalakath
                </Typography>
                <Typography variant="body1" color="textSecondary" fontWeight="600">
                  Group General Manager, IQRAA Group
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {/* Vice Chairman & Convener & Joint Convener */}
            {[
              { role: 'Vice Chairman', name: 'Dr. Sanal Dev S S', desc: 'Consultant, Emergency Medicine' },
              { role: 'Convener', name: 'Dr Renjith T P', desc: 'Consultant, Emergency Medicine' },
              { role: 'Joint Convener', name: 'Dr Josna Jose', desc: 'In charge, Toxicovigilance and PIC' }
            ].map((leader, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ 
                  bgcolor: 'rgba(255,255,255,0.7)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(226,232,240,0.8)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '4px',
                    bgcolor: 'primary.main'
                  }
                }}>
                  <Typography variant="subtitle2" color="secondary.main" fontWeight="800" sx={{ textTransform: 'uppercase', letterSpacing: '1px', mb: 1, fontSize: '0.75rem' }}>
                    {leader.role}
                  </Typography>
                  <Typography variant="h6" fontWeight="800" color="primary.main" gutterBottom>
                    {leader.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" fontWeight="500">
                    {leader.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography 
            variant="h6" 
            fontWeight="800" 
            color="primary.main" 
            align="center" 
            sx={{ fontFamily: "'Raleway', sans-serif", mb: 3 }}
          >
            Organizing Secretaries
          </Typography>

          <Grid container spacing={3} justifyContent="center" sx={{ mb: 6 }}>
            {[
              { name: 'Dr. Nirmal Peter Abraham', desc: 'Consultant, Emergency Medicine' },
              { name: 'Dr Muhammed Anas V K', desc: 'HOD, Dept. of Clinical Pharmacy' }
            ].map((secretary, i) => (
              <Grid item xs={12} sm={6} md={5} key={i}>
                <Card sx={{ 
                  bgcolor: 'rgba(255,255,255,0.7)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(226,232,240,0.8)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h6" fontWeight="800" color="primary.main" gutterBottom>
                    {secretary.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" fontWeight="500">
                    {secretary.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 5 }} />

          {/* Programme Coordinators Section */}
          <Typography 
            variant="h6" 
            fontWeight="800" 
            color="secondary.main" 
            align="center" 
            sx={{ fontFamily: "'Raleway', sans-serif", mb: 4, textTransform: 'uppercase', letterSpacing: '1px' }}
          >
            Programme Coordinators
          </Typography>

          <Grid container spacing={2.5} justifyContent="center">
            {[
              { name: 'Dr Noorjahan V A', role: 'Consultant, Emergency Medicine' },
              { name: 'Dr Aswath Raj P R', role: 'Specialist, Emergency Medicine' },
              { name: 'Dr Muhammed Shahal', role: 'Specialist, Emergency Medicine' },
              { name: 'Dr Vajid N V', role: 'Head, Iqraa Centre for Research & Development' },
              { name: 'Mr Noufal K K', role: 'Head, Iqraa Clinical laboratory Services' },
              { name: 'Dr Shinad N V', role: 'In charge, Clinical Pharmacy' }
            ].map((coord, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ 
                  bgcolor: 'rgba(255,255,255,0.5)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(226,232,240,0.6)',
                  p: 2.5,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.03)',
                    borderColor: 'rgba(13, 148, 136, 0.3)'
                  }
                }}>
                  <Typography variant="body1" fontWeight="700" color="primary.main" gutterBottom>
                    {coord.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" fontWeight="500" sx={{ fontSize: '0.85rem' }}>
                    {coord.role}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </GlassCard>
      </Container>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }} id="about-section">
        <Grid container spacing={5} alignItems="flex-start">
          <Grid item xs={12}>
            <Typography variant="h4" fontWeight="800" color="primary.main" gutterBottom>
              {about.title}
            </Typography>
            <Box 
              sx={{ 
                color: 'text.secondary', 
                lineHeight: 1.7,
                '& h3': { color: 'secondary.main', mt: 3, mb: 1, fontWeight: '700' },
                '& p': { mb: 2 }
              }}
              dangerouslySetInnerHTML={{ __html: about.text }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* What to Expect, Topics Covered, Who Will Benefit */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)'
            },
            gap: '30px',
            alignItems: 'stretch'
          }}
        >
          {/* Card 1: What to Expect */}
          <Card sx={{ 
            height: '100%', 
            bgcolor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            position: 'relative',
            '&:hover': { 
              transform: 'translateY(-8px)', 
              boxShadow: '0 15px 45px rgba(13, 148, 136, 0.08)',
              borderColor: '#0d9488'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '4px',
              bgcolor: '#0d9488'
            }
          }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3.5}>
                <Avatar sx={{ bgcolor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488', width: 44, height: 44 }}>
                  <ScienceIcon sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="900" color="primary.main" sx={{ fontFamily: "'Raleway', sans-serif", fontSize: '1.25rem' }}>
                  What to Expect?
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, pt: 2 }}>
                {[
                  'Expert Sessions by Renowned National Faculty',
                  'Interactive Panel Discussions',
                  'Engaging Debates on Key Toxicology Topics',
                  'Clinical Case-Based Learning',
                  'Toxicology Quiz Competition',
                  'Oral Scientific Presentations',
                  'E-Poster Presentations',
                  'Networking and Collaboration Opportunities',
                  'Evidence-Based Updates in Clinical Toxicology and Poison Management',
                  'Multidisciplinary Learning with Experts from Emergency Medicine, Critical Care, Pediatrics, and Forensic Medicine',
                  'Insights into Emerging Trends and Advances in Clinical Toxicology',
                  'Opportunities to Present Research, Case Reports, and Innovative Practices in Toxicology',
                  'Practical Pearls for Managing Common and Challenging Poisonings'
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.8 }}>
                    <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', bgcolor: '#0d9488', mt: 1, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.88rem', lineHeight: 1.5, fontWeight: 500 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
          
          {/* Card 2: Topics Covered */}
          <Card sx={{ 
            height: '100%', 
            bgcolor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            position: 'relative',
            '&:hover': { 
              transform: 'translateY(-8px)', 
              boxShadow: '0 15px 45px rgba(30, 58, 138, 0.08)',
              borderColor: '#1e3a8a'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '4px',
              bgcolor: '#1e3a8a'
            }
          }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3.5}>
                <Avatar sx={{ bgcolor: 'rgba(30, 58, 138, 0.1)', color: '#1e3a8a', width: 44, height: 44 }}>
                  <MedicationIcon sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="900" color="secondary.main" sx={{ fontFamily: "'Raleway', sans-serif", fontSize: '1.25rem' }}>
                  Topics Covered
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, pt: 2 }}>
                {[
                  'Decontamination in the Emergency Department',
                  'Extracorporeal Methods in Poisoning',
                  'Setting Up a Clinical Toxicology Centre and Poison Information Centre',
                  'Snakebite Management',
                  'Plant Poisoning',
                  'Newer Insecticides',
                  'Paraquat Poisoning',
                  'Controversies in the Management of Organophosphate Poisoning',
                  'Rodenticide Poisoning',
                  'Common Drug Overdoses',
                  'Psychiatric Drug Overdose',
                  'Substance Abuse and Recreational Drug Toxicity',
                  'Research in Clinical Toxicology',
                  'Approach to Pediatric Poisoning',
                  'Common Pediatric Poisonings',
                  'Medicolegal Aspects of Clinical Toxicology'
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.8 }}>
                    <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', bgcolor: '#1e3a8a', mt: 1, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.88rem', lineHeight: 1.5, fontWeight: 500 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic', fontSize: '0.82rem', display: 'block', pl: 2.2 }}>
                  And many more topics in Clinical Toxicology...
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          {/* Card 3: Who Will Benefit */}
          <Card sx={{ 
            height: '100%', 
            bgcolor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            position: 'relative',
            '&:hover': { 
              transform: 'translateY(-8px)', 
              boxShadow: '0 15px 45px rgba(124, 58, 237, 0.08)',
              borderColor: '#7c3aed'
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '4px',
              bgcolor: '#7c3aed'
            }
          }}>
            <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3.5}>
                <Avatar sx={{ bgcolor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', width: 44, height: 44 }}>
                  <HubIcon sx={{ fontSize: 22 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="900" sx={{ fontFamily: "'Raleway', sans-serif", color: '#7c3aed', fontSize: '1.25rem' }}>
                  Who Will Benefit?
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, pt: 2 }}>
                {[
                  'Clinical Toxicologists and Trainees',
                  'Emergency Medicine Physicians and Residents',
                  'Critical Care & Intensive Care Physicians and Residents',
                  'Internal Medicine Physicians and Residents',
                  'Pediatricians and Pediatric Residents',
                  'Family Medicine Physicians and Residents',
                  'Forensic Medicine Specialists and Residents',
                  'General Practitioners (GPs)',
                  'Pharmacologists, Clinical Pharmacists, and Trainees',
                  'Nurses and Allied Health Professionals',
                  'Researchers, Academicians, and Students in Toxicology',
                  'Public Health Professionals and Poison Centre Personnel',
                  'Psychiatrists and Psychiatry residents',
                  'Medical students and interns',
                  'Drug safety, pharmacovigilance and Toxicovigilance professionals'
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 1.8 }}>
                    <Box sx={{ width: '6px', height: '6px', borderRadius: '50%', bgcolor: '#7c3aed', mt: 1, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.88rem', lineHeight: 1.5, fontWeight: 500 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>


      {/* Speakers Section */}
      {speakers.length > 0 && (
        <Box id="speakers-section" sx={{ bgcolor: 'rgba(30, 58, 138, 0.02)', py: 10, borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" align="center" color="primary.main" sx={{ fontWeight: 800, mb: 2 }}>
              Distinguished Guest Speakers
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 6 }}>
              Interact with international medical toxicologists and emergency medicine heads.
            </Typography>
            
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
                    borderRadius: '20px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
                    border: '1.5px solid rgba(226, 232, 240, 0.8)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
                      borderColor: 'secondary.main'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, display: 'flex', gap: 3, alignItems: 'flex-start', flexGrow: 1, flexDirection: 'row' }}>
                    <Avatar 
                      src={getImageUrl(sp.photo)} 
                      alt={sp.name} 
                      sx={{ 
                        width: 70, 
                        height: 70, 
                        flexShrink: 0, 
                        border: '3px solid rgba(13, 148, 136, 0.15)', 
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                        bgcolor: 'secondary.main',
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '1.3rem'
                      }}
                    >
                      {sp.name.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    
                    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" flexGrow={1}>
                      <Box>
                        <Typography variant="h6" fontWeight="800" mb={0.5} color="text.primary" sx={{ fontSize: '1.2rem', fontFamily: "'Raleway', sans-serif" }}>
                          {sp.name}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold" color="secondary.main" mb={1.5} sx={{ display: 'block' }}>
                          {sp.designation}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.6, fontSize: '0.9rem' }}>
                          {sp.description}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </GlassCard>
              ))}
            </Box>
          </Container>
        </Box>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Typography variant="h4" fontWeight="800" align="center" mb={1} color="primary.main">
            Program Gallery
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" mb={6}>
            Highlights from the previous TOXIQ events and clinical workshops.
          </Typography>

          <Grid container spacing={2}>
            {gallery.map((g) => (
              <Grid item xs={12} sm={6} md={3} key={g.id}>
                <Box 
                  sx={{ 
                    position: 'relative', 
                    borderRadius: 3, 
                    overflow: 'hidden', 
                    height: '200px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    '&:hover img': { transform: 'scale(1.08)' },
                    '&:hover .caption-overlay': { opacity: 1 }
                  }}
                >
                  <img 
                    src={getImageUrl(g.image)} 
                    alt={g.caption} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'all 0.3s ease-in-out' }}
                  />
                  <Box 
                    className="caption-overlay"
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, left: 0, right: 0, 
                      bgcolor: 'rgba(15, 23, 42, 0.8)', 
                      color: '#fff', 
                      p: 1.5, 
                      opacity: 0, 
                      transition: 'opacity 0.3s ease-in-out',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">{g.caption || 'TOXIQ Conference'}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Sponsors Section */}
      {sponsors.length > 0 && (
        <Box sx={{ borderTop: '1px solid #e2e8f0', py: 8, bgcolor: '#ffffff' }}>
          <Container maxWidth="lg">
            <Typography variant="subtitle2" align="center" sx={{ textTransform: 'uppercase', color: 'text.light', fontWeight: 800, mb: 4, letterSpacing: '2px' }}>
              Academic & Tech Sponsors
            </Typography>
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {sponsors.map((sp) => (
                <Grid item xs={6} sm={4} md={2} key={sp.id} textAlign="center">
                  {sp.logo ? (
                    <img src={getImageUrl(sp.logo)} alt={sp.name} style={{ maxHeight: '45px', maxWidth: '100%', filter: 'grayscale(100%) opacity(0.7)' }} />
                  ) : (
                    <Typography variant="body1" fontWeight="bold" color="text.light" sx={{ fontStyle: 'italic' }}>
                      {sp.name}
                    </Typography>
                  )}
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Footer Contact Wrapper */}
      <Footer contact={contact} />

      {/* CME Credit Hours Dialog Popup */}
      <Dialog 
        open={creditOpen} 
        onClose={() => setCreditOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 1.5,
            border: '1.5px solid rgba(13, 148, 136, 0.1)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: '900', display: 'flex', alignItems: 'center', gap: 1.5, color: 'primary.main', fontFamily: "'Raleway', sans-serif" }}>
          <WorkspacePremiumIcon color="secondary" sx={{ fontSize: '2.2rem' }} />
          CME Credit Hours
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.8, color: 'text.secondary', fontWeight: 600, fontSize: '1.1rem', textAlign: 'center', py: 2 }}>
            Applied for KSMC credit hours
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button 
            onClick={() => setCreditOpen(false)} 
            variant="contained" 
            color="primary"
            sx={{ px: 4, py: 1, borderRadius: '30px', fontWeight: 'bold' }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;

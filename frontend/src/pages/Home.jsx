import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Button, 
  Card, CardContent, Avatar, Chip, Stack, useTheme, Alert,
  Link
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

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const host = API.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${host}${path}`;
  };
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      title: 'Credit Points', 
      desc: 'Earn CME credit hours recognized by medical councils.', 
      icon: <GroupsIcon sx={{ fontSize: 24, color: '#ffffff' }} />,
      color: '#7c3aed',
      link: '#dates-section'
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
      <Box 
        sx={{ 
          background: activeBanner.image 
            ? `linear-gradient(rgba(4, 27, 58, 0.82), rgba(3, 20, 45, 0.88)), url(${getImageUrl(activeBanner.image)}) no-repeat center center / cover`
            : 'linear-gradient(135deg, #091b29 0%, #062425 100%)', // Fallback premium dark gradient
          color: '#ffffff',
          py: { xs: 10, md: 15 },
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
        
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
      </Box>

      {/* Statistics / Highlights Section */}
      <Container 
        maxWidth={false} 
        sx={{ 
          maxWidth: '1400px', 
          mx: 'auto', 
          mt: -6, 
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
                  <Link 
                    href={hl.link} 
                    onClick={(e) => {
                      e.preventDefault();
                      if (hl.link.startsWith('#')) {
                        const element = document.getElementById(hl.link.substring(1));
                        if (element) element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        navigate(hl.link);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    sx={{ 
                      color: hl.color, 
                      fontWeight: '700', 
                      textDecoration: 'none', 
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
                  </Link>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ mb: 10 }} id="about-section">
        <Grid container spacing={5} alignItems="flex-start">
          <Grid item xs={12} md={7}>
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
          {/* Important Dates Box */}
          <Grid item xs={12} md={5} id="dates-section">
            <GlassCard sx={{ 
              p: { xs: 3.5, md: 4.5 }, 
              border: '1.5px solid rgba(13, 148, 136, 0.2)', 
              boxShadow: '0 12px 30px rgba(13, 148, 136, 0.08)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="h5" fontWeight="700" mb={3.5} color="primary.main" display="flex" alignItems="center" gap={1.5}>
                  <CalendarMonthIcon color="secondary" sx={{ fontSize: '1.75rem' }} />
                  Important Dates
                </Typography>
                
                <Box display="flex" flexDirection="column" gap={2}>
                  {/* Row 1 */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      p: 2, 
                      bgcolor: 'rgba(30, 58, 138, 0.02)', 
                      border: '1px solid rgba(30, 58, 138, 0.05)', 
                      borderRadius: '12px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: 'rgba(30, 58, 138, 0.04)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700" color="text.primary">Registration Opens</Typography>
                      <Typography variant="caption" color="textSecondary">Participant entry start</Typography>
                    </Box>
                    <Chip 
                      label={dates.registration_open || 'N/A'} 
                      sx={{ 
                        fontWeight: '800', 
                        fontSize: '0.8rem',
                        bgcolor: 'rgba(30, 58, 138, 0.08)', 
                        color: 'primary.main', 
                        border: '1.5px solid rgba(30, 58, 138, 0.15)',
                        borderRadius: '8px',
                        px: 1,
                        height: '32px'
                      }} 
                    />
                  </Box>

                  {/* Row 2 */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      p: 2, 
                      bgcolor: 'rgba(239, 68, 68, 0.02)', 
                      border: '1px solid rgba(239, 68, 68, 0.05)', 
                      borderRadius: '12px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: 'rgba(239, 68, 68, 0.04)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700" color="error.main">Registration Closes</Typography>
                      <Typography variant="caption" color="textSecondary">Final deadline for payments</Typography>
                    </Box>
                    <Chip 
                      label={dates.registration_close || 'N/A'} 
                      sx={{ 
                        fontWeight: '800', 
                        fontSize: '0.8rem',
                        bgcolor: 'rgba(239, 68, 68, 0.08)', 
                        color: 'error.main', 
                        border: '1.5px solid rgba(239, 68, 68, 0.15)',
                        borderRadius: '8px',
                        px: 1,
                        height: '32px'
                      }} 
                    />
                  </Box>

                  {/* Row 3 */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      p: 2, 
                      bgcolor: 'rgba(13, 148, 136, 0.02)', 
                      border: '1px solid rgba(13, 148, 136, 0.05)', 
                      borderRadius: '12px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        bgcolor: 'rgba(13, 148, 136, 0.04)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700" color="secondary.main">Submission Deadline</Typography>
                      <Typography variant="caption" color="textSecondary">Paper abstract delivery</Typography>
                    </Box>
                    <Chip 
                      label={dates.article_deadline || 'N/A'} 
                      sx={{ 
                        fontWeight: '800', 
                        fontSize: '0.8rem',
                        bgcolor: 'rgba(13, 148, 136, 0.08)', 
                        color: 'secondary.main', 
                        border: '1.5px solid rgba(13, 148, 136, 0.15)',
                        borderRadius: '8px',
                        px: 1,
                        height: '32px'
                      }} 
                    />
                  </Box>
                </Box>
              </Box>

              <Box mt={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/registration')}
                  sx={{ py: 1.5, fontWeight: '700', borderRadius: '30px' }}
                >
                  Go to Registration Form
                </Button>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>

      {/* What to Expect, Topics Covered, Who Will Benefit */}
      <Container maxWidth="lg" sx={{ mb: 10 }}>
        <Grid container spacing={4}>
          {/* Card 1: What to Expect */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="800" color="primary.main" mb={2.5} sx={{ fontFamily: "'Raleway', sans-serif", fontSize: '1.25rem' }}>
                  What to Expect?
                </Typography>
                <ul style={{ paddingLeft: '18px', color: '#475569', lineHeight: '1.6', margin: 0, fontSize: '0.88rem' }}>
                  <li style={{ marginBottom: '8px' }}>Expert Sessions by Renowned National Faculty</li>
                  <li style={{ marginBottom: '8px' }}>Interactive Panel Discussions</li>
                  <li style={{ marginBottom: '8px' }}>Engaging Debates on Key Toxicology Topics</li>
                  <li style={{ marginBottom: '8px' }}>Clinical Case-Based Learning</li>
                  <li style={{ marginBottom: '8px' }}>Toxicology Quiz Competition</li>
                  <li style={{ marginBottom: '8px' }}>Oral Scientific Presentations</li>
                  <li style={{ marginBottom: '8px' }}>Poster Presentations</li>
                  <li style={{ marginBottom: '8px' }}>Networking and Collaboration Opportunities</li>
                  <li style={{ marginBottom: '8px' }}>Evidence-Based Updates in Clinical Toxicology and Poison Management</li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Card 2: Topics Covered */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="800" color="secondary.main" mb={2.5} sx={{ fontFamily: "'Raleway', sans-serif", fontSize: '1.25rem' }}>
                  Topics Covered
                </Typography>
                <ul style={{ paddingLeft: '18px', color: '#475569', lineHeight: '1.6', margin: 0, fontSize: '0.88rem' }}>
                  <li style={{ marginBottom: '8px' }}>Decontamination in the Emergency Department</li>
                  <li style={{ marginBottom: '8px' }}>Extracorporeal Methods in Poisoning</li>
                  <li style={{ marginBottom: '8px' }}>Setting Up a Clinical Toxicology Centre and Poison Information Centre</li>
                  <li style={{ marginBottom: '8px' }}>Snakebite Management</li>
                  <li style={{ marginBottom: '8px' }}>Plant Poisoning</li>
                  <li style={{ marginBottom: '8px' }}>Newer Insecticides</li>
                  <li style={{ marginBottom: '8px' }}>Paraquat Poisoning</li>
                  <li style={{ marginBottom: '8px' }}>Controversies in the Management of Organophosphate Poisoning</li>
                  <li style={{ marginBottom: '8px' }}>Rodenticide Poisoning</li>
                  <li style={{ marginBottom: '8px' }}>Common Drug Overdoses</li>
                  <li style={{ marginBottom: '8px' }}>Psychiatric Drug Overdose</li>
                  <li style={{ marginBottom: '8px' }}>Substance Abuse and Recreational Drug Toxicity</li>
                  <li style={{ marginBottom: '8px' }}>Research in Clinical Toxicology</li>
                  <li style={{ marginBottom: '8px' }}>Approach to Pediatric Poisoning</li>
                  <li style={{ marginBottom: '8px' }}>Common Pediatric Poisonings</li>
                  <li style={{ marginBottom: '8px' }}>Medicolegal Aspects of Clinical Toxicology</li>
                </ul>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic', fontSize: '0.82rem' }}>
                  And many more topics in Clinical Toxicology...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Card 3: Who Will Benefit */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              height: '100%', 
              bgcolor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" fontWeight="800" mb={2.5} sx={{ fontFamily: "'Raleway', sans-serif", color: '#7c3aed', fontSize: '1.25rem' }}>
                  Who Will Benefit?
                </Typography>
                <ul style={{ paddingLeft: '18px', color: '#475569', lineHeight: '1.6', margin: 0, fontSize: '0.88rem' }}>
                  <li style={{ marginBottom: '8px' }}>Clinical Toxicologists and Trainees</li>
                  <li style={{ marginBottom: '8px' }}>Emergency Medicine Physicians and Residents</li>
                  <li style={{ marginBottom: '8px' }}>Critical Care & Intensive Care Physicians and Residents</li>
                  <li style={{ marginBottom: '8px' }}>Internal Medicine Physicians and Residents</li>
                  <li style={{ marginBottom: '8px' }}>Pediatricians and Pediatric Residents</li>
                  <li style={{ marginBottom: '8px' }}>Family Medicine Physicians and Residents</li>
                  <li style={{ marginBottom: '8px' }}>Forensic Medicine Specialists and Residents</li>
                  <li style={{ marginBottom: '8px' }}>General Practitioners (GPs)</li>
                  <li style={{ marginBottom: '8px' }}>Pharmacologists, Clinical Pharmacists, and Trainees</li>
                  <li style={{ marginBottom: '8px' }}>Nurses and Allied Health Professionals</li>
                  <li style={{ marginBottom: '8px' }}>Researchers, Academicians, and Students in Toxicology</li>
                  <li style={{ marginBottom: '8px' }}>Public Health Professionals and Poison Centre Personnel</li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(13, 148, 136, 0.05)', borderRadius: '16px', border: '1.5px solid rgba(13, 148, 136, 0.1)' }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ fontWeight: '500', lineHeight: '1.7', fontSize: '0.92rem' }}>
            ToxIQ 2026 aims to enhance clinical knowledge, promote evidence-based poison management, foster collaborative learning, and strengthen the network of healthcare professionals dedicated to improving outcomes in poisoned patients.
          </Typography>
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
    </Box>
  );
};

export default Home;

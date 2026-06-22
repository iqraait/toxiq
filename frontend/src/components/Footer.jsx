import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Grid, Typography, Link, IconButton, 
  TextField, Button, Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import RoomIcon from '@mui/icons-material/Room';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import API from '../services/api';

const Footer = ({ contact = {} }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState(null);
  const [dates, setDates] = useState({ registration_open: 'N/A', registration_close: 'N/A', article_deadline: 'N/A' });

  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
      return path;
    }
    const host = API.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${host}${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, homeRes] = await Promise.all([
          API.get('cms/settings/'),
          API.get('cms/home/')
        ]);
        setSettings(settingsRes.data);
        if (homeRes.data?.content?.important_dates) {
          setDates(homeRes.data.content.important_dates);
        }
      } catch (err) {
        console.error('Error fetching footer data:', err);
      }
    };
    fetchData();
  }, []);

  const address = 'Iqraa International Hospital, Calicut, Kerala';
  const email = contact.email || 'toxiq2026@gmail.com';
  const phone1 = '+91 85929 23522';
  const phone2 = '+91 94002 92843';

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const handleQuickLink = (path, scrollToId) => {
    if (location.pathname === '/' && scrollToId) {
      const element = document.getElementById(scrollToId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (scrollToId) {
      navigate('/', { state: { scrollTo: scrollToId } });
    } else if (path) {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: <FacebookIcon fontSize="small" />, url: 'https://facebook.com' },
    { icon: <InstagramIcon fontSize="small" />, url: 'https://instagram.com' },
    { icon: <LinkedInIcon fontSize="small" />, url: 'https://linkedin.com' },
    { icon: <YouTubeIcon fontSize="small" />, url: 'https://youtube.com' }
  ];

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Brochure & Gallery', path: '/brochure-gallery' },
    { label: 'Registration', path: '/registration' },
    { label: 'Article Submission', path: '/article-submission' },
    { label: 'Speakers', scrollToId: 'speakers-section' },
    { label: 'Important Dates', scrollToId: 'dates-section' }
  ];

  const programItems = [
    { label: 'Conference Venue', value: 'Iqraa Auditorium, Calicut', icon: <RoomIcon sx={{ color: '#1EC8C8', fontSize: '1.05rem' }} /> },
    { label: 'CME Credit Hours', value: 'Applied for KSMC credit hours', icon: <WorkspacePremiumIcon sx={{ color: '#1EC8C8', fontSize: '1.05rem' }} /> },
    { label: 'Guidelines', value: 'Author Guidelines & Forms', icon: <MenuBookIcon sx={{ color: '#1EC8C8', fontSize: '1.05rem' }} /> }
  ];

  return (
    <Box 
      id="contact-section"
      sx={{ 
        background: 'linear-gradient(135deg, #041B3A 0%, #062856 50%, #03142D 100%)', // Premium dark medical conference gradient
        color: '#94a3b8',   
        pt: '50px',
        pb: '30px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '2px solid rgba(30, 200, 200, 0.1)',
        fontFamily: "'Raleway', sans-serif"
      }}
    >
      {/* Floating subtle glowing particles / backgrounds */}
      <Box sx={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(24, 211, 197, 0.06) 0%, rgba(6, 40, 86, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '25%',
        right: '5%',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(32, 164, 243, 0.06) 0%, rgba(3, 20, 45, 0) 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <Container maxWidth={false} sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: '20px', md: '40px' }, zIndex: 2, position: 'relative' }}>
        
        {/* Main 4-Column Layout */}
        <Grid container spacing={{ xs: 4, md: 5 }} sx={{ mb: 6 }}>
          
          {/* Column 1 – Brand Area (3.5/12 columns) */}
          <Grid item xs={12} sm={6} md={3.5} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.5, mb: 3 }}>
              {settings?.logo ? (
                <img 
                  src={getFileUrl(settings.logo)} 
                  alt="logo" 
                  style={{ 
                    height: '70px', 
                    width: 'auto', 
                    objectFit: 'contain', 
                    display: 'block' 
                  }} 
                />
              ) : (
                <>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: 44, 
                      height: 44, 
                      borderRadius: '12px', 
                      bgcolor: 'rgba(30, 200, 200, 0.08)', 
                      border: '2.5px solid #1EC8C8',
                      color: '#1EC8C8',
                      boxShadow: '0 0 15px rgba(30, 200, 200, 0.2)'
                    }}
                  >
                    <ScienceIcon sx={{ fontSize: '1.55rem' }} />
                  </Box>
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontFamily: "'Raleway', sans-serif", 
                        fontWeight: 900, 
                        color: '#ffffff',
                        fontSize: '1.35rem',
                        letterSpacing: '-0.3px',
                        lineHeight: 1.1
                      }}
                    >
                      {settings?.site_name || <>TOXIQ <span style={{ color: '#1EC8C8' }}>2026</span></>}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#94a3b8',
                        letterSpacing: '0.5px',
                        fontSize: '0.68rem',
                        display: 'block',
                        mt: 0.1
                      }}
                    >
                      Toxicology Program
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
            
            <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 4, color: '#94a3b8', fontSize: '0.92rem', pr: { md: 2 } }}>
              Advancing Toxicology Knowledge for Safer Healthcare through education, innovation and scientific excellence.
            </Typography>

            {/* Glassmorphic Social Links */}
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1.8 }}>
              {socialLinks.map((item, index) => (
                <IconButton
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#ffffff',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    bgcolor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    width: '40px',
                    height: '40px',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      color: '#1EC8C8',
                      borderColor: '#1EC8C8',
                      bgcolor: 'rgba(30, 200, 200, 0.08)',
                      transform: 'translateY(-5px)',
                      boxShadow: '0 0 15px rgba(30, 200, 200, 0.4)'
                    }
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Column 2 – Quick Links (2/12 columns) */}
          <Grid item xs={12} sm={6} md={2} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="800" 
              color="#ffffff" 
              mb={3.5}
              sx={{ fontSize: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#1EC8C8', pb: 1, borderBottom: '2px solid rgba(30, 200, 200, 0.15)', width: { xs: '100%', sm: 'fit-content' } }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: { xs: 'center', sm: 'flex-start' } }}>
              {quickLinks.map((link, idx) => (
                <Link
                  key={idx}
                  component="button"
                  onClick={() => handleQuickLink(link.path, link.scrollToId)}
                  sx={{
                    textAlign: 'left',
                    color: '#94a3b8',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    background: 'none',
                    border: 'none',
                    p: 0,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: "'Raleway', sans-serif",
                    position: 'relative',
                    width: 'fit-content',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: '0%',
                      height: '1.5px',
                      bottom: '-2px',
                      left: '0',
                      backgroundColor: '#1EC8C8',
                      transition: 'all 0.3s ease'
                    },
                    '&:hover': {
                      color: '#1EC8C8',
                      paddingLeft: { xs: '0', sm: '10px' },
                      transform: { xs: 'scale(1.05)', sm: 'none' }
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Column 3 – Important Dates (3.25/12 columns) */}
          <Grid item xs={12} sm={6} md={3.25} id="dates-section" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="800" 
              color="#ffffff" 
              mb={3.5}
              sx={{ fontSize: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#1EC8C8', pb: 1, borderBottom: '2px solid rgba(30, 200, 200, 0.15)', width: { xs: '100%', sm: 'fit-content' } }}
            >
              Important Dates
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, alignItems: { xs: 'center', sm: 'flex-start' } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                  Registration Opens
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>
                  {dates.registration_open || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                  Registration Closes
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>
                  {dates.registration_close || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
                <Typography variant="caption" sx={{ color: '#1EC8C8', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                  Submission Deadline
                </Typography>
                <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500 }}>
                  {dates.article_deadline || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Column 4 – Program Details (3.25/12 columns) */}
          <Grid item xs={12} sm={6} md={3.25} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="800" 
              color="#ffffff" 
              mb={3.5}
              sx={{ fontSize: '1rem', letterSpacing: '0.5px', textTransform: 'uppercase', color: '#1EC8C8', pb: 1, borderBottom: '2px solid rgba(30, 200, 200, 0.15)', width: { xs: '100%', sm: 'fit-content' } }}
            >
              Program Details
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2, alignItems: { xs: 'center', sm: 'flex-start' } }}>
              {programItems.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-start' }, gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.icon}
                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.68rem', letterSpacing: '0.5px' }}>
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 500, pl: { xs: 0, sm: 3.2 } }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Premium Glassmorphic Newsletter Section */}
        <Box 
          sx={{ 
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            p: { xs: 4, md: 5 },
            mb: 6,
            maxWidth: '900px',
            mx: 'auto',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255,255,255,0.02)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 4
          }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' }, maxWidth: '420px' }}>
            <Typography variant="h6" fontWeight="800" color="#ffffff" sx={{ mb: 1, fontSize: '1.25rem', fontFamily: "'Raleway', sans-serif" }}>
              Stay Updated with TOXIQ 2026
            </Typography>
            <Typography variant="body2" color="#94a3b8" sx={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
              Subscribe for conference updates, deadlines, speakers and announcements.
            </Typography>
          </Box>

          <Box 
            component="form" 
            onSubmit={handleSubscribe}
            sx={{ 
              display: 'flex', 
              width: { xs: '100%', md: 'auto' }, 
              flexGrow: 1,
              maxWidth: '450px',
              gap: 1.5,
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            {subscribed ? (
              <Box sx={{ width: '100%', bgcolor: 'rgba(30, 200, 200, 0.1)', color: '#1EC8C8', py: 1.2, px: 3, borderRadius: '30px', fontWeight: 'bold', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(30, 200, 200, 0.2)' }}>
                Thank you for subscribing!
              </Box>
            ) : (
              <>
                <TextField 
                  placeholder="Email Address" 
                  variant="outlined" 
                  size="small"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  sx={{ 
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      borderRadius: '30px',
                      bgcolor: 'rgba(255, 255, 255, 0.02)',
                      fontSize: '0.85rem',
                      height: '44px',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1EC8C8',
                      },
                    },
                  }}
                />
                <Button 
                  type="submit"
                  variant="contained" 
                  sx={{ 
                    background: 'linear-gradient(90deg, #18D3C5, #20A4F3)',
                    color: '#ffffff',
                    fontWeight: 800,
                    borderRadius: '30px',
                    px: 4,
                    height: '44px',
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 5px 15px rgba(32, 164, 243, 0.4)'
                    }
                  }}
                >
                  Subscribe
                </Button>
              </>
            )}
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 3 }} />

        {/* Bottom Bar Layout */}
        <Grid container alignItems="center" spacing={2} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', textAlign: 'center' }}>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
              &copy; 2026 TOXIQ Program. All Rights Reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.3px' }}>
              Powered by <span style={{ color: '#94a3b8' }}>Iqraa International Hospital</span>
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
              Designed & Developed by <span style={{ color: '#ffffff', fontWeight: 700 }}>IT Team Iqraa</span>
            </Typography>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default Footer;

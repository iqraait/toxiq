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
import FlagIcon from '@mui/icons-material/Flag';
import HandshakeIcon from '@mui/icons-material/Handshake';
import DescriptionIcon from '@mui/icons-material/Description';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

import API from '../services/api';
import GlassCard from '../components/GlassCard';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { purpleGradientText } from '../theme';
import anverPhoto from '../assets/anver.jpg';
import shamsudeenPhoto from '../assets/shamsudeen.jpg';
import nirmalPhoto from '../assets/nirmal_fixed.jpg';
import sanalPhoto from '../assets/sanal_fixed.jpg';
import renjithPhoto from '../assets/renjith_fixed.jpg';
import josnaPhoto from '../assets/josna_fixed.jpg';
import anasPhoto from '../assets/anas_fixed.jpg';
import jazeelPhoto from '../assets/jazeel_fixed.jpg';
import vajidPhoto from '../assets/vajid_fixed2.jpg';
import aswathPhoto from '../assets/aswath_fixed.jpg';
import shahalPhoto from '../assets/shahal_fixed.jpg';
import noufalPhoto from '../assets/noufal_fixed.jpg';
import shinadPhoto from '../assets/shinad_fixed.jpg';
import noorjahanPhoto from '../assets/noorjahan_fixed.jpg';

const MemberCard = ({ name, role, desc, photo, initials, isPatron, sideIcon: SideIcon }) => (
  <Card sx={{ 
    bgcolor: '#ffffff', 
    borderRadius: '28px', 
    border: '1px solid rgba(226, 232, 240, 0.8)',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)',
    transition: 'all 0.35s ease',
    p: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 180,
    minHeight: 180,
    maxHeight: 180,
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',

    "&::before": {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '5px',
      background: 'linear-gradient(90deg, #2563eb, #7c3aed)'
    },

    "&:hover": {
      transform: 'translateY(-10px)',
      boxShadow: '0 25px 50px rgba(15, 23, 42, 0.12)',
      borderColor: '#2563eb'
    }
  }}>
    <Box sx={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <Avatar 
        src={photo} 
        alt={name} 
        sx={{ 
          width: 80, 
          height: 80, 
          border: '2.5px solid #ffffff', 
          boxShadow: '0 0 0 2px #2563eb, 0 4px 15px rgba(37, 99, 235, 0.2)',
          bgcolor: '#2563eb',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.35rem'
        }}
      >
        {initials}
      </Avatar>
      {isPatron && (
        <Box sx={{ 
          position: 'absolute', 
          bottom: -4, 
          right: -4, 
          width: 26, 
          height: 26, 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', 
          border: '2.5px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
          zIndex: 2
        }}>
          <WorkspacePremiumIcon sx={{ color: '#ffffff', fontSize: '0.9rem' }} />
        </Box>
      )}
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, minWidth: 0, textAlign: 'left', pr: (!isPatron && SideIcon) ? 5 : 0 }}>
      <Typography 
        variant="caption" 
        color="#2563eb" 
        fontWeight="800" 
        sx={{ 
          textTransform: 'uppercase', 
          letterSpacing: '0.8px', 
          display: 'block', 
          mb: 0.8, 
          fontSize: '0.75rem',
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {role}
      </Typography>
      <Typography 
        variant="subtitle1" 
        fontWeight="900" 
        color="#0f172a" 
        sx={{ 
          mb: 0.8, 
          lineHeight: 1.2, 
          fontSize: '1.1rem',
          fontFamily: "'Raleway', sans-serif",
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word'
        }}
      >
        {name}
      </Typography>
      <Typography 
        variant="caption" 
        color="text.secondary" 
        fontWeight="600" 
        sx={{ 
          fontSize: '0.82rem', 
          lineHeight: 1.4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word'
        }}
      >
        {desc}
      </Typography>
    </Box>

    {/* Right-side faint watermark for Patrons */}
    {isPatron && (
      <Box sx={{ 
        position: 'absolute', 
        right: -10, 
        top: '50%', 
        transform: 'translateY(-50%)', 
        opacity: 0.05, 
        color: '#2563eb',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        <WorkspacePremiumIcon sx={{ fontSize: '110px' }} />
      </Box>
    )}

    {/* Right-side badge for Organising Committee */}
    {!isPatron && SideIcon && (
      <Box sx={{ 
        position: 'absolute', 
        right: 20, 
        top: '50%', 
        transform: 'translateY(-50%)', 
        width: 44, 
        height: 44, 
        borderRadius: '50%', 
        bgcolor: '#f5f3ff', 
        border: '1px solid #ddd6fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px rgba(124, 58, 237, 0.04)'
      }}>
        <SideIcon sx={{ color: '#7c3aed', fontSize: '1.35rem' }} />
      </Box>
    )}
  </Card>
);

const SectionHeader = ({ title, mt = 0 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mt: mt, mb: '50px' }}>
    <Box sx={{ flexGrow: 1, height: '1.5px', background: 'linear-gradient(90deg, transparent, #2563eb)' }} />
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mx: 3 }}>
      <Box sx={{ width: 6, height: 6, transform: 'rotate(45deg)', border: '1.5px solid #2563eb', bgcolor: 'transparent' }} />
      <Typography 
        variant="subtitle2" 
        sx={{ 
          fontWeight: '900', 
          color: '#1e3a8a', 
          textTransform: 'uppercase', 
          letterSpacing: '3px',
          fontSize: '0.85rem',
          fontFamily: "'Raleway', sans-serif",
          whiteSpace: 'nowrap'
        }}
      >
        {title}
      </Typography>
      <Box sx={{ width: 6, height: 6, transform: 'rotate(45deg)', border: '1.5px solid #2563eb', bgcolor: 'transparent' }} />
    </Box>
    <Box sx={{ flexGrow: 1, height: '1.5px', background: 'linear-gradient(90deg, #2563eb, transparent)' }} />
  </Box>
);

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

      {/* Patrons & Organising Committee Section */}
      <Box sx={{ bgcolor: 'rgba(13, 148, 136, 0.02)', pt: 12, pb: 12, borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', mb: 10 }}>
        <Container maxWidth={false} sx={{ maxWidth: '1440px', mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Typography 
            variant="h4" 
            fontWeight="900" 
            align="center" 
            sx={{ 
              fontFamily: "'Raleway', sans-serif", 
              mb: 2,
              background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #7c3aed 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Patrons & Organising Committee
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: '600px', mx: 'auto', fontSize: '1rem', fontWeight: '500' }}>
            Meet the visionary leadership and dedicated committee members guiding TOXIQ 2026.
          </Typography>

          {/* Styled Accent Line with Groups Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 8 }}>
            <Box sx={{ width: 100, height: '1.5px', background: 'linear-gradient(90deg, transparent, #2563eb)' }} />
            <GroupsIcon sx={{ color: '#1e3a8a', fontSize: '1.8rem' }} />
            <Box sx={{ width: 100, height: '1.5px', background: 'linear-gradient(90deg, #2563eb, transparent)' }} />
          </Box>

          {/* Patrons Subsection */}
          <SectionHeader title="Patrons" />

          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 10 }}>
            {[
              { name: 'Dr P C Anver', role: 'Executive Director', photo: anverPhoto, initials: 'PA' },
              { name: 'Dr Shamsudeen M', role: 'Chief of Medical Services', photo: shamsudeenPhoto, initials: 'SM' }
            ].map((patron, i) => (
              <Grid item xs={12} sm={6} md={6} key={i} sx={{ display: 'flex', alignItems: 'stretch' }}>
                <MemberCard 
                  name={patron.name}
                  role="Conference Patron"
                  desc={patron.role}
                  photo={patron.photo}
                  initials={patron.initials}
                  isPatron={true}
                />
              </Grid>
            ))}
          </Grid>

          {/* Organising Committee Subsection */}
          <SectionHeader title="Organising Committee" mt={0} />

          <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ mb: 10 }}>
            {[
              { role: 'Organising Chairperson', name: 'Mr Jazeel Nalakath', desc: 'Group General Manager, IQRAA Group', photo: jazeelPhoto, initials: 'JN', sideIcon: FlagIcon },
              { role: 'Vice Chairperson', name: 'Dr. Sanal Dev S S', desc: 'Consultant, Emergency Medicine', photo: sanalPhoto, initials: 'SD', sideIcon: AccountTreeIcon },
              { role: 'Convener', name: 'Dr Renjith T P', desc: 'Consultant, Emergency Medicine', photo: renjithPhoto, initials: 'RT', sideIcon: TrackChangesIcon },
              { role: 'Joint Convener', name: 'Dr Josna Jose', desc: 'In charge, Toxicovigilance and PIC', photo: josnaPhoto, initials: 'JJ', sideIcon: HandshakeIcon },
              { role: 'Organizing Secretary', name: 'Dr. Nirmal Peter Abraham', desc: 'Consultant, Emergency Medicine', photo: nirmalPhoto, initials: 'NP', sideIcon: AssignmentIcon },
              { role: 'Organizing Secretary', name: 'Dr Muhammed Anas V K', desc: 'HOD, Dept. of Clinical Pharmacy', photo: anasPhoto, initials: 'MA', sideIcon: LocalHospitalIcon }
            ].map((member, i) => (
              <Grid item xs={12} sm={4} md={4} key={i} sx={{ display: 'flex', alignItems: 'stretch' }}>
                <MemberCard 
                  name={member.name}
                  role={member.role}
                  desc={member.desc}
                  photo={member.photo}
                  initials={member.initials}
                  isPatron={false}
                  sideIcon={member.sideIcon}
                />
              </Grid>
            ))}
          </Grid>

          {/* Programme Coordinators Subsection */}
          <SectionHeader title="Programme Coordinators" mt={0} />

          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {[
              { name: 'Dr Noorjahan V A', role: 'Consultant, Emergency Medicine', photo: noorjahanPhoto, initials: 'NV', sideIcon: MedicationIcon },
              { name: 'Dr Aswath Raj P R', role: 'Specialist, Emergency Medicine', photo: aswathPhoto, initials: 'AR', sideIcon: MedicationIcon },
              { name: 'Dr Muhammed Shahal', role: 'Specialist, Emergency Medicine', photo: shahalPhoto, initials: 'MS', sideIcon: MedicationIcon },
              { name: 'Dr Vajid N V', role: 'Head, Iqraa Centre for Research & Development', photo: vajidPhoto, initials: 'VN', sideIcon: ScienceIcon },
              { name: 'Mr Noufal K K', role: 'Head, Iqraa Clinical laboratory Services', photo: noufalPhoto, initials: 'NK', sideIcon: HubIcon },
              { name: 'Dr Shinad N V', role: 'In charge, Clinical Pharmacy', photo: shinadPhoto, initials: 'SN', sideIcon: MedicationIcon }
            ].map((coord, i) => (
              <Grid item xs={12} sm={4} md={4} key={i} sx={{ display: 'flex', alignItems: 'stretch' }}>
                <MemberCard 
                  name={coord.name}
                  role="Programme Coordinator"
                  desc={coord.role}
                  photo={coord.photo}
                  initials={coord.initials}
                  isPatron={false}
                  sideIcon={coord.sideIcon}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

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

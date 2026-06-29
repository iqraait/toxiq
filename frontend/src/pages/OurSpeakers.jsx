import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, 
  Avatar, Card, Alert, Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { purpleGradientText } from '../theme';
import akhilPhoto from '../assets/akhil.png';
import pillayPhoto from '../assets/pillay.png';
import ralphPhoto from '../assets/ralph.png';
import vimalPhoto from '../assets/vimal.jpg';
import gunaseelanPhoto from '../assets/gunaseelan.png';
import amrithanandPhoto from '../assets/amrithanand.png';
import jaicobPhoto from '../assets/jaicob.png';
import senthilkumaranPhoto from '../assets/senthilkumaran.png';
import gireeshPhoto from '../assets/gireesh.png';
import jayeshPhoto from '../assets/jayesh.png';
import chandniPhoto from '../assets/chandni.jpg';
import jaideepPhoto from '../assets/jaideep.jpg';
import jayakrishnanPhoto from '../assets/jayakrishnan.png';
import purushothamanPhoto from '../assets/purushothaman.jpg';
import sathishkumarPhoto from '../assets/sathishkumar.jpg';
import girishPhoto from '../assets/girish.jpg';
import frestonPhoto from '../assets/freston.png';
import ramakrishnanPhoto from '../assets/ramakrishnan.png';
import sandeepPhoto from '../assets/sandeep.png';
import venugopalanPhoto from '../assets/venugopalan.png';
import roneyPhoto from '../assets/roney.png';
import rajeevPhoto from '../assets/rajeev.png';
import hidayathullahPhoto from '../assets/hidayathullah.png';
import shamsudheenPhoto from '../assets/shamsudheen.png';
import jyotishPhoto from '../assets/jyotish.jpg';
import noushadPhoto from '../assets/noushad.png';
import sijuPhoto from '../assets/siju.png';
import shihabudheenPhoto from '../assets/shihabudheen.png';
import sabarishPhoto from '../assets/sabarish.jpg';
import shameerPhoto from '../assets/shameer.png';
import farisPhoto from '../assets/faris.jpg';

const SpeakerCard = ({ name, designation, description, photo }) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '';
  return (
    <Card sx={{ 
      bgcolor: '#ffffff', 
      borderRadius: '20px', 
      border: '1.5px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 15px 35px rgba(13, 148, 136, 0.08)',
        borderColor: 'secondary.main'
      },
      p: 3,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2.5,
      height: '100%',
      minHeight: 170,
      width: '100%',
      minWidth: 0,
      boxSizing: 'border-box'
    }}>
      <Avatar 
        src={photo} 
        alt={name} 
        sx={{ 
          width: 70, 
          height: 70, 
          flexShrink: 0, 
          border: '2.5px solid rgba(13, 148, 136, 0.15)', 
          boxShadow: '0 4px 12px rgba(13, 148, 136, 0.1)',
          bgcolor: 'primary.main',
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '1.25rem'
        }}
      >
        {initials}
      </Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, minWidth: 0, textAlign: 'left' }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="900" 
          color="primary.main" 
          sx={{ 
            mb: 1.2, 
            lineHeight: 1.2, 
            fontSize: '1.05rem',
            fontFamily: "'Raleway', sans-serif",
            wordBreak: 'break-word'
          }}
        >
          {name}
        </Typography>
        {designation && (
          <Typography 
            variant="caption" 
            color="secondary.main" 
            fontWeight="800" 
            sx={{ 
              textTransform: 'uppercase', 
              letterSpacing: '0.8px', 
              display: 'block', 
              mb: 1.2, 
              fontSize: '0.75rem',
              lineHeight: 1.2,
              wordBreak: 'break-word'
            }}
          >
            {designation}
          </Typography>
        )}
        {description && (
          <Typography 
            variant="caption" 
            color="textSecondary" 
            fontWeight="600" 
            sx={{ 
              fontSize: '0.8rem', 
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              wordBreak: 'break-word'
            }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

const OurSpeakers = () => {
  const navigate = useNavigate();
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getImageUrl = (path, name) => {
    if (name) {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('akhil')) return akhilPhoto;
      if (lowerName.includes('pillay')) return pillayPhoto;
      if (lowerName.includes('ralph') || lowerName.includes('ravikar')) return ralphPhoto;
      if (lowerName.includes('vimal')) return vimalPhoto;
      if (lowerName.includes('gunaseelan')) return gunaseelanPhoto;
      if (lowerName.includes('amrithanand')) return amrithanandPhoto;
      if (lowerName.includes('jaicob')) return jaicobPhoto;
      if (lowerName.includes('senthilkumaran')) return senthilkumaranPhoto;
      if (lowerName.includes('gireesh')) return gireeshPhoto;
      if (lowerName.includes('jayesh')) return jayeshPhoto;
      if (lowerName.includes('chandni')) return chandniPhoto;
      if (lowerName.includes('jaideep')) return jaideepPhoto;
      if (lowerName.includes('jayakrishnan')) return jayakrishnanPhoto;
      if (lowerName.includes('purushothaman')) return purushothamanPhoto;
      if (lowerName.includes('sathishkumar')) return sathishkumarPhoto;
      if (lowerName.includes('girish')) return girishPhoto;
      if (lowerName.includes('freston')) return frestonPhoto;
      if (lowerName.includes('ramakrishnan')) return ramakrishnanPhoto;
      if (lowerName.includes('sandeep')) return sandeepPhoto;
      if (lowerName.includes('venugopalan')) return venugopalanPhoto;
      if (lowerName.includes('roney')) return roneyPhoto;
      if (lowerName.includes('rajeev')) return rajeevPhoto;
      if (lowerName.includes('hidayathullah')) return hidayathullahPhoto;
      if (lowerName.includes('shamsudeen') || lowerName.includes('shamsudheen')) return shamsudheenPhoto;
      if (lowerName.includes('jyotish')) return jyotishPhoto;
      if (lowerName.includes('noushad')) return noushadPhoto;
      if (lowerName.includes('siju')) return sijuPhoto;
      if (lowerName.includes('shihabudeen') || lowerName.includes('shihabudheen')) return shihabudheenPhoto;
      if (lowerName.includes('sabarish')) return sabarishPhoto;
      if (lowerName.includes('shameer')) return shameerPhoto;
      if (lowerName.includes('faris')) return farisPhoto;
    }
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: '60px' 
        }}>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: '20px', flexShrink: 0 }}
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
        </Box>

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
              <SpeakerCard 
                key={sp.id}
                name={sp.name}
                designation={sp.designation}
                description={sp.description}
                photo={getImageUrl(sp.photo, sp.name)}
              />
            ))}
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default OurSpeakers;

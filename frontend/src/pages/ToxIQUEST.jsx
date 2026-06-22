import React from 'react';
import { Container, Typography, Box, Grid, Button, Stack, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const ToxIQUEST = () => {
  const navigate = useNavigate();

  const rules = [
    'Team Size: 2 Residents per Team',
    'Institution Limit: Maximum 3 Teams per Institution',
    'Quiz Registration: FREE',
    'Conference Registration is Mandatory for Participation'
  ];

  const topics = [
    'Clinical Toxicology Cases',
    'Toxidromes & Mechanisms of Toxicity',
    'Antidotes & Emergency Management',
    'Poison Information & Toxicovigilance',
    'Recent Advances in Medical Toxicology'
  ];

  const contacts = [
    { name: 'Dr. Shahal', phone: '9895583555' },
    { name: 'Dr. Jabir', phone: '7356520068' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        {/* Back Button */}
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')} 
          sx={{ mb: 4, color: '#334155', fontWeight: 'bold' }}
        >
          Back to Home
        </Button>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={10}>
            <GlassCard sx={{ 
              p: { xs: 4, md: 6 }, 
              border: '1px solid rgba(13, 148, 136, 0.15)', 
              boxShadow: '0 10px 45px rgba(13, 148, 136, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #0d9488 0%, #1e3a8a 100%)',
                borderRadius: '16px 16px 0 0'
              }
            }}>
              
              {/* Header Title Section */}
              <Box textAlign="center" mb={5}>
                <EmojiEventsIcon color="secondary" sx={{ fontSize: '4.5rem', mb: 2, filter: 'drop-shadow(0 4px 10px rgba(13, 148, 136, 0.2))' }} />
                <Typography 
                  variant="h3" 
                  fontWeight="950" 
                  fontFamily="'Raleway', sans-serif" 
                  sx={purpleGradientText}
                  gutterBottom
                >
                  ToxIQUEST
                </Typography>
                <Typography variant="h5" fontWeight="700" color="text.secondary" fontFamily="'Raleway', sans-serif">
                  National Toxicology Quiz Competition
                </Typography>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={4}>
                {/* Left Side: Rules and Registration */}
                <Grid item xs={12} md={6}>
                  <Box mb={4}>
                    <Typography variant="h6" color="primary.main" fontWeight="800" mb={2} display="flex" alignItems="center" gap={1}>
                      <CheckCircleOutlineIcon color="secondary" /> Rules & Eligibility
                    </Typography>
                    <List>
                      {rules.map((rule, idx) => (
                        <ListItem key={idx} sx={{ px: 0, py: 1 }}>
                          <ListItemIcon sx={{ minWidth: '32px' }}>
                            <Box sx={{ width: 8, height: 8, bgcolor: 'secondary.main', borderRadius: '50%' }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={rule} 
                            primaryTypographyProps={{ color: 'text.secondary', fontWeight: '500', fontSize: '0.95rem' }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box>
                    <Typography variant="h6" color="primary.main" fontWeight="800" mb={2} display="flex" alignItems="center" gap={1}>
                      <PhoneInTalkIcon color="secondary" /> Team Registration Contacts
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2.5}>
                      To register your team, please contact our coordinators directly via phone:
                    </Typography>
                    <Stack spacing={1.5}>
                      {contacts.map((c, idx) => (
                        <Box key={idx} sx={{ p: 2, bgcolor: 'rgba(30, 58, 138, 0.03)', borderRadius: '10px', border: '1px solid rgba(30, 58, 138, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="700" color="primary.main">{c.name}</Typography>
                          <Typography variant="body2" fontWeight="800" color="secondary.main">{c.phone}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                {/* Right Side: Quiz Topics */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ height: '100%', p: 3.5, bgcolor: 'rgba(13, 148, 136, 0.02)', border: '1.5px dashed rgba(13, 148, 136, 0.2)', borderRadius: '20px' }}>
                    <Typography variant="h6" color="primary.main" fontWeight="800" mb={3} display="flex" alignItems="center" gap={1}>
                      <HelpOutlineIcon color="primary" /> Quiz Coverage & Topics
                    </Typography>
                    <Stack spacing={2}>
                      {topics.map((topic, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            p: 2, 
                            bgcolor: '#ffffff', 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 15px rgba(0,0,0,0.01)', 
                            border: '1px solid rgba(226, 232, 240, 0.8)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'scale(1.02)' }
                          }}
                        >
                          <Typography variant="body2" fontWeight="700" color="text.primary">
                            {idx + 1}. {topic}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/registration')}
                  sx={{ px: 6, py: 1.8, borderRadius: '30px', fontWeight: 'bold', fontSize: '1rem' }}
                >
                  Register for Conference First
                </Button>
              </Box>

            </GlassCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ToxIQUEST;

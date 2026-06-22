import React from 'react';
import { Container, Typography, Box, Grid, Button, Stack, Divider, List, ListItem, ListItemIcon, ListItemText, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const AbstractGuidelines = () => {
  const navigate = useNavigate();

  const generalGuidelines = [
    'The presenting author must be registered for ToxIQ 2026.',
    'All submissions should be related to Clinical Toxicology.',
    'Interesting case reports, case series, completed research projects, and ongoing research work may be submitted for presentation as either an E-Poster or Oral Presentation.',
    'Priority for Oral Presentations will be given to completed and ongoing research studies.',
    'Abstracts must be submitted on or before 10 July 2026 for scientific review.',
    'Abstracts selected by the expert review committee will be invited for presentation during the conference.',
    'Abstracts should be limited to 500 words and must include the author\'s name, institution, and affiliation.',
    'Abstracts reporting original research should follow the IMRAD format (Introduction, Methods, Results, Discussion).',
    'Do not use ALL CAPITAL LETTERS in the abstract text.',
    'Graphs, tables, photographs, and slide presentations should not be included with the abstract submission.',
    'Advertisements or images for which the authors do not hold proprietary rights must not be included.',
    'Any sources of funding or potential conflicts of interest should be clearly disclosed.',
    'For studies involving human subjects, a statement regarding ethical approval or exemption must be included.',
    'Once the abstract has been correctly formatted, it should be uploaded through the conference portal using the participant\'s Registration ID.',
    'Notification of acceptance for selected abstracts will be sent by 20 July 2026.',
    'Final E-Posters and Oral Presentation files must be uploaded by 25 July 2026. Submissions received after this date will not be considered.',
    'Presenters are requested to report to the presentation venue at least 15 minutes before the start of their session.',
    'The submitted work must not have been previously published or presented at any national or international scientific meeting.'
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
          <Grid item xs={12}>
            <GlassCard sx={{ 
              p: { xs: 4, md: 6 }, 
              border: '1px solid rgba(30, 58, 138, 0.15)', 
              boxShadow: '0 10px 45px rgba(30, 58, 138, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '5px',
                background: 'linear-gradient(90deg, #1e3a8a 0%, #0d9488 100%)',
                borderRadius: '16px 16px 0 0'
              }
            }}>
              
              {/* Header Title Section */}
              <Box textAlign="center" mb={5}>
                <MenuBookIcon color="primary" sx={{ fontSize: '4.5rem', mb: 2, filter: 'drop-shadow(0 4px 10px rgba(30, 58, 138, 0.2))' }} />
                <Typography 
                  variant="h3" 
                  fontWeight="950" 
                  fontFamily="'Raleway', sans-serif" 
                  sx={purpleGradientText}
                  gutterBottom
                >
                  Abstract Submission Guidelines
                </Typography>
                <Typography variant="h5" fontWeight="600" color="text.secondary" fontFamily="'Raleway', sans-serif">
                  Scientific Presentations for ToxIQ 2026
                </Typography>
              </Box>

              {/* Deadlines Section */}
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(239, 68, 68, 0.02)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                    <EventAvailableIcon color="error" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" color="error.main" fontWeight="bold">Submission Deadline</Typography>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" mt={0.5}>10 July 2026</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(13, 148, 136, 0.02)', border: '1px solid rgba(13, 148, 136, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                    <EventAvailableIcon color="primary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" color="primary.main" fontWeight="bold">Acceptance Notification</Typography>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" mt={0.5}>20 July 2026</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(124, 58, 237, 0.02)', border: '1px solid rgba(124, 58, 237, 0.1)', borderRadius: '16px', textAlign: 'center' }}>
                    <EventAvailableIcon color="secondary" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" color="secondary.main" fontWeight="bold">Final Upload Deadline</Typography>
                    <Typography variant="h6" fontWeight="bold" color="text.primary" mt={0.5}>25 July 2026</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={4}>
                {/* Guidelines Checklist */}
                <Grid item xs={12} lg={7}>
                  <Typography variant="h5" color="primary.main" fontWeight="800" mb={3}>
                    Rules & General Regulations
                  </Typography>
                  <List>
                    {generalGuidelines.map((guideline, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1.2, alignItems: 'flex-start' }}>
                        <ListItemIcon sx={{ minWidth: '32px', mt: 0.25 }}>
                          <Box sx={{ width: 6, height: 6, bgcolor: '#0d9488', borderRadius: '50%' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={guideline} 
                          primaryTypographyProps={{ color: 'text.secondary', fontWeight: '500', fontSize: '0.92rem', lineHeight: 1.6 }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Presentation Formats & Queries */}
                <Grid item xs={12} lg={5}>
                  <Stack spacing={4}>
                    <Box sx={{ p: 4, bgcolor: '#ffffff', border: '1.5px solid rgba(226, 232, 240, 0.8)', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
                      <Typography variant="h6" color="primary.main" fontWeight="800" mb={3} display="flex" alignItems="center" gap={1}>
                        <UploadFileIcon color="secondary" /> Presentation Guidelines
                      </Typography>
                      
                      <Box mb={3.5}>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={1}>
                          E-Poster Presentations
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          • Allotted Time: 5 minutes presentation + 3 minutes discussion.<br />
                          • Format: PowerPoint template limited to 4–6 slides.
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={1}>
                          Oral Presentations
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          • Allotted Time: 12 minutes presentation + 3 minutes discussion.<br />
                          • Format: Number of slides is not restricted.
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 4, bgcolor: 'rgba(30, 58, 138, 0.02)', border: '1.5px dashed rgba(30, 58, 138, 0.2)', borderRadius: '24px' }}>
                      <Typography variant="h6" color="primary.main" fontWeight="800" mb={3.5} display="flex" alignItems="center" gap={1}>
                        <ContactSupportIcon color="primary" /> Contact for Queries
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3}>
                        If you have any questions or require clarifications regarding abstract formats or categories, feel free to contact:
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="750" color="primary.main">Dr. Vinayak</Typography>
                          <Typography variant="body2" fontWeight="800" color="secondary.main">7994956313</Typography>
                        </Box>
                        <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="750" color="primary.main">Dr. Ashida</Typography>
                          <Typography variant="body2" fontWeight="800" color="secondary.main">8547053889</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} justifyContent="center">
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/article-submission')}
                  sx={{ px: 5, py: 1.8, borderRadius: '30px', fontWeight: 'bold', fontSize: '0.95rem' }}
                >
                  Upload Abstract Now
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/registration')}
                  sx={{ px: 5, py: 1.8, borderRadius: '30px', fontWeight: 'bold', fontSize: '0.95rem' }}
                >
                  Register for Conference
                </Button>
              </Stack>

            </GlassCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default AbstractGuidelines;

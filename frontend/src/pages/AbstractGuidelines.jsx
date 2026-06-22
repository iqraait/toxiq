import React from 'react';
import { Container, Typography, Box, Grid, Button, Stack, Divider, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
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

  const guidelines = [
    { text: "The presenting author must be registered for ToxIQ 2026." },
    { text: "Submissions must relate to Clinical Toxicology and may include case reports, case series, educational posters, completed research, or ongoing research projects." },
    { text: "Authors may indicate a preference for E-Poster or Oral Presentation; however, the final allocation will be determined by the Review Committee. Priority for Oral Presentations will be given to completed and ongoing research studies." },
    { text: "The submitted work must be original, unpublished, and not previously presented at any national or international scientific meeting." },
    { text: "Abstracts must be submitted through the conference portal using the participant’s Registration ID by 10 July 2026. Authors may edit or withdraw submissions until this deadline; no changes will be permitted thereafter." },
    { text: "Abstracts should be written in English using Times New Roman, 12-point font, single spacing, and be limited to 500 words. Include the title, author(s), institution, affiliation, and 3–5 keywords." },
    { text: "The title should be concise, informative, and written in Title Case. Avoid abbreviations unless they are widely recognized." },
    { 
      text: "Original research abstracts must follow the IMRAD structure:", 
      subItems: ["Introduction", "Methods", "Results", "Discussion"] 
    },
    { text: "Do not use ALL CAPITAL LETTERS in the abstract text." },
    { text: "Graphs, tables, and photographs should be avoided in the abstract." },
    { text: "Advertisements or images for which the authors do not hold proprietary rights must not be included." },
    { text: "Sources of funding, potential conflicts of interest, and, where applicable, statements on ethical approval or exemption for studies involving human subjects must be clearly disclosed." },
    { text: "Abstracts must be uploaded in Microsoft Word (.docx) or PDF format through the conference portal." },
    { text: "Abstracts selected through scientific review will be invited for presentation during the conference. Notification of acceptance will be sent by 20 July 2026." },
    { text: "Final E-Poster and Oral Presentation files must be uploaded by 28 July 2026. Submissions received after this date will not be considered." },
    { text: "Presenters are requested to report to the presentation venue at least 15 minutes before the start of their session." },
    { text: "The decision of the Review Committee regarding abstract acceptance and presentation format shall be final." }
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
                    <Typography variant="h6" fontWeight="bold" color="text.primary" mt={0.5}>28 July 2026</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Grid container spacing={4}>
                {/* Guidelines Checklist */}
                <Grid item xs={12} lg={7}>
                  <Typography variant="h5" color="primary.main" fontWeight="800" mb={3}>
                    Abstract Submission Guidelines – ToxIQ 2026
                  </Typography>
                  <List>
                    {guidelines.map((g, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 1.0, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                          <Typography variant="body2" color="primary.main" fontWeight="800" sx={{ minWidth: '28px', mt: 0.1, fontSize: '0.94rem' }}>
                            {idx + 1}.
                          </Typography>
                          <ListItemText 
                            primary={g.text} 
                            primaryTypographyProps={{ color: 'text.secondary', fontWeight: '500', fontSize: '0.94rem', lineHeight: 1.6 }} 
                          />
                        </Box>
                        {g.subItems && (
                          <List sx={{ pl: 4.5, mt: 0.5, py: 0 }}>
                            {g.subItems.map((sub, sIdx) => (
                              <ListItem key={sIdx} sx={{ px: 0, py: 0.4, alignItems: 'center' }}>
                                <Box sx={{ width: 5, height: 5, bgcolor: 'secondary.main', borderRadius: '50%', mr: 1.5 }} />
                                <ListItemText 
                                  primary={sub} 
                                  primaryTypographyProps={{ color: 'text.secondary', fontWeight: '600', fontSize: '0.9rem' }} 
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
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
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9rem' }}>
                          • E-posters should be prepared in PDF format with a 16:9 landscape layout.<br />
                          • Each presenter will be allotted 5 minutes for presentation followed by 3 minutes for discussion.
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" color="text.primary" mb={1}>
                          Oral Presentations
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, fontSize: '0.9rem' }}>
                          • The number of slides is not restricted.<br />
                          • Presentations should be limited to 12 minutes, followed by 3 minutes of discussion.
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ p: 4, bgcolor: 'rgba(30, 58, 138, 0.02)', border: '1.5px dashed rgba(30, 58, 138, 0.2)', borderRadius: '24px' }}>
                      <Typography variant="h6" color="primary.main" fontWeight="800" mb={3.5} display="flex" alignItems="center" gap={1}>
                        <ContactSupportIcon color="primary" /> Contact for Queries
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={3} sx={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                        For any queries regarding abstract submission, please contact:
                      </Typography>
                      <Stack spacing={2}>
                        <Box sx={{ p: 2, bgcolor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226, 232, 240, 0.8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="750" color="primary.main">Dr Greg Paul</Typography>
                          <Typography variant="body2" fontWeight="800" color="secondary.main">8281859664</Typography>
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

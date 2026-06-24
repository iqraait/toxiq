import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, TextField, Button, Alert, 
  CircularProgress, Divider, Stack, FormHelperText,
  Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Grid
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import confetti from 'canvas-confetti';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const ArticleSubmission = () => {
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [authorName, setAuthorName] = useState('');
  const [registrationId, setRegistrationId] = useState('');
  const [presentationPreference, setPresentationPreference] = useState('ORAL');
  const [remarks, setRemarks] = useState('');
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const res = await API.get('cms/home/');
        setInstructions(res.data.content?.article_instructions || 'Files must be under 10MB and in PDF formats only.');
      } catch (err) {
        console.error('Error fetching instructions:', err);
        setInstructions('Files must be under 10MB and in PDF formats only.');
      } finally {
        setLoading(false);
      }
    };
    fetchInstructions();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      
      // Strict PDF format validation
      const isPdf = selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        setError('Only PDF files are allowed.');
        setFile(null);
        return;
      }

      // Check size limit: 10MB
      if (selected.size > 10 * 1024 * 1024) {
        setError('Maximum file size allowed is 10 MB.');
        setFile(null);
        return;
      }
      
      setError('');
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    setSuccess(false);

    if (!authorName.trim() || !registrationId.trim() || !file) {
      setError('Please enter your Name, Registration ID, and upload your PDF file.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('registration_id', registrationId.trim());
    formData.append('author_name', authorName.trim());
    formData.append('article_title', `Manuscript - ${registrationId.trim()}`);
    
    const prefLabel = presentationPreference === 'ORAL' 
      ? 'Oral Presentation (Preferred)' 
      : 'E-Poster Presentation (Preferred)';
    const combinedRemarks = `[Presentation Preference: ${prefLabel}]\n\n${remarks.trim()}`;
    formData.append('remarks', combinedRemarks);
    formData.append('file', file);

    try {
      await API.post('articles/submissions/', formData);
      setSuccess(true);
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      // Clear form
      setAuthorName('');
      setRegistrationId('');
      setPresentationPreference('ORAL');
      setRemarks('');
      setFile(null);
    } catch (err) {
      console.error('Article submit error:', err);
      if (err.response?.status === 400) {
        setValidationErrors(err.response.data);
        const firstErr = Object.values(err.response.data)[0];
        setError(Array.isArray(firstErr) ? firstErr[0] : 'Validation failed.');
      } else {
        setError('An error occurred while uploading your article. Ensure your Registration ID exists.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" className="gradient-bg">
        <CircularProgress size={50} color="secondary" />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        <Grid container spacing={4}>
          
          {/* Main Submission Form Column */}
          <Grid item xs={12} md={8}>
            <GlassCard sx={{ 
              p: 5, 
              border: '1px solid rgba(30, 58, 138, 0.12)', 
              boxShadow: '0 10px 45px rgba(30, 58, 138, 0.05)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1e3a8a 0%, #7c3aed 100%)',
                borderRadius: '16px 16px 0 0'
              }
            }}>
              
              <Box mb={3} textAlign="center">
                <Typography 
                  variant="h4" 
                  fontWeight="900" 
                  fontFamily="'Raleway', sans-serif" 
                  sx={purpleGradientText}
                  gutterBottom
                >
                  Scientific Article Submission
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Only successfully registered participants of the TOXIQ Program may upload articles.
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Instructions Box */}
              <Alert severity="info" sx={{ mb: 4, borderRadius: '10px' }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Submission Instructions</Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.5 }}>{instructions}</Typography>
              </Alert>

              {success && (
                <Alert severity="success" icon={<TaskAltIcon />} sx={{ mb: 4, borderRadius: '10px' }}>
                  <Typography variant="subtitle2" fontWeight="bold">Submission Complete</Typography>
                  Your article was uploaded successfully. Our academic reviewers will evaluate the abstract. 
                  You can check status or updates in your email.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    placeholder="Enter your full name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    error={!!validationErrors.author_name}
                    helperText={validationErrors.author_name?.[0] || 'Provide the name of the main author.'}
                  />

                  <TextField
                    required
                    fullWidth
                    label="Registration ID"
                    placeholder="e.g. TOXIQ0001"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    error={!!validationErrors.registration_id}
                    helperText={validationErrors.registration_id?.[0] || 'Must match your official TOXIQ ID received after successful payment.'}
                  />

                  <FormControl component="fieldset" required>
                    <FormLabel component="legend" sx={{ fontWeight: 'bold', color: '#334155', mb: 1, fontSize: '0.9rem' }}>
                      Presentation Preference
                    </FormLabel>
                    <RadioGroup
                      value={presentationPreference}
                      onChange={(e) => setPresentationPreference(e.target.value)}
                    >
                      <FormControlLabel 
                        value="ORAL" 
                        control={<Radio color="secondary" />} 
                        label="Oral Presentation (Preferred)" 
                      />
                      <FormControlLabel 
                        value="POSTER" 
                        control={<Radio color="secondary" />} 
                        label="E-Poster Presentation (Preferred)" 
                      />
                    </RadioGroup>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Remarks & Comments"
                    placeholder="Enter any comments for the academic review panel, list co-authors (if any), etc."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    error={!!validationErrors.remarks}
                    helperText={validationErrors.remarks?.[0]}
                  />

                  {/* Document File Uploader */}
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#334155', mb: 1 }}>
                      Upload Manuscript (PDF only) *
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={2}>
                      <Button
                        variant="outlined"
                        component="label"
                        color="secondary"
                        startIcon={<CloudUploadIcon />}
                        sx={{ borderRadius: '8px' }}
                      >
                        Select Document
                        <input
                          type="file"
                          hidden
                          accept=".pdf"
                          onChange={handleFileChange}
                        />
                      </Button>

                      {file && (
                        <Box display="flex" alignItems="center" gap={0.5} sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.75, borderRadius: '8px' }}>
                          <InsertDriveFileIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="textPrimary" noWrap sx={{ maxWidth: '300px' }}>
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {validationErrors.file && (
                      <FormHelperText error>{validationErrors.file[0]}</FormHelperText>
                    )}
                    <FormHelperText>File must be in PDF format under 10MB.</FormHelperText>
                  </Box>

                  <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                      sx={{ 
                        px: 6, 
                        py: 1.8, 
                        fontSize: '1.1rem', 
                        borderRadius: '30px',
                        fontWeight: '800',
                        boxShadow: '0 8px 20px rgba(30, 58, 138, 0.2)',
                        '&:hover': {
                          boxShadow: '0 12px 28px rgba(30, 58, 138, 0.3)',
                        },
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      {submitting ? 'Submitting...' : 'Submit Manuscript'}
                    </Button>
                  </Box>

                </Stack>
              </form>

            </GlassCard>
          </Grid>

          {/* Sidebar Guidelines Column */}
          <Grid item xs={12} md={4}>
            <GlassCard sx={{ 
              p: 4, 
              border: '1px solid rgba(13, 148, 136, 0.12)', 
              boxShadow: '0 10px 45px rgba(13, 148, 136, 0.04)',
              background: 'rgba(255, 255, 255, 0.65)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              height: 'fit-content',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #0d9488 0%, #3b82f6 100%)',
                borderRadius: '16px 16px 0 0'
              }
            }}>
              <Typography variant="h6" fontWeight="800" color="primary.main" mb={2} sx={{ fontFamily: "'Raleway', sans-serif" }}>
                Guidelines & Templates
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={3.5} sx={{ lineHeight: 1.6 }}>
                Before submitting, please review the format requirements, word limits, and presentation templates for Oral and E-Poster categories.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                href="https://toxiq-rust.vercel.app/abstract-guidelines"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  borderRadius: '30px', 
                  fontWeight: '800',
                  px: 3, 
                  py: 1.2,
                  boxShadow: '0 6px 16px rgba(13, 148, 136, 0.2)',
                  textTransform: 'none'
                }}
              >
                Abstract Submission Guidelines
              </Button>
            </GlassCard>
          </Grid>
          
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ArticleSubmission;

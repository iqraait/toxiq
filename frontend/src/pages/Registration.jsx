import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, 
  CircularProgress, Alert, AlertTitle, Grid, Stack, Divider, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import DynamicFormRenderer from '../components/DynamicFormRenderer';
import { purpleGradientText } from '../theme';

const Registration = () => {
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const host = API.defaults.baseURL.replace(/\/api\/?$/, '');
    return `${host}${path}`;
  };
  
  const [formConfig, setFormConfig] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formFiles, setFormFiles] = useState({});
  const [dates, setDates] = useState(null);
  const [settings, setSettings] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const [formRes, cmsRes] = await Promise.all([
          API.get('registration/forms/active/'),
          API.get('cms/home/').catch(err => {
            console.error('Failed to load CMS content:', err);
            return null;
          })
        ]);

        setFormConfig(formRes.data);
        if (cmsRes && cmsRes.data) {
          if (cmsRes.data.content) {
            setDates(cmsRes.data.content.important_dates);
          }
          if (cmsRes.data.settings) {
            setSettings(cmsRes.data.settings);
          }
        }
        
        // Initialize form values
        const initialValues = {};
        formRes.data.fields.forEach(field => {
          if (field.field_type === 'checkbox') {
            initialValues[field.id] = [];
          } else {
            initialValues[field.id] = '';
          }
        });
        setFormValues(initialValues);
      } catch (err) {
        console.error('Error fetching form configuration:', err);
        setError('Failed to load the registration form schema. Please contact system administrators.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchForm();
  }, []);

  const handleValueChange = (fieldId, value) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    // Clear individual error on change
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldId];
        return copy;
      });
    }
  };

  const handleFileChange = (fieldId, fileObj) => {
    setFormFiles(prev => ({
      ...prev,
      [fieldId]: fileObj
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
    
    // Local basic validation
    const errors = {};
    formConfig.fields.forEach(field => {
      const val = formValues[field.id];
      const isFile = field.field_type === 'file';
      const fileVal = formFiles[field.id];

      if (field.is_required) {
        if (!isFile && (val === undefined || val === '' || (Array.isArray(val) && val.length === 0))) {
          errors[field.label] = 'This field is required.';
        } else if (isFile && !fileVal) {
          errors[field.label] = 'This file is required.';
        }
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please resolve form errors before proceeding.');
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);

    // Build FormData to support uploads
    const formData = new FormData();
    formData.append('form_id', formConfig.id);
    formData.append('field_data', JSON.stringify(formValues));
    
    // Append files with dynamic keys e.g., field_7
    Object.keys(formFiles).forEach(key => {
      formData.append(`field_${key}`, formFiles[key]);
    });

    try {
      const res = await API.post('registration/submit/', formData);
      
      // Success -> Perform direct HTML form POST redirect to PayU payment gateway
      const { checkout } = res.data;
      
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = checkout.action;

      Object.keys(checkout).forEach(key => {
        if (key !== 'action' && key !== 'registration_id_temp') {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = checkout[key];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Submission error:', err);
      if (err.response?.status === 400) {
        setValidationErrors(err.response.data);
        setError('Verification failed. Correct highlighted fields.');
      } else {
        setError('Network error during registration. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" className="gradient-bg">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress size={50} color="secondary" />
          <Typography variant="body1" color="textSecondary">Building dynamic registration portal...</Typography>
        </Stack>
      </Box>
    );
  }

  if (!formConfig) {
    return (
      <Box minHeight="100vh" className="gradient-bg">
        <Navbar />
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Alert severity="warning">
            <AlertTitle>Registration Offline</AlertTitle>
            Registration is currently closed or the form has not been constructed by Super Admin.
          </Alert>
        </Container>
      </Box>
    );
  }

  const getSelectedBaseFee = () => {
    let selectedFee = null;
    if (formConfig && formConfig.fields) {
      formConfig.fields.forEach(field => {
        if (['checkbox', 'radio', 'dropdown'].includes(field.field_type) && field.options) {
          const val = formValues[field.id];
          if (val) {
            field.options.forEach(opt => {
              if (opt && typeof opt === 'object' && opt.price !== undefined && opt.price !== null) {
                const isSelected = Array.isArray(val) ? val.includes(opt.value) : val === opt.value;
                if (isSelected) {
                  selectedFee = parseFloat(opt.price);
                }
              }
            });
          }
        }
      });
    }
    return selectedFee !== null ? selectedFee : parseFloat(formConfig.fee_amount);
  };

  const baseFee = getSelectedBaseFee();
  const taxPercent = parseFloat(formConfig.tax_percentage);
  const taxAmt = baseFee * (taxPercent / 100);
  const totalAmt = baseFee + taxAmt;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          
          {/* Main Registration Form */}
          <Grid item xs={12} md={10} lg={9}>
            <GlassCard sx={{ 
              p: 4, 
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
                background: 'linear-gradient(90deg, #1e3a8a 0%, #0d9488 50%, #7c3aed 100%)',
                borderRadius: '16px 16px 0 0'
              }
            }}>
              
              {settings?.registration_banner && (
                <Box mb={4} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <img 
                    src={getImageUrl(settings.registration_banner)} 
                    alt="Registration Details" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '450px', 
                      objectFit: 'contain', 
                      borderRadius: '12px',
                      border: '1.5px solid rgba(226, 232, 240, 0.8)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }} 
                  />
                </Box>
              )}

              <Box mb={3} display="flex" alignItems="center" justifyContent="center" gap={1.5}>
                <AssignmentTurnedInIcon color="primary" sx={{ fontSize: '2.2rem' }} />
                <Typography 
                  variant="h4" 
                  fontWeight="900" 
                  fontFamily="'Raleway', sans-serif" 
                  sx={{ ...purpleGradientText, textAlign: 'center' }}
                >
                  {formConfig.title}
                </Typography>
              </Box>
 
              <Divider sx={{ mb: 3 }} />
 
              {/* Instructions Banner */}
              {formConfig.instructions && (
                <Alert severity="info" sx={{ mb: 4, borderRadius: '10px' }}>
                  <AlertTitle sx={{ fontWeight: 'bold' }}>Instructions</AlertTitle>
                  {formConfig.instructions}
                </Alert>
              )}
 
              {error && (
                <Alert severity="error" sx={{ mb: 4, borderRadius: '8px' }}>
                  {error}
                </Alert>
              )}
 
              <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                  <Box sx={{ width: '100%' }}>
                    <DynamicFormRenderer
                      fields={formConfig.fields}
                      values={formValues}
                      onChange={handleValueChange}
                      files={formFiles}
                      onFileChange={handleFileChange}
                      errors={validationErrors}
                      currency={formConfig.currency}
                    />
                  </Box>

                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                      sx={{ 
                        px: 6, 
                        py: 1.8, 
                        fontSize: '1.1rem', 
                        mt: 3,
                        borderRadius: '30px',
                        fontWeight: '800',
                        boxShadow: '0 8px 20px rgba(13, 148, 136, 0.2)',
                        '&:hover': {
                          boxShadow: '0 12px 28px rgba(13, 148, 136, 0.3)',
                        },
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      {submitting ? 'Processing...' : `Register & Pay ${formConfig.currency} ${totalAmt.toFixed(2)}`}
                    </Button>
                  </Box>
                </Stack>
              </form>

            </GlassCard>
          </Grid>

        </Grid>
      </Container>

      {/* Important Dates Section */}
      {dates && (
        <Container maxWidth="lg" sx={{ mb: 8 }}>
          <GlassCard sx={{ 
            p: 4, 
            border: '1px solid rgba(13, 148, 136, 0.12)', 
            boxShadow: '0 10px 45px rgba(13, 148, 136, 0.04)',
            background: 'rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #1e3a8a 0%, #0d9488 50%, #7c3aed 100%)',
              borderRadius: '16px 16px 0 0'
            }
          }}>
            <Typography 
              variant="h5" 
              fontWeight="800" 
              color="primary.main" 
              align="center"
              mb={4} 
              display="flex" 
              alignItems="center" 
              justifyContent="center" 
              gap={1.5}
              fontFamily="'Raleway', sans-serif"
            >
              <CalendarMonthIcon color="secondary" sx={{ fontSize: '2rem' }} />
              Important Dates
            </Typography>

            <Grid container spacing={3}>
              {/* Registration Opens */}
              <Grid item xs={12} sm={4}>
                <Box 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    bgcolor: 'rgba(30, 58, 138, 0.02)', 
                    border: '1px solid rgba(30, 58, 138, 0.05)', 
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: 'rgba(30, 58, 138, 0.04)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(30, 58, 138, 0.05)'
                    }
                  }}
                >
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="700" color="primary.main" mb={0.5}>
                      Registration Opens
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Participant registration starts
                    </Typography>
                  </Box>
                  <Chip 
                    label={dates.registration_open || 'N/A'} 
                    sx={{ 
                      fontWeight: '800', 
                      fontSize: '0.9rem',
                      bgcolor: 'rgba(30, 58, 138, 0.08)', 
                      color: 'primary.main', 
                      border: '1.5px solid rgba(30, 58, 138, 0.15)',
                      borderRadius: '10px',
                      px: 1.5,
                      py: 2
                    }} 
                  />
                </Box>
              </Grid>

              {/* Registration Closes */}
              <Grid item xs={12} sm={4}>
                <Box 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    bgcolor: 'rgba(239, 68, 68, 0.02)', 
                    border: '1px solid rgba(239, 68, 68, 0.05)', 
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: 'rgba(239, 68, 68, 0.04)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.05)'
                    }
                  }}
                >
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="700" color="error.main" mb={0.5}>
                      Registration Closes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Final deadline for standard payments
                    </Typography>
                  </Box>
                  <Chip 
                    label={dates.registration_close || 'N/A'} 
                    sx={{ 
                      fontWeight: '800', 
                      fontSize: '0.9rem',
                      bgcolor: 'rgba(239, 68, 68, 0.08)', 
                      color: 'error.main', 
                      border: '1.5px solid rgba(239, 68, 68, 0.15)',
                      borderRadius: '10px',
                      px: 1.5,
                      py: 2
                    }} 
                  />
                </Box>
              </Grid>

              {/* Submission Deadline */}
              <Grid item xs={12} sm={4}>
                <Box 
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    bgcolor: 'rgba(13, 148, 136, 0.02)', 
                    border: '1px solid rgba(13, 148, 136, 0.05)', 
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      bgcolor: 'rgba(13, 148, 136, 0.04)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(13, 148, 136, 0.05)'
                    }
                  }}
                >
                  <Box mb={2}>
                    <Typography variant="subtitle1" fontWeight="700" color="secondary.main" mb={0.5}>
                      Submission Deadline
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Paper abstract delivery closes
                    </Typography>
                  </Box>
                  <Chip 
                    label={dates.article_deadline || 'N/A'} 
                    sx={{ 
                      fontWeight: '800', 
                      fontSize: '0.9rem',
                      bgcolor: 'rgba(13, 148, 136, 0.08)', 
                      color: 'secondary.main', 
                      border: '1.5px solid rgba(13, 148, 136, 0.15)',
                      borderRadius: '10px',
                      px: 1.5,
                      py: 2
                    }} 
                  />
                </Box>
              </Grid>
            </Grid>
          </GlassCard>
        </Container>
      )}

      <Footer />
    </Box>
  );
};

export default Registration;

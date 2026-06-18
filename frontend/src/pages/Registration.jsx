import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Button, 
  CircularProgress, Alert, AlertTitle, Grid, Stack, Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PaymentIcon from '@mui/icons-material/Payment';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import DynamicFormRenderer from '../components/DynamicFormRenderer';
import { purpleGradientText } from '../theme';

const Registration = () => {
  const navigate = useNavigate();
  
  const [formConfig, setFormConfig] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formFiles, setFormFiles] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get('registration/forms/active/');
        setFormConfig(res.data);
        
        // Initialize form values
        const initialValues = {};
        res.data.fields.forEach(field => {
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

  const baseFee = parseFloat(formConfig.fee_amount);
  const taxPercent = parseFloat(formConfig.tax_percentage);
  const taxAmt = baseFee * (taxPercent / 100);
  const totalAmt = baseFee + taxAmt;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8, flexGrow: 1 }}>
        <Grid container spacing={4}>
          
          {/* Main Registration Form */}
          <Grid item xs={12} lg={8}>
            <GlassCard sx={{ p: 4, border: '1px solid rgba(255,255,255,0.6)' }}>
              
              <Box mb={3} display="flex" alignItems="center" gap={1.5}>
                <AssignmentTurnedInIcon color="primary" sx={{ fontSize: '2.2rem' }} />
                <Typography 
                  variant="h4" 
                  fontWeight="900" 
                  fontFamily="'Raleway', sans-serif" 
                  sx={purpleGradientText}
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
 
              {/* Form Render */}
              <form onSubmit={handleSubmit}>
                <DynamicFormRenderer
                  fields={formConfig.fields}
                  values={formValues}
                  onChange={handleValueChange}
                  files={formFiles}
                  onFileChange={handleFileChange}
                  errors={validationErrors}
                />
 
                <Box mt={6} display="flex" justifyContent="flex-end">
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
              </form>

            </GlassCard>
          </Grid>

          {/* Pricing & Summary Card */}
          <Grid item xs={12} lg={4}>
            <GlassCard sx={{ p: 4, position: 'sticky', top: '90px', border: '1px solid rgba(13, 148, 136, 0.15)' }}>
              <Typography variant="h6" fontWeight="bold" fontFamily="'Raleway', sans-serif" mb={3} color="primary.main">
                Fee Summary
              </Typography>

              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="textSecondary">Base Registration Fee</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {formConfig.currency} {baseFee.toFixed(2)}
                  </Typography>
                </Box>

                {taxPercent > 0 && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="textSecondary">Taxes / GST ({taxPercent}%)</Typography>
                    <Typography variant="body2" fontWeight="bold" color="textSecondary">
                      {formConfig.currency} {taxAmt.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box display="flex" justifyContent="space-between">
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.main">Total Payable Amount</Typography>
                  <Typography variant="h6" fontWeight="bold" color="secondary.main">
                    {formConfig.currency} {totalAmt.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              <Box mt={4} sx={{ bgcolor: 'rgba(13, 148, 136, 0.04)', p: 2, borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.1)' }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', lineHeight: 1.5 }}>
                  <strong>Secure Checkout:</strong> Your payment transactions are routed securely. Upon successful completion, 
                  your unique <strong>Registration ID</strong> will be compiled and a confirmation receipt PDF will be delivered 
                  to your registered email.
                </Typography>
              </Box>
            </GlassCard>
          </Grid>

        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Registration;

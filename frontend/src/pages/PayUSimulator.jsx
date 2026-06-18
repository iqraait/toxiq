import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Stack, Alert, CircularProgress, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const PayUSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkout = location.state?.checkout;

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!checkout) {
    return (
      <Box minHeight="100vh" className="gradient-bg">
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Alert severity="error">
            <Typography variant="body1">No active checkout transaction session found.</Typography>
            <Button size="small" onClick={() => navigate('/registration')} sx={{ mt: 2 }} variant="outlined">
              Go to Registration Page
            </Button>
          </Alert>
        </Container>
      </Box>
    );
  }

  const handleSimulatePayment = async (status) => {
    setProcessing(true);
    setError('');

    try {
      const res = await API.post('registration/payment/simulate-callback/', {
        txnid: checkout.txnid,
        status: status, // 'success' or 'failed'
        amount: checkout.amount,
        firstname: checkout.firstname,
        email: checkout.email,
        productinfo: checkout.productinfo,
        key: checkout.key,
        hash: checkout.hash
      });

      if (status === 'success') {
        // Redirect to success screen with registration details
        navigate('/registration/success', { 
          state: { 
            registrationId: res.data.registration_id,
            registrationDbId: checkout.registration_id_temp, // useful to download receipt
            amount: checkout.amount,
            txnid: checkout.txnid
          } 
        });
      } else {
        setError('Simulated payment failed. You can re-register or retry.');
      }
    } catch (err) {
      console.error('Error simulating payment:', err);
      setError('An error occurred while communicating with the payment callback gateway.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <GlassCard sx={{ p: 5, maxWidth: '600px', mx: 'auto', border: '1px solid rgba(13, 148, 136, 0.2)' }}>
          
          <Box display="flex" alignItems="center" justifyContent="center" gap={1.5} mb={2}>
            <CreditCardIcon color="primary" sx={{ fontSize: '2.5rem' }} />
            <Typography 
              variant="h4" 
              fontWeight="900" 
              fontFamily="'Raleway', sans-serif" 
              align="center"
              sx={purpleGradientText}
            >
              PayU Sandbox Simulator
            </Typography>
          </Box>

          <Typography variant="body2" color="textSecondary" align="center" mb={4}>
            Local Development & Sandbox Check. Simulates the transaction redirection.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <Box sx={{ bgcolor: '#f8fafc', p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', mb: 4 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>Transaction Details</Typography>
            <Divider sx={{ my: 1 }} />
            
            <Stack spacing={1.5} mt={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Merchant ID Key</Typography>
                <Typography variant="body2" fontFamily="monospace" fontWeight="bold">{checkout.key}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Transaction ID</Typography>
                <Typography variant="body2" fontFamily="monospace" fontWeight="bold">{checkout.txnid}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Product Info</Typography>
                <Typography variant="body2" fontWeight="500">{checkout.productinfo}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Client Name</Typography>
                <Typography variant="body2" fontWeight="500">{checkout.firstname}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Client Email</Typography>
                <Typography variant="body2" fontWeight="500">{checkout.email}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" pt={1.5} borderTop="1px solid #cbd5e1">
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main">Payable Amount</Typography>
                <Typography variant="subtitle1" fontWeight="bold" color="secondary.main">
                  INR {checkout.amount.toFixed(2)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, display: 'block', fontStyle: 'italic', textAlign: 'center' }}>
            Clicking either option simulates standard HTTP POST payload hashes feedback to Django REST Framework backend callback handlers.
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Button
              variant="contained"
              color="success"
              size="large"
              disabled={processing}
              startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
              onClick={() => handleSimulatePayment('success')}
              sx={{ py: 1.5, px: 3, borderRadius: '30px', fontWeight: 'bold' }}
            >
              Simulate Success
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              disabled={processing}
              startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <ErrorIcon />}
              onClick={() => handleSimulatePayment('failed')}
              sx={{ py: 1.5, px: 3, borderRadius: '30px', fontWeight: 'bold' }}
            >
              Simulate Failure
            </Button>
          </Stack>

        </GlassCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default PayUSimulator;

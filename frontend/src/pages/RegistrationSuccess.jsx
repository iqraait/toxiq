import React, { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box, Button, Stack, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import HomeIcon from '@mui/icons-material/Home';
import confetti from 'canvas-confetti';

import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GlassCard from '../components/GlassCard';
import { purpleGradientText } from '../theme';

const RegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Try to read from history state or query parameters (required for real PayU redirect)
  const registrationId = location.state?.registrationId || searchParams.get('registration_id');
  const registrationDbId = location.state?.registrationDbId || searchParams.get('registration_db_id');
  const txnid = location.state?.txnid || searchParams.get('txnid');
  
  const rawAmount = location.state?.amount || searchParams.get('amount');
  const amount = rawAmount ? parseFloat(rawAmount) : 0;

  useEffect(() => {
    // Fire confetti when successful page is loaded
    if (registrationId) {
      confetti({
        particleCount: 150,
        spread: 75,
        origin: { y: 0.6 }
      });
    }
  }, [registrationId]);

  if (!registrationId) {
    return (
      <Box minHeight="100vh" className="gradient-bg">
        <Navbar />
        <Container maxWidth="sm" sx={{ py: 10 }}>
          <Box textAlign="center">
            <Typography variant="h6" color="textSecondary" mb={3}>No registration information found.</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const handleDownloadReceipt = () => {
    const receiptUrl = `${API.defaults.baseURL}registration/${registrationDbId}/receipt/`;
    window.open(receiptUrl, '_blank');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="gradient-bg">
      <Navbar />

      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        <GlassCard sx={{ p: 5, maxWidth: '600px', mx: 'auto', textAlign: 'center', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <CheckCircleIcon sx={{ fontSize: '5.5rem', color: 'success.main', mb: 2, filter: 'drop-shadow(0 4px 12px rgba(16, 185, 129, 0.2))' }} />
            <Typography 
              variant="h3" 
              fontWeight="900" 
              fontFamily="'Raleway', sans-serif" 
              sx={purpleGradientText}
              gutterBottom
            >
              Registration Successful!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ maxWidth: '400px' }}>
              Thank you for registering for the TOXIQ Program. Your place has been reserved.
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Registration ID Badge */}
          <Box sx={{ bgcolor: 'rgba(13, 148, 136, 0.05)', p: 3, borderRadius: '12px', border: '1px solid rgba(13, 148, 136, 0.1)', mb: 4 }}>
            <Typography variant="body2" color="textSecondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' }}>
              Your Unique Registration ID
            </Typography>
            <Typography variant="h2" fontWeight="950" color="secondary.main" fontFamily="'Raleway', sans-serif" my={1.5}>
              {registrationId}
            </Typography>
            <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
              Please preserve this Registration ID for logging article submissions and conference entry checkout.
            </Typography>
          </Box>

          {/* Transaction Metadata summary */}
          <Box sx={{ p: 2, border: '1px solid #f1f5f9', borderRadius: '8px', mb: 4, textAlign: 'left' }}>
            <Stack spacing={1}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">Transaction ID</Typography>
                <Typography variant="caption" fontWeight="bold">{txnid}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">Amount Paid</Typography>
                <Typography variant="caption" fontWeight="bold">INR {amount.toFixed(2)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">Payment Status</Typography>
                <Typography variant="caption" color="success.main" fontWeight="bold">Successful</Typography>
              </Box>
            </Stack>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 4, display: 'block', px: 2 }}>
            An official email containing payment confirmation, schedules, and your attached receipt PDF has been sent 
            to your registered email address.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadReceipt}
              sx={{ py: 1.5, px: 3, borderRadius: '30px', fontWeight: 'bold' }}
            >
              Download PDF Receipt
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ py: 1.5, px: 3, borderRadius: '30px', fontWeight: 'bold' }}
            >
              Return Home
            </Button>
          </Stack>

        </GlassCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default RegistrationSuccess;

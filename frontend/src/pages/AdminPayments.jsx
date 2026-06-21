import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, MenuItem, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  IconButton, Chip, CircularProgress, Alert, Grid, Divider, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await API.get('registration/payment/tracking/', {
        params: { search, status }
      });
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load transaction tracks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [status]); // refetch on status filter

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchPayments();
    }
  };

  const handleMarkAsPaid = async (paymentId) => {
    if (!window.confirm('Are you sure you want to mark this transaction as SUCCESS? This will generate a registration ID and send the confirmation email to the participant.')) return;
    try {
      await API.post(`registration/payment/${paymentId}/mark-success/`);
      alert('Transaction updated to SUCCESS successfully.');
      fetchPayments();
    } catch (err) {
      console.error('Error marking payment as success:', err);
      alert(err.response?.data?.error || 'Failed to update transaction.');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" fontFamily="'Raleway', sans-serif" color="primary.main" mb={4}>
        Payment Tracking Dashboard
      </Typography>

      {/* Filter and Search Panel */}
      <GlassCard sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Transaction ID or Client Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={fetchPayments}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Transaction Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="SUCCESS">Success</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchPayments}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </GlassCard>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Transaction ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reg ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Participant Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Mode</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '120px' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((pay) => (
                <TableRow key={pay.id} hover>
                  <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{pay.transaction_id}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{pay.registration?.registration_id || 'PENDING'}</TableCell>
                  <TableCell>{pay.registration?.participant_name || 'N/A'}</TableCell>
                  <TableCell>
                    {pay.currency} {pay.amount}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pay.payment_status}
                      size="small"
                      color={
                        pay.payment_status === 'SUCCESS' ? 'success' :
                        pay.payment_status === 'PENDING' ? 'warning' : 'error'
                      }
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>{pay.payment_mode || 'Online Gateway'}</TableCell>
                  <TableCell>
                    {new Date(pay.created_at).toLocaleString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    {pay.payment_status === 'PENDING' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        onClick={() => handleMarkAsPaid(pay.id)}
                        sx={{ fontSize: '0.75rem', py: 0.5, borderRadius: '4px' }}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    No transactions found matching the filter logs.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AdminPayments;

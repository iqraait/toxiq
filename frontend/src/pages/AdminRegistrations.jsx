import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid, Stack, CircularProgress, Alert 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Selected item modal states
  const [selectedReg, setSelectedReg] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editData, setEditData] = useState({});
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await API.get('registration/submissions/', {
        params: { search, payment_status: status }
      });
      setRegistrations(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError('Failed to load registrations. Ensure backend server is responsive.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [status]); // refetch on status filter, search is triggered by clicking Search or Enter

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchRegistrations();
    }
  };

  const handleOpenDetails = (reg) => {
    setSelectedReg(reg);
    setDetailsOpen(true);
  };

  const handleOpenEdit = (reg) => {
    setSelectedReg(reg);
    setEditName(reg.participant_name);
    setEditEmail(reg.participant_email);
    setEditPhone(reg.participant_phone);
    setEditData(reg.field_data || {});
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {
    setEditSubmitting(true);
    try {
      await API.put(`registration/submissions/${selectedReg.id}/`, {
        participant_name: editName,
        participant_email: editEmail,
        participant_phone: editPhone,
        field_data: editData,
        form: selectedReg.form
      });
      setEditOpen(false);
      fetchRegistrations();
    } catch (err) {
      console.error('Error updating registration:', err);
      alert('Failed to update registration details.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDownloadReceipt = (regId) => {
    const url = `${API.defaults.baseURL}registration/${regId}/receipt/`;
    window.open(url, '_blank');
  };

  const handleMarkAsPaid = async (paymentId) => {
    if (!window.confirm('Are you sure you want to mark this registration as SUCCESS? This will generate a registration ID and send the confirmation email to the participant.')) return;
    try {
      await API.post(`registration/payment/${paymentId}/mark-success/`);
      alert('Registration updated to SUCCESS successfully.');
      fetchRegistrations();
    } catch (err) {
      console.error('Error marking payment as success:', err);
      alert(err.response?.data?.error || 'Failed to update registration.');
    }
  };

  const handleResendEmail = async (regId) => {
    if (!window.confirm('Are you sure you want to resend the confirmation email and PDF receipt to this participant?')) return;
    try {
      await API.post(`registration/submissions/${regId}/resend-email/`);
      alert('Confirmation email resent successfully.');
    } catch (err) {
      console.error('Error resending email:', err);
      alert(err.response?.data?.error || 'Failed to resend confirmation email.');
    }
  };

  const getActivePaymentStatus = (reg) => {
    const pay = reg.payments?.[0];
    return pay ? pay.payment_status : 'PENDING';
  };

  const handleExport = async (format) => {
    try {
      const response = await API.get(`reports/export-registrations/?file_format=${format}`, {
        responseType: 'blob',
      });
      
      const fileExt = format === 'pdf' ? 'pdf' : 'xlsx';
      const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TOXIQ_Registrations_Report.${fileExt}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting registrations:', err);
      alert('Failed to export registrations report.');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight="bold" fontFamily="'Raleway', sans-serif" color="primary.main">
          Registration Records
        </Typography>
        
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleExport('excel')}
            sx={{ borderRadius: '20px' }}
          >
            Export Excel
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<FileDownloadIcon />}
            onClick={() => handleExport('pdf')}
            sx={{ borderRadius: '20px' }}
          >
            Export PDF
          </Button>
        </Stack>
      </Box>

      {/* Filters & Search bar */}
      <GlassCard sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by ID, Name, Email, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={fetchRegistrations}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              size="small"
              label="Payment Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="SUCCESS">Success</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchRegistrations}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              Filter / Search
            </Button>
          </Grid>
        </Grid>
      </GlassCard>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Main Grid Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #cbd5e1' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Reg ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date Registered</TableCell>
                <TableCell sx={{ fontWeight: 'bold', align: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((reg) => {
                const payStatus = getActivePaymentStatus(reg);
                return (
                  <TableRow key={reg.id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>{reg.registration_id || 'PENDING'}</TableCell>
                    <TableCell>{reg.participant_name}</TableCell>
                    <TableCell>{reg.participant_email}</TableCell>
                    <TableCell>{reg.participant_phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={payStatus}
                        size="small"
                        color={
                          payStatus === 'SUCCESS' ? 'success' :
                          payStatus === 'PENDING' ? 'warning' : 'error'
                        }
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(reg.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" color="primary" onClick={() => handleOpenDetails(reg)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="secondary" onClick={() => handleOpenEdit(reg)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        {payStatus === 'PENDING' && reg.payments?.[0]?.id && (
                          <IconButton 
                            size="small" 
                            color="success" 
                            title="Mark as Paid" 
                            onClick={() => handleMarkAsPaid(reg.payments[0].id)}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </IconButton>
                        )}
                        {payStatus === 'SUCCESS' && (
                          <IconButton 
                            size="small" 
                            color="info" 
                            title="Resend Email" 
                            onClick={() => handleResendEmail(reg.id)}
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton 
                          size="small" 
                          color="action" 
                          disabled={payStatus !== 'SUCCESS'} 
                          onClick={() => handleDownloadReceipt(reg.id)}
                        >
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
              {registrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    No registration records match your filter criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Details View Modal */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
          Registration Questionnaire Details
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedReg && (
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="caption" color="textSecondary">Registration ID</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedReg.registration_id || 'PENDING'}</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Participant Name</Typography>
                  <Typography variant="body2" fontWeight="500">{selectedReg.participant_name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Phone Number</Typography>
                  <Typography variant="body2" fontWeight="500">{selectedReg.participant_phone}</Typography>
                </Grid>
              </Grid>
              
              <Divider />
              
              <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">Dynamic Questionnaire Answers</Typography>
              
              <Box sx={{ border: '1px solid #f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>
                {Object.entries(selectedReg.field_data || {}).map(([key, val], idx) => {
                  let displayVal = String(val);
                  let isFile = false;
                  
                  if (Array.isArray(val)) {
                    displayVal = val.join(', ');
                  } else if (typeof val === 'object' && val !== null) {
                    displayVal = val.name || val.url || JSON.stringify(val);
                    isFile = !!val.url;
                  }

                  const formattedLabel = key.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

                  return (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', p: 1.5, borderBottom: idx === Object.keys(selectedReg.field_data).length - 1 ? 'none' : '1px solid #f1f5f9', bgcolor: idx % 2 === 0 ? '#f8fafc' : '#ffffff' }}>
                      <Typography variant="caption" color="textSecondary" fontWeight="bold">{formattedLabel}</Typography>
                      {isFile ? (
                        <Button 
                          size="small" 
                          startIcon={<VisibilityIcon />} 
                          sx={{ alignSelf: 'flex-start', mt: 0.5 }}
                          href={val.url} 
                          target="_blank"
                          variant="text"
                        >
                          View Document
                        </Button>
                      ) : (
                        <Typography variant="body2" color="textPrimary" sx={{ mt: 0.25 }}>{displayVal}</Typography>
                      )}
                    </Box>
                  );
                })}
                {Object.keys(selectedReg.field_data || {}).length === 0 && (
                  <Box p={2} textAlign="center">
                    <Typography variant="caption" color="textSecondary">No dynamic fields filled.</Typography>
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setDetailsOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Details Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
          Edit Participant Profile
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Stack spacing={2.5} mt={1.5}>
            <TextField
              fullWidth
              label="Participant Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Email Address"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setEditOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            color="primary"
            disabled={editSubmitting}
          >
            {editSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminRegistrations;

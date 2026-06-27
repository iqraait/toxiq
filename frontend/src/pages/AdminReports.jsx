import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Grid, Button, Stack, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper, 
  MenuItem, TextField, Divider, CircularProgress, Alert 
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import AssessmentIcon from '@mui/icons-material/Assessment';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

const AdminReports = () => {
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorLogs, setErrorLogs] = useState('');
  
  // Revenue Export period state
  const [period, setPeriod] = useState('all');

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await API.get('reports/audit-logs/');
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setErrorLogs('Failed to load system audit trails.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleDownloadReport = async (type, format) => {
    try {
      let queryParams = `file_format=${format}`;
      if (type === 'revenue') {
        queryParams += `&period=${period}`;
      }
      
      const response = await API.get(`reports/export-${type}/?${queryParams}`, {
        responseType: 'blob',
      });
      
      const fileExt = format === 'pdf' ? 'pdf' : 'xlsx';
      const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TOXIQ_${type.charAt(0).toUpperCase() + type.slice(1)}_Report.${fileExt}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Error exporting ${type} report:`, err);
      alert(`Failed to export ${type} report.`);
    }
  };

  return (
    <Box>
      <Grid container spacing={4} mb={4}>
        
        {/* Reports Center */}
        <Grid item xs={12} md={5}>
          <GlassCard sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" mb={3} display="flex" alignItems="center" gap={1.5} fontFamily="'Raleway', sans-serif">
              <AssessmentIcon color="secondary" />
              Consolidated Reports Center
            </Typography>

            <Stack spacing={3}>
              
              {/* Registrations Block */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Registrations Data Report</Typography>
                <Stack direction="row" spacing={2} mt={1}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadReport('registrations', 'excel')}
                    sx={{ flexGrow: 1 }}
                  >
                    Excel Spreadsheet
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadReport('registrations', 'pdf')}
                    sx={{ flexGrow: 1 }}
                  >
                    Report PDF
                  </Button>
                </Stack>
              </Box>

              <Divider />

              {/* Articles Block */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Scientific Articles Submissions</Typography>
                <Stack direction="row" spacing={2} mt={1}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadReport('articles', 'excel')}
                    sx={{ flexGrow: 1 }}
                  >
                    Excel Spreadsheet
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadReport('articles', 'pdf')}
                    sx={{ flexGrow: 1 }}
                  >
                    Report PDF
                  </Button>
                </Stack>
              </Box>

              <Divider />

              {/* Revenue Block */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>Financial Revenue Report</Typography>
                
                <Grid container spacing={2} mt={0.5} mb={1.5} alignItems="center">
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      size="small"
                      label="Select Period Filter"
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                    >
                      <MenuItem value="all">All-Time Cumulative</MenuItem>
                      <MenuItem value="daily">Daily Revenue</MenuItem>
                      <MenuItem value="monthly">Current Month Revenue</MenuItem>
                      <MenuItem value="yearly">Current Year Revenue</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadReport('revenue', 'excel')}
                    sx={{ flexGrow: 1 }}
                  >
                    Excel Summary
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleDownloadReport('revenue', 'pdf')}
                    sx={{ flexGrow: 1 }}
                  >
                    PDF Invoice Log
                  </Button>
                </Stack>
              </Box>

            </Stack>
          </GlassCard>
        </Grid>

        {/* Audit Trails Table */}
        <Grid item xs={12} md={7}>
          <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold" color="primary.main" display="flex" alignItems="center" gap={1.5} fontFamily="'Raleway', sans-serif">
                <HistoryIcon color="secondary" />
                Administrative Audit Logs
              </Typography>
              <Button size="small" variant="outlined" onClick={fetchAuditLogs}>Refresh</Button>
            </Box>

            {errorLogs && <Alert severity="error" sx={{ mb: 2 }}>{errorLogs}</Alert>}

            {loadingLogs ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1, py: 10 }}>
                <CircularProgress size={30} />
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ flexGrow: 1, maxHeight: '430px', overflowY: 'auto', boxShadow: 'none', border: '1px solid #e2e8f0' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Timestamp</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Operator</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>Action Log</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f8fafc' }}>IP Coordinate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell sx={{ fontSize: '0.8rem' }}>
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{log.user}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem' }}>{log.action.replace('_', ' ')}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace' }}>{log.ip_address || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                    {logs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          No audit trails logged.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </GlassCard>
        </Grid>

      </Grid>
    </Box>
  );
};

export default AdminReports;

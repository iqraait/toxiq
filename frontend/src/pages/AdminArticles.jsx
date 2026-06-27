import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, TextField, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Paper, IconButton, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, Grid, Stack, CircularProgress, Alert 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RateCheckIcon from '@mui/icons-material/RateReview';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  // Moderation Dialog State
  const [selectedArt, setSelectedArt] = useState(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState('SUBMITTED');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await API.get('articles/submissions/', {
        params: { search, status }
      });
      setArticles(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles. Please check backend API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [status]); // refetch on status filter, search is triggered by Enter or button

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchArticles();
    }
  };

  const handleOpenReview = (art) => {
    setSelectedArt(art);
    setReviewStatus(art.status);
    setAdminRemarks(art.admin_remarks || '');
    setReviewOpen(true);
  };

  const handleReviewSubmit = async () => {
    setReviewSubmitting(true);
    try {
      await API.patch(`articles/submissions/${selectedArt.id}/update_status/`, {
        status: reviewStatus,
        admin_remarks: adminRemarks
      });
      setReviewOpen(false);
      fetchArticles();
    } catch (err) {
      console.error('Error moderating article:', err);
      alert('Failed to submit moderation review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDownloadFile = (fileUrl) => {
    window.open(fileUrl, '_blank');
  };

  const handleExport = async (format) => {
    try {
      const response = await API.get(`reports/export-articles/?file_format=${format}`, {
        responseType: 'blob',
      });
      
      const fileExt = format === 'pdf' ? 'pdf' : 'xlsx';
      const contentType = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TOXIQ_Articles_Report.${fileExt}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting articles:', err);
      alert('Failed to export articles report.');
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight="bold" fontFamily="'Raleway', sans-serif" color="primary.main">
          Article Submissions Moderation
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

      {/* Filter and search panel */}
      <GlassCard sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={7}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by Title, Author, or Registration ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={fetchArticles}>
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
              label="Submission Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">All Submissions</MenuItem>
              <MenuItem value="SUBMITTED">Submitted</MenuItem>
              <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={fetchArticles}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              Filter / Search
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
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reg ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Article Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Submitted Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', align: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((art) => (
                <TableRow key={art.id} hover>
                  <TableCell>{art.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{art.registration?.registration_id || 'PENDING'}</TableCell>
                  <TableCell>{art.author_name}</TableCell>
                  <TableCell sx={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {art.article_title}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={art.status}
                      size="small"
                      color={
                        art.status === 'APPROVED' ? 'success' :
                        art.status === 'UNDER_REVIEW' ? 'warning' :
                        art.status === 'REJECTED' ? 'error' : 'default'
                      }
                      sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(art.submitted_date).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small" color="primary" onClick={() => handleDownloadFile(art.file)}>
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary" onClick={() => handleOpenReview(art)}>
                        <RateCheckIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    No article submissions logged.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Moderation Review Modal */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>
          Moderate Research Article
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedArt && (
            <Stack spacing={3} mt={1.5}>
              <Box>
                <Typography variant="caption" color="textSecondary">Article Title</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedArt.article_title}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Lead Author & Registration</Typography>
                <Typography variant="body2">{selectedArt.author_name} ({selectedArt.registration?.registration_id})</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Author Remarks / Comments</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    whiteSpace: 'pre-wrap', 
                    bgcolor: '#f8fafc', 
                    p: 1.5, 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    maxHeight: '150px',
                    overflowY: 'auto',
                    mt: 0.5
                  }}
                >
                  {selectedArt.remarks || 'None'}
                </Typography>
              </Box>
              
              <TextField
                select
                fullWidth
                label="Review Decision Status"
                value={reviewStatus}
                onChange={(e) => setReviewStatus(e.target.value)}
              >
                <MenuItem value="SUBMITTED">Submitted</MenuItem>
                <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </TextField>

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Reviewer Comments / Remarks"
                placeholder="Write feedback/remarks for the author..."
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setReviewOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleReviewSubmit} 
            variant="contained" 
            color="primary"
            disabled={reviewSubmitting}
          >
            {reviewSubmitting ? 'Submitting...' : 'Save Decision'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminArticles;

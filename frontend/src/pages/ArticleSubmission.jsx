import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, TextField, Button, Alert, 
  CircularProgress, Divider, Stack, FormHelperText 
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
  const [registrationId, setRegistrationId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [email, setEmail] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
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
        setInstructions(res.data.content?.article_instructions || 'Upload files in PDF format, maximum 10MB. Verify Registration ID before submitting.');
      } catch (err) {
        console.error('Error fetching instructions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructions();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
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

    if (!registrationId || !authorName || !email || !articleTitle || !file) {
      setError('Please fill in all required fields and upload your file.');
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('registration_id', registrationId.trim());
    formData.append('author_name', authorName.trim());
    formData.append('email', email.trim());
    formData.append('article_title', articleTitle.trim());
    formData.append('remarks', remarks.trim());
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
      setRegistrationId('');
      setAuthorName('');
      setEmail('');
      setArticleTitle('');
      setRemarks('');
      setFile(null);
    } catch (err) {
      console.error('Article submit error:', err);
      if (err.response?.status === 400) {
        // DRF Serializer errors
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

      <Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
        <GlassCard sx={{ p: 5, border: '1px solid rgba(255, 255, 255, 0.6)' }}>
          
          <Box mb={3}>
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
            <Stack spacing={3}>
              
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

              <TextField
                required
                fullWidth
                label="Lead Author Name"
                placeholder="Enter lead author's full name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                error={!!validationErrors.author_name}
                helperText={validationErrors.author_name?.[0]}
              />

              <TextField
                required
                fullWidth
                label="Contact Email Address"
                placeholder="Enter email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!validationErrors.email}
                helperText={validationErrors.email?.[0]}
              />

              <TextField
                required
                fullWidth
                label="Article / Abstract Title"
                placeholder="Enter your research article title"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                error={!!validationErrors.article_title}
                helperText={validationErrors.article_title?.[0]}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Co-Authors & Remarks"
                placeholder="List co-authors (if any) or specify remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                error={!!validationErrors.remarks}
                helperText={validationErrors.remarks?.[0]}
              />

              {/* Document File Uploader */}
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#334155', mb: 1 }}>
                  Upload Manuscript (PDF/DOCX) *
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
                      accept=".pdf,.doc,.docx"
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
                <FormHelperText>File must be PDF or DOCX format under 10MB.</FormHelperText>
              </Box>

              <Box display="flex" justifyContent="flex-end" pt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting}
                  sx={{ px: 5, py: 1.5, borderRadius: '30px', fontWeight: 'bold' }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Article'}
                </Button>
              </Box>

            </Stack>
          </form>

        </GlassCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default ArticleSubmission;

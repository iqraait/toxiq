import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Tabs, Tab, TextField, Button, Grid, Stack, 
  CardContent, Card, IconButton, Avatar, Dialog, DialogTitle, 
  DialogContent, DialogActions, Alert, CircularProgress, Divider 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

const AdminCMS = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Text Content States
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerCtaText, setBannerCtaText] = useState('Register Now');
  const [bannerCtaLink, setBannerCtaLink] = useState('#registration');
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerImageUrl, setBannerImageUrl] = useState('');

  const [aboutTitle, setAboutTitle] = useState('About TOXIQ Program');
  const [aboutText, setAboutText] = useState('');
  
  const [dateRegOpen, setDateRegOpen] = useState('');
  const [dateRegClose, setDateRegClose] = useState('');
  const [dateArticle, setDateArticle] = useState('');

  const [regInst, setRegInst] = useState('');
  const [artInst, setArtInst] = useState('');

  const [contactAddress, setContactAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // 2. Collections States (Banners, Speakers, Sponsors, Gallery)
  const [banners, setBanners] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [gallery, setGallery] = useState([]);

  // Modals for Speaker
  const [spOpen, setSpOpen] = useState(false);
  const [spName, setSpName] = useState('');
  const [spDes, setSpDes] = useState('');
  const [spDesc, setSpDesc] = useState('');
  const [spFile, setSpFile] = useState(null);
  const [spSubmitting, setSpSubmitting] = useState(false);

  // Modals for Sponsor
  const [sponOpen, setSponOpen] = useState(false);
  const [sponName, setSponName] = useState('');
  const [sponUrl, setSponUrl] = useState('');
  const [sponFile, setSponFile] = useState(null);
  const [sponSubmitting, setSponSubmitting] = useState(false);

  // Modals for Gallery
  const [galOpen, setGalOpen] = useState(false);
  const [galCaption, setGalCaption] = useState('');
  const [galFile, setGalFile] = useState(null);
  const [galSubmitting, setGalSubmitting] = useState(false);

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      const res = await API.get('cms/home/');
      const { banners, speakers, sponsors, gallery, content } = res.data;

      // Banner values
      if (banners?.[0]) {
        setBannerTitle(banners[0].title);
        setBannerSubtitle(banners[0].subtitle);
        setBannerCtaText(banners[0].cta_text);
        setBannerCtaLink(banners[0].cta_link);
        setBannerImageUrl(banners[0].image);
      }

      // Key content blocks
      setAboutTitle(content.about_content?.title || 'About TOXIQ Program');
      setAboutText(content.about_content?.text || '');
      
      setDateRegOpen(content.important_dates?.registration_open || '');
      setDateRegClose(content.important_dates?.registration_close || '');
      setDateArticle(content.important_dates?.article_deadline || '');

      setRegInst(content.registration_instructions || '');
      setArtInst(content.article_instructions || '');

      setContactAddress(content.contact_details?.address || '');
      setContactEmail(content.contact_details?.email || '');
      setContactPhone(content.contact_details?.phone || '');

      // Lists
      setBanners(banners || []);
      setSpeakers(speakers);
      setSponsors(sponsors);
      setGallery(gallery);
    } catch (err) {
      console.error('Error fetching CMS data:', err);
      setError('Failed to query CMS details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  const handleTextInfoSave = async () => {
    setError('');
    setSuccessMsg('');
    try {
      // 1. Save general ProgramContent text blocks
      await API.put('cms/content/bulk-update/', {
        about_content: { title: aboutTitle, text: aboutText },
        important_dates: {
          registration_open: dateRegOpen,
          registration_close: dateRegClose,
          article_deadline: dateArticle
        },
        contact_details: {
          address: contactAddress,
          email: contactEmail,
          phone: contactPhone
        },
        registration_instructions: regInst,
        article_instructions: artInst
      });

      // 2. Save Banner Details
      // We will create a FormData to upload banner image if selected
      const activeBanner = banners?.[0];
      const formData = new FormData();
      formData.append('title', bannerTitle);
      formData.append('subtitle', bannerSubtitle);
      formData.append('cta_text', bannerCtaText);
      formData.append('cta_link', bannerCtaLink);
      if (bannerFile) {
        formData.append('image', bannerFile);
      }

      if (activeBanner) {
        await API.put(`cms/banners/${activeBanner.id}/`, formData);
      } else {
        // If no banner existed, POST a new one
        await API.post('cms/banners/', formData);
      }

      setSuccessMsg('Website text contents updated successfully.');
      fetchCMSData();
    } catch (err) {
      console.error('Error saving text details:', err);
      setError('An error occurred while saving CMS details.');
    }
  };

  const handleAddSpeaker = async () => {
    if (!spName || !spDes) return;
    setSpSubmitting(true);
    const formData = new FormData();
    formData.append('name', spName);
    formData.append('designation', spDes);
    formData.append('description', spDesc);
    if (spFile) {
      formData.append('photo', spFile);
    }
    try {
      await API.post('cms/speakers/', formData);
      setSpOpen(false);
      setSpName('');
      setSpDes('');
      setSpDesc('');
      setSpFile(null);
      fetchCMSData();
    } catch (err) {
      console.error(err);
      alert('Failed to save speaker.');
    } finally {
      setSpSubmitting(false);
    }
  };

  const handleDeleteSpeaker = async (id) => {
    if (!window.confirm('Delete this speaker profile?')) return;
    try {
      await API.delete(`cms/speakers/${id}/`);
      fetchCMSData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSponsor = async () => {
    if (!sponName || !sponFile) return;
    setSponSubmitting(true);
    const formData = new FormData();
    formData.append('name', sponName);
    formData.append('website_url', sponUrl);
    formData.append('logo', sponFile);
    try {
      await API.post('cms/sponsors/', formData);
      setSponOpen(false);
      setSponName('');
      setSponUrl('');
      setSponFile(null);
      fetchCMSData();
    } catch (err) {
      console.error(err);
      alert('Failed to upload sponsor.');
    } finally {
      setSponSubmitting(false);
    }
  };

  const handleDeleteSponsor = async (id) => {
    if (!window.confirm('Delete this sponsor logo?')) return;
    try {
      await API.delete(`cms/sponsors/${id}/`);
      fetchCMSData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGallery = async () => {
    if (!galFile) return;
    setGalSubmitting(true);
    const formData = new FormData();
    formData.append('caption', galCaption);
    formData.append('image', galFile);
    try {
      await API.post('cms/gallery/', formData);
      setGalOpen(false);
      setGalCaption('');
      setGalFile(null);
      fetchCMSData();
    } catch (err) {
      console.error(err);
      alert('Failed to upload gallery image.');
    } finally {
      setGalSubmitting(false);
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this image from gallery?')) return;
    try {
      await API.delete(`cms/gallery/${id}/`);
      fetchCMSData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && activeTab === 0) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  const data = { banners, speakers, sponsors, gallery };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" fontFamily="'Raleway', sans-serif" color="primary.main">
          Website Content Management (CMS)
        </Typography>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMsg('')}>{successMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Tabs 
        value={activeTab} 
        onChange={(e, val) => setActiveTab(val)} 
        sx={{ mb: 4, borderBottom: '1px solid #cbd5e1' }}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Banner & Static Text Blocks" sx={{ fontWeight: 'bold' }} />
        <Tab label="Guest Speakers" sx={{ fontWeight: 'bold' }} />
        <Tab label="Sponsors & Gallery" sx={{ fontWeight: 'bold' }} />
      </Tabs>

      {/* TAB 0: TEXT INFO */}
      {activeTab === 0 && (
        <Stack spacing={4}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main" fontFamily="'Raleway', sans-serif">
              Hero Banner Settings
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Banner Title" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} sx={{ mb: 3 }} />
                <TextField fullWidth multiline rows={2} label="Banner Subtitle" value={bannerSubtitle} onChange={(e) => setBannerSubtitle(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField fullWidth label="CTA Button Text" value={bannerCtaText} onChange={(e) => setBannerCtaText(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth label="CTA Button Link" value={bannerCtaLink} onChange={(e) => setBannerCtaLink(e.target.value)} />
                  </Grid>
                </Grid>
                
                <Box mt={3} display="flex" alignItems="center" gap={2}>
                  <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} color="secondary">
                    Upload Background Image
                    <input type="file" hidden onChange={(e) => setBannerFile(e.target.files[0])} />
                  </Button>
                  {bannerFile && <Typography variant="caption">{bannerFile.name}</Typography>}
                  {!bannerFile && bannerImageUrl && (
                    <Avatar src={bannerImageUrl} variant="square" sx={{ width: 60, height: 40, borderRadius: '4px' }} />
                  )}
                </Box>
              </Grid>
            </Grid>
          </GlassCard>

          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main" fontFamily="'Raleway', sans-serif">
              About TOXIQ Section (supports HTML formatting)
            </Typography>
            <TextField fullWidth label="Section Title" value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} sx={{ mb: 3 }} />
            <TextField fullWidth multiline rows={8} label="HTML Section Content" value={aboutText} onChange={(e) => setAboutText(e.target.value)} />
          </GlassCard>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main" fontFamily="'Raleway', sans-serif">
                  Important Dates Timeline
                </Typography>
                <Stack spacing={3}>
                  <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} label="Registration Opens" value={dateRegOpen} onChange={(e) => setDateRegOpen(e.target.value)} />
                  <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} label="Registration Closes" value={dateRegClose} onChange={(e) => setDateRegClose(e.target.value)} />
                  <TextField fullWidth type="date" InputLabelProps={{ shrink: true }} label="Article Submission Deadline" value={dateArticle} onChange={(e) => setDateArticle(e.target.value)} />
                </Stack>
              </GlassCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <GlassCard sx={{ p: 4, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main" fontFamily="'Raleway', sans-serif">
                  Contact Coordinates
                </Typography>
                <Stack spacing={3}>
                  <TextField fullWidth multiline rows={2} label="Hospital Secretariat Address" value={contactAddress} onChange={(e) => setContactAddress(e.target.value)} />
                  <TextField fullWidth label="Official Contact Email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  <TextField fullWidth label="Official Phone Number" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                </Stack>
              </GlassCard>
            </Grid>
          </Grid>

          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main" fontFamily="'Raleway', sans-serif">
              Form Instructions Notes
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField fullWidth multiline rows={3} label="Registration Panel Guidelines" value={regInst} onChange={(e) => setRegInst(e.target.value)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth multiline rows={3} label="Article Submissions Guidelines" value={artInst} onChange={(e) => setArtInst(e.target.value)} />
              </Grid>
            </Grid>
          </GlassCard>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              onClick={handleTextInfoSave}
              sx={{ px: 5, py: 1.5, borderRadius: '30px', fontWeight: 'bold' }}
            >
              Save Website Contents
            </Button>
          </Box>
        </Stack>
      )}

      {/* TAB 1: SPEAKERS */}
      {activeTab === 1 && (
        <Box>
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setSpOpen(true)}>
              Add Speaker
            </Button>
          </Box>

          <Grid container spacing={3}>
            {speakers.map((sp) => (
              <Grid item xs={12} sm={6} md={4} key={sp.id}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3, textAlign: 'center' }}>
                    <Avatar src={sp.photo} sx={{ width: 80, height: 80, mb: 2 }} />
                    <Typography variant="h6" fontWeight="bold">{sp.name}</Typography>
                    <Typography variant="caption" color="secondary.main" fontWeight="bold" mb={1}>{sp.designation}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ height: '60px', overflow: 'hidden' }}>{sp.description}</Typography>
                  </CardContent>
                  <IconButton 
                    onClick={() => handleDeleteSpeaker(sp.id)}
                    sx={{ position: 'absolute', top: 10, right: 10, color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
            {speakers.length === 0 && (
              <Grid item xs={12}>
                <Alert severity="warning">No speakers registered. Seed or add speakers to display in landing page grid.</Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* TAB 2: SPONSORS & GALLERY */}
      {activeTab === 2 && (
        <Grid container spacing={4}>
          {/* Sponsors Section */}
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" fontFamily="'Raleway', sans-serif">
                  Academic Sponsors
                </Typography>
                <Button variant="outlined" color="primary" startIcon={<AddIcon />} size="small" onClick={() => setSponOpen(true)}>
                  Add Logo
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Stack spacing={2}>
                {sponsors.map((spon) => (
                  <Box key={spon.id} display="flex" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar src={spon.logo} variant="square" sx={{ width: 50, height: 30 }} />
                      <Typography variant="body2" fontWeight="bold">{spon.name}</Typography>
                    </Box>
                    <IconButton color="error" onClick={() => handleDeleteSponsor(spon.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {sponsors.length === 0 && (
                  <Typography variant="caption" color="textSecondary" align="center">No sponsor logos uploaded.</Typography>
                )}
              </Stack>
            </GlassCard>
          </Grid>

          {/* Gallery Section */}
          <Grid item xs={12} md={6}>
            <GlassCard sx={{ p: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold" color="primary.main" fontFamily="'Raleway', sans-serif">
                  Masonry Gallery
                </Typography>
                <Button variant="outlined" color="primary" startIcon={<AddIcon />} size="small" onClick={() => setGalOpen(true)}>
                  Add Image
                </Button>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {gallery.map((g) => (
                  <Grid item xs={6} key={g.id} sx={{ position: 'relative' }}>
                    <Box sx={{ height: 100, border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={g.image} alt={g.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteGallery(g.id)}
                      sx={{ position: 'absolute', top: 20, right: 10, bgcolor: 'rgba(255,255,255,0.7)', color: 'error.main', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                ))}
                {gallery.length === 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center' }}>No gallery images uploaded.</Typography>
                  </Grid>
                )}
              </Grid>
            </GlassCard>
          </Grid>
        </Grid>
      )}

      {/* Speakers Dialog */}
      <Dialog open={spOpen} onClose={() => setSpOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add Guest Speaker</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1.5}>
            <TextField fullWidth label="Full Name" value={spName} onChange={(e) => setSpName(e.target.value)} />
            <TextField fullWidth label="Designation / Affiliation" value={spDes} onChange={(e) => setSpDes(e.target.value)} />
            <TextField fullWidth multiline rows={3} label="Brief Description / Profile" value={spDesc} onChange={(e) => setSpDesc(e.target.value)} />
            
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} color="secondary">
              Upload Photo
              <input type="file" hidden onChange={(e) => setSpFile(e.target.files[0])} />
            </Button>
            {spFile && <Typography variant="caption">{spFile.name}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSpOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSpeaker} variant="contained" disabled={spSubmitting}>
            {spSubmitting ? 'Saving...' : 'Add Speaker'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sponsors Dialog */}
      <Dialog open={sponOpen} onClose={() => setSponOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Upload Sponsor Logo</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1.5}>
            <TextField fullWidth label="Sponsor Name" value={sponName} onChange={(e) => setSponName(e.target.value)} />
            <TextField fullWidth label="Website URL (Optional)" value={sponUrl} onChange={(e) => setSponUrl(e.target.value)} />
            
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} color="secondary" required>
              Select Logo Image *
              <input type="file" hidden onChange={(e) => setSponFile(e.target.files[0])} />
            </Button>
            {sponFile && <Typography variant="caption">{sponFile.name}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSponOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSponsor} variant="contained" disabled={sponSubmitting}>
            {sponSubmitting ? 'Uploading...' : 'Save Sponsor'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Gallery Dialog */}
      <Dialog open={galOpen} onClose={() => setGalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Add Gallery Image</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1.5}>
            <TextField fullWidth label="Caption / Description" value={galCaption} onChange={(e) => setGalCaption(e.target.value)} />
            
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />} color="secondary">
              Select Image *
              <input type="file" hidden onChange={(e) => setGalFile(e.target.files[0])} />
            </Button>
            {galFile && <Typography variant="caption">{galFile.name}</Typography>}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setGalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddGallery} variant="contained" disabled={galSubmitting}>
            {galSubmitting ? 'Uploading...' : 'Upload Image'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminCMS;

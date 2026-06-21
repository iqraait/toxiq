import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, TextField, Button, Grid, Stack, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Dialog, DialogTitle, DialogContent, 
  DialogActions, MenuItem, FormControlLabel, Checkbox, Divider, Alert, CircularProgress, Chip 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import API from '../services/api';
import GlassCard from '../components/GlassCard';

const AdminFormBuilder = () => {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Settings states
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [fee, setFee] = useState(500.00);
  const [tax, setTax] = useState(0.00);
  const [currency, setCurrency] = useState('INR');
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Field Editor States
  const [fieldOpen, setFieldOpen] = useState(false);
  const [editingField, setEditingField] = useState(null); // null means adding a new field
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [required, setRequired] = useState(false);
  const [placeholder, setPlaceholder] = useState('');
  const [helpText, setHelpText] = useState('');
  const [optionsStr, setOptionsStr] = useState('');
  const [optionsList, setOptionsList] = useState([]);
  const [order, setOrder] = useState(0);
  const [fieldSubmitting, setFieldSubmitting] = useState(false);

  const fetchForm = async () => {
    try {
      const res = await API.get('registration/forms/active/');
      setForm(res.data);
      setTitle(res.data.title);
      setInstructions(res.data.instructions);
      setFee(res.data.fee_amount);
      setTax(res.data.tax_percentage);
      setCurrency(res.data.currency);
    } catch (err) {
      console.error('Error fetching form builder:', err);
      setError('Failed to fetch the dynamic form schema.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForm();
  }, []);

  const handleSaveSettings = async () => {
    setSettingsSaving(true);
    setError('');
    setSuccess('');
    try {
      await API.put(`registration/forms/${form.id}/`, {
        title,
        instructions,
        fee_amount: fee,
        tax_percentage: tax,
        currency,
        is_active: true
      });
      setSuccess('Form parameters and fee settings saved.');
      fetchForm();
    } catch (err) {
      console.error(err);
      setError('Failed to update form settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleOpenAddField = () => {
    setEditingField(null);
    setLabel('');
    setType('text');
    setRequired(false);
    setPlaceholder('');
    setHelpText('');
    setOptionsStr('');
    setOptionsList([]);
    setOrder((form?.fields?.length || 0) + 1);
    setFieldOpen(true);
  };

  const getOptionsString = (options) => {
    if (!options) return '';
    return options.map(opt => {
      if (opt && typeof opt === 'object') {
        if (opt.price !== undefined && opt.price !== null) {
          return `${opt.value}:${opt.price}`;
        }
        return opt.value;
      }
      return opt;
    }).join(', ');
  };

  const handleOpenEditField = (field) => {
    setEditingField(field);
    setLabel(field.label);
    setType(field.field_type);
    setRequired(field.is_required);
    setPlaceholder(field.placeholder || '');
    setHelpText(field.help_text || '');
    setOptionsStr(getOptionsString(field.options));
    
    if (field.options) {
      setOptionsList(field.options.map(opt => {
        if (opt && typeof opt === 'object') {
          return {
            value: opt.value || '',
            price: opt.price !== undefined && opt.price !== null ? String(opt.price) : '',
            link: opt.link || ''
          };
        }
        return { value: String(opt), price: '', link: '' };
      }));
    } else {
      setOptionsList([]);
    }
    
    setOrder(field.order);
    setFieldOpen(true);
  };

  const handleFieldSubmit = async () => {
    if (!label) return;
    setFieldSubmitting(true);
    
    // Format options from optionsList
    let options = null;
    if (['radio', 'dropdown', 'checkbox'].includes(type)) {
      options = optionsList
        .filter(opt => opt.value.trim() !== '')
        .map(opt => {
          const item = { value: opt.value.trim() };
          if (opt.price !== '') {
            const priceVal = parseFloat(opt.price);
            if (!isNaN(priceVal)) {
              item.price = priceVal;
            }
          }
          if (opt.link && opt.link.trim() !== '') {
            item.link = opt.link.trim();
          }
          return item;
        });
      if (options.length === 0) {
        options = null;
      }
    }
    
    const payload = {
      label,
      field_type: type,
      is_required: required,
      placeholder,
      help_text: helpText,
      options,
      order,
      form: form.id
    };

    try {
      if (editingField) {
        await API.put(`registration/fields/${editingField.id}/`, payload);
      } else {
        await API.post('registration/fields/', payload);
      }
      setFieldOpen(false);
      fetchForm();
    } catch (err) {
      console.error(err);
      alert('Failed to save form field.');
    } finally {
      setFieldSubmitting(false);
    }
  };

  const handleDeleteField = async (id) => {
    if (!window.confirm('Delete this registration form field?')) return;
    try {
      await API.delete(`registration/fields/${id}/`);
      fetchForm();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" fontFamily="'Raleway', sans-serif" color="primary.main" mb={4}>
        Dynamic Registration Form Builder
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>}

      <Grid container spacing={4}>
        {/* Left: General Settings & Fees */}
        <Grid item xs={12} lg={4}>
          <GlassCard sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="primary.main" fontFamily="'Raleway', sans-serif">
              Form Parameters
            </Typography>

            <Stack spacing={3}>
              <TextField fullWidth label="Form Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <TextField fullWidth multiline rows={3} label="Above-Form Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
              
              <Divider sx={{ my: 1 }} />
              
              <Typography variant="subtitle2" fontWeight="bold" color="secondary.main">Registration Fees Settings</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <TextField fullWidth type="number" label="Fee Amount" value={fee} onChange={(e) => setFee(parseFloat(e.target.value) || 0)} />
                </Grid>
                <Grid item xs={4}>
                  <TextField fullWidth label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} />
                </Grid>
              </Grid>

              <TextField fullWidth type="number" label="Tax / GST Percentage" value={tax} onChange={(e) => setTax(parseFloat(e.target.value) || 0)} />

              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSaveSettings}
                disabled={settingsSaving}
                sx={{ mt: 1 }}
              >
                {settingsSaving ? 'Saving...' : 'Save Parameters'}
              </Button>
            </Stack>
          </GlassCard>
        </Grid>

        {/* Right: Dynamic Fields Table */}
        <Grid item xs={12} lg={8}>
          <GlassCard sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold" color="primary.main" fontFamily="'Raleway', sans-serif">
                Dynamic Questionnaire Fields
              </Typography>
              <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={handleOpenAddField}>
                Add Field
              </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid #e2e8f0' }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '60px' }}>Order</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Field Label</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Input Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Required</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', align: 'center', width: '100px' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {form?.fields?.map((field) => (
                    <TableRow key={field.id} hover>
                      <TableCell sx={{ fontWeight: 'bold' }}>{field.order}</TableCell>
                      <TableCell>{field.label}</TableCell>
                      <TableCell>
                        <Chip label={field.field_type.toUpperCase()} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={field.is_required ? 'Yes' : 'No'} 
                          size="small" 
                          color={field.is_required ? 'primary' : 'default'} 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" color="primary" onClick={() => handleOpenEditField(field)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDeleteField(field.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {form?.fields?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        No dynamic fields created. Add custom fields to render on the registration questionnaire.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </GlassCard>
        </Grid>
      </Grid>

      {/* Field Editor Dialog */}
      <Dialog open={fieldOpen} onClose={() => setFieldOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {editingField ? 'Edit Questionnaire Field' : 'Add Custom Field'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1.5}>
            <TextField
              required
              fullWidth
              label="Field Label / Question"
              placeholder="e.g. Professional Licensing ID"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Input Field Type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <MenuItem value="text">Text Field</MenuItem>
                  <MenuItem value="textarea">Text Area</MenuItem>
                  <MenuItem value="number">Number Field</MenuItem>
                  <MenuItem value="email">Email Field</MenuItem>
                  <MenuItem value="phone">Phone Field</MenuItem>
                  <MenuItem value="date">Date Field</MenuItem>
                  <MenuItem value="radio">Radio Buttons</MenuItem>
                  <MenuItem value="dropdown">Dropdown Select</MenuItem>
                  <MenuItem value="checkbox">Checkbox list</MenuItem>
                  <MenuItem value="file">File Upload</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Display Order"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                />
              </Grid>
            </Grid>

            {['radio', 'dropdown', 'checkbox'].includes(type) && (
              <Box sx={{ mt: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="primary.main" mb={1.5}>
                  Configure Field Options
                </Typography>
                <Stack spacing={2}>
                  {optionsList.map((opt, index) => (
                    <Grid container spacing={1.5} key={index} alignItems="center">
                      <Grid item xs={5}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Option Name"
                          placeholder="e.g. Regular Delegate"
                          value={opt.value}
                          onChange={(e) => {
                            const newList = [...optionsList];
                            newList[index].value = e.target.value;
                            setOptionsList(newList);
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Fee (Optional)"
                          placeholder="500"
                          value={opt.price}
                          onChange={(e) => {
                            const newList = [...optionsList];
                            newList[index].price = e.target.value;
                            setOptionsList(newList);
                          }}
                        />
                      </Grid>
                      <Grid item xs={3.2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Payment Link (Optional)"
                          placeholder="https://..."
                          value={opt.link}
                          onChange={(e) => {
                            const newList = [...optionsList];
                            newList[index].link = e.target.value;
                            setOptionsList(newList);
                          }}
                        />
                      </Grid>
                      <Grid item xs={0.8} sx={{ textAlign: 'right' }}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setOptionsList(optionsList.filter((_, idx) => idx !== index));
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOptionsList([...optionsList, { value: '', price: '', link: '' }])}
                    sx={{ alignSelf: 'flex-start', mt: 0.5, borderRadius: '8px' }}
                  >
                    Add Option
                  </Button>
                </Stack>
              </Box>
            )}

            <TextField
              fullWidth
              label="Input Placeholder Text"
              value={placeholder}
              onChange={(e) => setPlaceholder(e.target.value)}
            />

            <TextField
              fullWidth
              label="Input Helper/Help Text"
              value={helpText}
              onChange={(e) => setHelpText(e.target.value)}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={required}
                  onChange={(e) => setRequired(e.target.checked)}
                  color="primary"
                />
              }
              label="Make field Required *"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setFieldOpen(false)}>Cancel</Button>
          <Button onClick={handleFieldSubmit} variant="contained" disabled={fieldSubmitting}>
            {fieldSubmitting ? 'Saving...' : 'Save Field'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFormBuilder;

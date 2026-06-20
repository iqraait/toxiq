import React from 'react';
import { 
  TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, 
  Radio, Select, MenuItem, Checkbox, FormGroup, Button, 
  Typography, Box, Grid, FormHelperText, InputLabel 
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const DynamicFormRenderer = ({ fields = [], values = {}, onChange, files = {}, onFileChange, errors = {}, currency = 'INR' }) => {

  const getOptionInfo = (opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.value
      };
    }
    return { value: opt, label: opt };
  };

  const handleInputChange = (fieldId, value) => {
    onChange(fieldId, value);
  };

  const handleCheckboxChange = (fieldId, option, isChecked) => {
    const field = fields.find(f => String(f.id) === String(fieldId));
    const isSingleSelectField = field && [
      'Specialty / Department of Practice',
      'Registration Category'
    ].includes(field.label);

    if (isSingleSelectField) {
      onChange(fieldId, isChecked ? [option] : []);
    } else {
      const currentValues = values[fieldId] || [];
      let newValues = [...currentValues];
      if (isChecked) {
        newValues.push(option);
      } else {
        newValues = newValues.filter(v => v !== option);
      }
      onChange(fieldId, newValues);
    }
  };

  return (
    <Grid container spacing={3.5} rowSpacing={4}>
      {fields.map((field) => {
        const fieldId = String(field.id);
        const value = values[fieldId] || '';
        const error = errors[field.label] || errors[fieldId];

        // Responsive grid sizes for professional design alignment
        let gridSize = { xs: 12 };
        if (field.label === 'Prefix') {
          gridSize = { xs: 12, sm: 3, md: 2 };
        } else if (field.label === 'Full Name') {
          gridSize = { xs: 12, sm: 9, md: 10 };
        } else if ([
          'Email Address', 'Phone Number', 'Phone Number (WhatsApp)', 
          'Designation', 'Department', 'Institute / Hospital', 'Institution/Hospital',
          'Institution / Hospital', 'Medical Council Name', 'Food Preference'
        ].includes(field.label)) {
          gridSize = { xs: 12, sm: 6, md: 6 };
        }

        return (
          <Grid item {...gridSize} key={field.id}>
            {/* TEXT & TEXTAREA & NUMBER & EMAIL & PHONE & DATE */}
            {['text', 'textarea', 'number', 'email', 'phone', 'date'].includes(field.field_type) && (
              <TextField
                fullWidth
                label={field.label}
                required={field.is_required}
                placeholder={field.placeholder || ''}
                helperText={error || field.help_text || ''}
                error={!!error}
                type={
                  field.field_type === 'number' ? 'number' :
                  field.field_type === 'email' ? 'email' :
                  field.field_type === 'phone' ? 'tel' :
                  field.field_type === 'date' ? 'date' : 'text'
                }
                multiline={field.field_type === 'textarea'}
                rows={field.field_type === 'textarea' ? 4 : 1}
                value={value}
                InputLabelProps={field.field_type === 'date' ? { shrink: true } : undefined}
                onChange={(e) => handleInputChange(fieldId, e.target.value)}
              />
            )}

            {/* DROPDOWN SELECT */}
            {field.field_type === 'dropdown' && (
              <FormControl fullWidth error={!!error} required={field.is_required}>
                <InputLabel id={`label-${field.id}`}>{field.label}</InputLabel>
                <Select
                  labelId={`label-${field.id}`}
                  value={value}
                  label={field.label}
                  onChange={(e) => handleInputChange(fieldId, e.target.value)}
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {(field.options || []).map((opt) => {
                    const { value: optValue, label: optLabel } = getOptionInfo(opt);
                    return (
                      <MenuItem key={optValue} value={optValue}>{optLabel}</MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{error || field.help_text || ''}</FormHelperText>
              </FormControl>
            )}

            {/* RADIO BUTTONS */}
            {field.field_type === 'radio' && (
              <FormControl component="fieldset" error={!!error} required={field.is_required} fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5, color: '#0f172a', fontFamily: "'Raleway', sans-serif" }}>
                  {field.label}
                </FormLabel>
                <Box display="flex" flexDirection="column" gap={1.5} width="100%">
                  {(field.options || []).map((opt) => {
                    const { value: optValue, label: optLabel } = getOptionInfo(opt);
                    const isSelected = String(value) === String(optValue);
                    return (
                      <Box
                        key={optValue}
                        onClick={() => handleInputChange(fieldId, optValue)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '12px',
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'rgba(226, 232, 240, 0.8)',
                          bgcolor: isSelected ? 'rgba(13, 148, 136, 0.03)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(13, 148, 136, 0.01)'
                          }
                        }}
                      >
                        <Radio 
                          checked={isSelected}
                          color="primary"
                          sx={{ p: 0, mr: 1.5 }}
                        />
                        <Typography variant="body1" fontWeight={isSelected ? 700 : 500} color="text.primary">
                          {optLabel}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                <FormHelperText>{error || field.help_text || ''}</FormHelperText>
              </FormControl>
            )}

            {/* CHECKBOX LIST */}
            {field.field_type === 'checkbox' && (
              <FormControl component="fieldset" error={!!error} required={field.is_required} fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5, color: '#0f172a', fontFamily: "'Raleway', sans-serif" }}>
                  {field.label}
                </FormLabel>
                <Box display="flex" flexDirection="column" gap={1.5} width="100%">
                  {(field.options || []).map((opt) => {
                    const { value: optValue, label: optLabel } = getOptionInfo(opt);
                    const isChecked = Array.isArray(value) && value.includes(optValue);
                    return (
                      <Box
                        key={optValue}
                        onClick={() => handleCheckboxChange(fieldId, optValue, !isChecked)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: '12px',
                          border: '2px solid',
                          borderColor: isChecked ? 'primary.main' : 'rgba(226, 232, 240, 0.8)',
                          bgcolor: isChecked ? 'rgba(13, 148, 136, 0.03)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'rgba(13, 148, 136, 0.01)'
                          }
                        }}
                      >
                        <Checkbox
                          checked={isChecked}
                          color="primary"
                          sx={{ p: 0, mr: 1.5 }}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleCheckboxChange(fieldId, optValue, e.target.checked)}
                        />
                        <Typography variant="body1" fontWeight={isChecked ? 700 : 500} color="text.primary">
                          {optLabel}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                <FormHelperText>{error || field.help_text || ''}</FormHelperText>
              </FormControl>
            )}

            {/* FILE UPLOAD */}
            {field.field_type === 'file' && (
              <FormControl component="fieldset" error={!!error} required={field.is_required} fullWidth>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1.5, color: '#0f172a', fontFamily: "'Raleway', sans-serif" }}>
                  {field.label}
                </FormLabel>
                <Box 
                  sx={{ 
                    border: '2px dashed',
                    borderColor: error ? 'error.main' : 'rgba(203, 213, 225, 0.8)',
                    borderRadius: '16px',
                    p: 3.5,
                    textAlign: 'center',
                    bgcolor: '#f8fafc',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: '#f1f5f9'
                    }
                  }}
                >
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    color="secondary"
                    sx={{ borderRadius: '10px', px: 3, py: 1, textTransform: 'none', fontWeight: 'bold' }}
                  >
                    Select File
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          onFileChange(fieldId, e.target.files[0]);
                        }
                      }}
                    />
                  </Button>
                  
                  {files[fieldId] ? (
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={2} sx={{ bgcolor: 'rgba(13, 148, 136, 0.05)', p: 1.5, borderRadius: '8px', border: '1px solid rgba(13, 148, 136, 0.15)', maxWidth: '400px', mx: 'auto' }}>
                      <InsertDriveFileIcon color="secondary" fontSize="small" />
                      <Typography variant="body2" color="textPrimary" noWrap sx={{ fontWeight: 'bold' }}>
                        {files[fieldId].name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ({(files[fieldId].size / (1024 * 1024)).toFixed(2)} MB)
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1.5 }}>
                      Upload PDF, JPG or PNG. Max size 5MB.
                    </Typography>
                  )}
                </Box>
                <FormHelperText error={!!error}>{error || field.help_text || ''}</FormHelperText>
              </FormControl>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DynamicFormRenderer;

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
      let label = opt.value;
      if (opt.price !== undefined && opt.price !== null) {
        label = `${opt.value} (${currency} ${parseFloat(opt.price).toFixed(2)})`;
      }
      return {
        value: opt.value,
        label: label
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
          'Email Address', 'Phone Number (WhatsApp)', 
          'Designation', 'Department', 'Institute / Hospital', 
          'Medical Council Name', 'Food Preference'
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
              <FormControl component="fieldset" error={!!error} required={field.is_required}>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: '#334155' }}>
                  {field.label}
                </FormLabel>
                <RadioGroup
                  row
                  value={value}
                  onChange={(e) => handleInputChange(fieldId, e.target.value)}
                >
                  {(field.options || []).map((opt) => {
                    const { value: optValue, label: optLabel } = getOptionInfo(opt);
                    return (
                      <FormControlLabel 
                        key={optValue} 
                        value={optValue} 
                        control={<Radio color="primary" />} 
                        label={optLabel} 
                      />
                    );
                  })}
                </RadioGroup>
                <FormHelperText>{error || field.help_text || ''}</FormHelperText>
              </FormControl>
            )}

            {/* CHECKBOX LIST */}
            {field.field_type === 'checkbox' && (
              <FormControl component="fieldset" error={!!error} required={field.is_required}>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: '#334155' }}>
                  {field.label}
                </FormLabel>
                <FormGroup row>
                  {(field.options || []).map((opt) => {
                    const { value: optValue, label: optLabel } = getOptionInfo(opt);
                    const isChecked = Array.isArray(value) && value.includes(optValue);
                    return (
                      <FormControlLabel
                        key={optValue}
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={(e) => handleCheckboxChange(fieldId, optValue, e.target.checked)}
                            color="primary"
                          />
                        }
                        label={optLabel}
                      />
                    );
                  })}
                </FormGroup>
                <FormHelperText>{error || field.help_text || ''}</FormHelperText>
              </FormControl>
            )}

            {/* FILE UPLOAD */}
            {field.field_type === 'file' && (
              <FormControl component="fieldset" error={!!error} required={field.is_required}>
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1, color: '#334155' }}>
                  {field.label}
                </FormLabel>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    color={error ? 'error' : 'secondary'}
                    sx={{ borderRadius: '8px' }}
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
                  
                  {files[fieldId] && (
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ bgcolor: '#f1f5f9', px: 1.5, py: 0.75, borderRadius: '8px' }}>
                      <InsertDriveFileIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="textPrimary" noWrap sx={{ maxWidth: '200px' }}>
                        {files[fieldId].name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        ({(files[fieldId].size / (1024 * 1024)).toFixed(2)} MB)
                      </Typography>
                    </Box>
                  )}
                </Box>
                <FormHelperText error={!!error}>{error || field.help_text || 'Upload PDF, JPG or PNG. Max size 5MB.'}</FormHelperText>
              </FormControl>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DynamicFormRenderer;

import React from 'react';
import { Card } from '@mui/material';
import { glassmorphismStyles } from '../theme';

const GlassCard = ({ children, sx = {}, ...props }) => {
  return (
    <Card sx={{ ...glassmorphismStyles, ...sx }} {...props}>
      {children}
    </Card>
  );
};

export default GlassCard;

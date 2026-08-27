import React from 'react';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface InlinePanelProps {
  open: boolean;
  icon: React.ReactNode;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const InlinePanel: React.FC<InlinePanelProps> = ({ open, icon, title, onClose, children }) => (
  <Collapse in={open} unmountOnExit timeout="auto">
    <Box sx={{ mb: 2, p: 2, border: 1, borderColor: 'primary.main', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
      {children}
    </Box>
  </Collapse>
);

export default InlinePanel;

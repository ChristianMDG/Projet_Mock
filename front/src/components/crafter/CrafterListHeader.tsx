import React from 'react';
import { Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add as AddIcon } from '@mui/icons-material';

import { ButtonTx } from '@/components/ui';
import Labels from '@/labelKeys.json';

interface CrafterListHeaderProps {
  t: (key: string) => string;
  onCreateCrafter: () => void;
}

const CrafterListHeader: React.FC<CrafterListHeaderProps> = ({ t, onCreateCrafter }) => (
  <Grid container spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
    <Grid size="grow">
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {t(Labels.ui_label_vehicles)}
      </Typography>
    </Grid>
    <Grid size="auto">
      <ButtonTx variant="contained" color="primary" startIcon={<AddIcon />} onClick={onCreateCrafter} size="large">
        {t(Labels.button_create)}
      </ButtonTx>
    </Grid>
  </Grid>
);

export default CrafterListHeader;

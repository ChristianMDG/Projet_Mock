import React from 'react';
import { Box, Typography } from '@mui/material';
import ButtonTx from '@/components/ui/ButtonTx';
import AddIcon from '@mui/icons-material/Add';
import Labels from '@/labelKeys.json';

interface OperatorListHeaderProps {
  t: (key: string) => string;
  onCreateOperator: () => void;
}

const OperatorListHeader: React.FC<OperatorListHeaderProps> = ({ t, onCreateOperator }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'center' },
      gap: { xs: 2, sm: 0 },
      mb: 1,
    }}
  >
    <Typography variant="h4">{t(Labels.operator_list_title)}</Typography>
    <ButtonTx variant="contained" color="primary" startIcon={<AddIcon />} onClick={onCreateOperator} size="small">
      {t(Labels.operator_list_new_button)}
    </ButtonTx>
  </Box>
);

export default OperatorListHeader;

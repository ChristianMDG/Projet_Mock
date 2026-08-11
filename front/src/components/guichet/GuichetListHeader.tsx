import React from 'react';
import { Box, Typography } from '@mui/material';
import { ButtonTx } from '@/components/ui';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Labels from '@/labelKeys.json';

interface GuichetListHeaderProps {
  t: (key: string) => string;
  onCreateGuichet: () => void;
  onCreateOperator: () => void;
}

const GuichetListHeader: React.FC<GuichetListHeaderProps> = ({ t, onCreateGuichet, onCreateOperator }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Typography variant="h4">{t(Labels.guichet_list_title)}</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
        }}
      >
        <ButtonTx
          variant="outlined"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={onCreateOperator}
          size="small"
          sx={{
            borderStyle: 'dashed',
            '&:hover': {
              borderStyle: 'solid',
              backgroundColor: 'action.hover',
            },
          }}
        >
          {t(Labels.guichet_list_new_operator_button)}
        </ButtonTx>
        <ButtonTx variant="contained" color="primary" startIcon={<AddIcon />} onClick={onCreateGuichet}>
          {t(Labels.guichet_list_new_button)}
        </ButtonTx>
      </Box>
    </Box>
  );
};

export default GuichetListHeader;

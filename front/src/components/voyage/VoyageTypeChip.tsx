import React from 'react';
import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { VoyageTypeEnum, VoyageTypeLabels } from '@/models/enums';

interface VoyageTypeChipProps {
  type?: VoyageTypeEnum;
  size?: 'small' | 'medium';
}

const VoyageTypeChip: React.FC<VoyageTypeChipProps> = ({ type, size = 'small' }) => {
  const { t } = useTranslation();

  if (type) {
    return (
      <Chip
        label={t(VoyageTypeLabels[type])}
        color="primary"
        variant="outlined"
        size={size}
        sx={{
          border: theme => `2px solid ${theme.palette.primary.main}10`,
          backgroundColor: theme => `${theme.palette.primary.main}08`,
        }}
      />
    );
  }
  return <></>;
};

export default VoyageTypeChip;

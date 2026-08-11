import React from 'react';
import { Alert, Box, Card, Typography } from '@mui/material';
import { Crafter } from '@/types';
import Labels from '@/labelKeys.json';
import { CrafterCardsList, CrafterSkeletonList } from '@/components/crafter';

interface CrafterListContentProps {
  crafters: Crafter[];
  isLoading: boolean;
  error: Error | null;
  isDeleting: boolean;
  t: (key: string) => string;
  onEdit: (crafter: Crafter) => void;
  onDelete: (crafter: Crafter) => void;
}

const CrafterListContent: React.FC<CrafterListContentProps> = ({
  crafters,
  isLoading,
  error,
  isDeleting,
  t,
  onEdit,
  onDelete,
}) => {
  if (error) {
    return (
      <Box sx={{ p: 0.5 }}>
        <Alert severity="error">{t(Labels.crafter_list_error_loading)}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <CrafterSkeletonList />;
  }

  if (crafters.length === 0) {
    return (
      <Card sx={{ p: 1.5, textAlign: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          {t(Labels.crafter_list_no_crafters)}
        </Typography>
      </Card>
    );
  }

  return <CrafterCardsList crafters={crafters} isDeleting={isDeleting} t={t} onEdit={onEdit} onDelete={onDelete} />;
};

export default CrafterListContent;

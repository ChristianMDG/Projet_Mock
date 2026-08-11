import React from 'react';
import { Alert, Box, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VoyageListSkeleton from '@/skeleton/VoyageListSkeleton';
import Labels from '@/labelKeys.json';
import { useUserPreviousVoyages } from '@/hooks/voyage.hooks';
import { VoyageCard } from '../voyage';

export const AccountPreviousVoyagesList: React.FC<{ voyageurId?: number }> = ({ voyageurId }) => {
  const { t } = useTranslation();
  const { data: voyages, isLoading, error } = useUserPreviousVoyages(voyageurId ?? 0);
  if (isLoading) {
    return <VoyageListSkeleton count={3} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message}
      </Alert>
    );
  }

  if (!voyages || voyages.length === 0) {
    return (
      <Box component={Paper} elevation={1} sx={{ borderRadius: 2, mb: 3, p: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
          }}
        >
          {t(Labels.voyage_search_no_results)}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {voyages?.map(voyage => (
        <VoyageCard key={voyage.id} voyage={voyage} />
      ))}
    </>
  );
};

export default AccountPreviousVoyagesList;

import React, { useEffect, useRef } from 'react';
import { Alert, Box, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import VoyageListSkeleton from '@/skeleton/VoyageListSkeleton';
import Labels from '@/labelKeys.json';
import { useUserPreviousVoyages } from '@/hooks/voyage.hooks';
import { VoyageCard } from '../voyage';

export const AccountPreviousVoyagesList: React.FC<{ voyageurId?: number }> = ({ voyageurId }) => {
  const { t } = useTranslation();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useUserPreviousVoyages(
    voyageurId ?? 0,
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel && hasNextPage && !isFetchingNextPage) {
      const observer = new IntersectionObserver(
        entries => {
          if (entries[0]?.isIntersecting) {
            fetchNextPage();
          }
        },
        { rootMargin: '200px' },
      );
      observer.observe(sentinel);
      return () => observer.disconnect();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  const voyages = data?.pages.flatMap(page => page.content ?? []).filter(Boolean) ?? [];

  if (voyages.length === 0) {
    return (
      <Box component={Paper} elevation={1} sx={{ borderRadius: 2, mb: 3, p: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
          }}
        >
          {t(Labels.voyage_list_no_voyages)}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {voyages.map(voyage => (
        <VoyageCard key={voyage.id} voyage={voyage} />
      ))}
      <Box ref={sentinelRef} sx={{ minHeight: 8 }}>
        {isFetchingNextPage && <VoyageListSkeleton count={1} />}
      </Box>
    </Stack>
  );
};

export default AccountPreviousVoyagesList;

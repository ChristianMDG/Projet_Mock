import { useDynamicPages } from '@/hooks/dynamic-page.hooks';
import { Alert, Box, Grid, Typography } from '@mui/material';
import DynamicPageCard from '@/components/section/DynamicPageCard';
import { DynamicPageListSkeleton } from '@/skeleton';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { useEffect, useState } from 'react';
import SEO from '@/components/shared/SEO';

const ListDynamicPage = () => {
  const { data, isLoading, error } = useDynamicPages();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Box sx={{ py: 1 }}>
      <SEO title={t(Labels.pages_informatives_title)} />
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', my: 2, fontWeight: 'bold', color: 'primary.main' }}
      >
        {t(Labels.pages_informatives_title)}
      </Typography>

      <Typography variant="h6" sx={{ textAlign: 'center', mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
        {t(Labels.pages_informatives_description)}
      </Typography>

      {mounted && isLoading && !data ? (
        <DynamicPageListSkeleton />
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
            {t(Labels.error_pages_load_failed)}
          </Alert>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {(data?.data ?? []).map(page => (
            <Grid key={page.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <DynamicPageCard page={page} t={t} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ListDynamicPage;

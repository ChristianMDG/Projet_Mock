import { Alert, Box, Card, CardActionArea, Chip, Grid, Stack, Typography } from '@mui/material';
import { KoperativeVerifiedIcon } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import type { KoperativeWeeklySummary } from '@/types/type.util';

interface KoperativeWeeklyGridProps {
  summaries: KoperativeWeeklySummary[];
  selectedDate: string;
  onKoperativeClick?: (koperativeId: number) => void;
}

export const KoperativeWeeklyGrid = ({ summaries, selectedDate, onKoperativeClick }: KoperativeWeeklyGridProps) => {
  const { t, i18n } = useTranslation();

  return Boolean(summaries?.length) ? (
    <Box sx={{ my: 4 }}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
          }}
        >
          {t(Labels.voyage_weekly_no_results_title, { date: selectedDate })}
        </Typography>
        <Typography variant="body2">{t(Labels.voyage_weekly_no_results_subtitle)}</Typography>
      </Alert>

      <Grid container spacing={2}>
        {summaries.map(({ id, name, status, minPrice, voyageCount, classes }) => (
          <Grid key={id} size={{ xs: 6, sm: 4, md: 3 }}>
            <Card variant="outlined" sx={{ '&:hover': { borderColor: 'primary.main', boxShadow: 2 } }}>
              <CardActionArea onClick={() => onKoperativeClick?.(id)} sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      flex: 1,
                      fontWeight: 700,
                    }}
                  >
                    {name}
                  </Typography>
                  <KoperativeVerifiedIcon status={status} fontSize="small" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {t(Labels.voyage_weekly_voyages_count, { count: voyageCount })}, {t(Labels.voyage_weekly_from_price)}
                </Typography>
                <Typography
                  variant="h6"
                  color="primary.main"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {minPrice.toLocaleString(i18n.language)} AR
                </Typography>
                {classes && classes.length > 0 && (
                  <Stack direction="row" spacing={0.5} sx={{ mt: 1, flexWrap: 'wrap', gap: 0.5 }}>
                    {classes.map(cls => (
                      <Chip key={cls} label={cls} size="small" variant="outlined" color="secondary" />
                    ))}
                  </Stack>
                )}
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ) : (
    <></>
  );
};

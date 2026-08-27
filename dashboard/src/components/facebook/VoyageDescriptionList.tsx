import { Box, CircularProgress, Alert, Grid, Card, Typography, Button, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { VoyageDescriptionDto } from '@/types/facebook.types';

interface VoyageDescriptionListProps {
  descriptions: VoyageDescriptionDto[];
  loading: boolean;
  onSchedule: (desc: VoyageDescriptionDto) => void;
}

export default function VoyageDescriptionList({
  descriptions,
  loading,
  onSchedule,
}: Readonly<VoyageDescriptionListProps>) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (descriptions.length === 0) {
    return <Alert severity="info">{t(Labels.facebook_no_data)}</Alert>;
  }

  return (
    <Grid container spacing={3}>
      {descriptions.map((desc) => {
        return (
          <Grid size={{ xs: 12 }} key={`${desc.koperativeId}-${desc.gareId}-${desc.departureDate}`}>
            <Card sx={{ p: 3, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" color="primary">
                    {desc.koperativeName}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {desc.departureVille} &rarr; {desc.arrivalVille}
                  </Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {desc.departureTimes.split(',').map((time) => {
                      const trimmedTime = time.trim();
                      return <Chip key={trimmedTime} label={trimmedTime} size="small" variant="outlined" />;
                    })}
                  </Box>
                </Box>
                <Button variant="contained" color="primary" onClick={() => onSchedule(desc)}>
                  {t(Labels.facebook_schedule_button)}
                </Button>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                }}
              >
                {desc.description}
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

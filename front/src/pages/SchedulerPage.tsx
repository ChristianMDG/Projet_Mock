import React from 'react';
import { Alert, Box, Card, CardContent, Container, Grid, LinearProgress, Typography } from '@mui/material';
import {
  Assessment as StatsIcon,
  CalendarToday as CalendarIcon,
  List as ListIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useKoperative } from '@/hooks/koperative.hooks';
import { useVoyagesByKoperative } from '@/hooks/voyage.hooks';
import { VoyageCalendar } from '@/components/voyage';
import { RecurrenceTypeEnum, VoyageStatusEnum } from '@/models/enums';
import Labels from '@/labelKeys.json';
import SEO from '@/components/shared/SEO';

export const SchedulerPage: React.FC = () => {
  const { t } = useTranslation();
  const { koperativeId } = useParams<{ koperativeId: string }>();
  const koperativeIdNum = koperativeId ? Number.parseInt(koperativeId, 10) : 0;
  const { data: koperative, isLoading: koperativeLoading } = useKoperative(koperativeIdNum);
  const { data: voyages = [] } = useVoyagesByKoperative(koperativeIdNum);

  const stats = React.useMemo(() => {
    const totalVoyages = voyages.length;
    const scheduledVoyages = voyages.filter(v => v.status === VoyageStatusEnum.SCHEDULED).length;
    const recurringTemplates = voyages.filter(
      v => v.isTemplate && v.recurrenceType !== RecurrenceTypeEnum.ONE_OFF,
    ).length;
    const completedVoyages = voyages.filter(v => v.status === VoyageStatusEnum.COMPLETED).length;
    const totalRevenue = voyages
      .filter(v => v.status === VoyageStatusEnum.COMPLETED)
      .reduce((sum, v) => sum + (v.pricePerSeat ?? 0) * ((v.crafter?.seatCapacity ?? 0) - (v.availableSeats ?? 0)), 0);

    return {
      totalVoyages,
      scheduledVoyages,
      recurringTemplates,
      completedVoyages,
      totalRevenue,
    };
  }, [voyages]);

  if (koperativeLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 0 } }}>
        <Box sx={{ py: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            {t(Labels.loading)}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!koperative) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 0 } }}>
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{t(Labels.koperative_not_found)}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <SEO title={t(Labels.voyage_scheduler_title)} />
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          {t(Labels.voyage_scheduler_title)}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          {koperative.name} - {t(Labels.voyage_scheduler_subtitle)}
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {stats.totalVoyages}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.voyage_stats_total)}
                    </Typography>
                  </Box>
                  <ListIcon color="primary" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {stats.scheduledVoyages}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.voyage_stats_scheduled)}
                    </Typography>
                  </Box>
                  <ScheduleIcon color="warning" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {stats.recurringTemplates}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.voyage_stats_recurring)}
                    </Typography>
                  </Box>
                  <CalendarIcon color="info" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {(stats.totalRevenue / 1000000).toFixed(1)}M
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(Labels.voyage_stats_revenue)} (MGA)
                    </Typography>
                  </Box>
                  <StatsIcon color="success" sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <VoyageCalendar koperativeId={koperativeIdNum} />
    </Box>
  );
};

export default SchedulerPage;

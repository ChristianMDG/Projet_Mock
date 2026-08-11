import { Alert, Avatar, Box, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import { useEffect } from 'react';
import { KoperativeVerifiedIcon } from '@/components/shared';
import Labels from '@/labelKeys.json';
import VoyageJourney from '@/components/VoyageJourney';
import PricingBox from '@/components/voyage/PricingBox';
import { SeatSelectionPanel } from './SeatSelectionPanel';
import type { VoyageClasses } from '@/types/type.util';
import { useTranslation } from 'react-i18next';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import dayjs from '@/utils/dayjs';

interface VoyageResultsProps {
  voyageClasses: VoyageClasses[];
  language: string;
  selectedDate?: string;
}

export const VoyageResults = ({ voyageClasses, language, selectedDate }: VoyageResultsProps) => {
  const { t } = useTranslation();
  const { expandedVoyageId, setExpandedVoyage } = useSeatSelectionStore();

  useEffect(() => {
    const firstId = voyageClasses[0]?.voyages[0]?.id;
    if (firstId) {
      const isCurrentlyExpanded = voyageClasses.some(g => g.voyages.some(v => v.id === expandedVoyageId));
      if (isCurrentlyExpanded) return;
      setExpandedVoyage(firstId);
    }
  }, [voyageClasses]);

  if (voyageClasses.length === 0) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="info">{t(Labels.voyage_search_no_results, { date: selectedDate })}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          mb: 1,
          fontWeight: 600,
        }}
      >
        {selectedDate}
      </Typography>
      {voyageClasses.map(voyageClass => {
        return (
          <Paper
            key={`${voyageClass.koperative?.id}-${voyageClass.departureTime}-${voyageClass.departureGare?.id}`}
            sx={{ mb: 2, p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
            elevation={0}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={voyageClass.koperative?.logoUrl}
                  alt={voyageClass.koperative?.name}
                  sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '12px', fontWeight: 'bold' }}
                >
                  {(voyageClass.koperative?.name ?? '').slice(0, 2)}
                </Avatar>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontWeight: 600,
                    }}
                  >
                    {voyageClass.koperative?.name}
                    <KoperativeVerifiedIcon koperative={voyageClass.koperative} fontSize="small" />
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {voyageClass.departureGare?.name}
                  </Typography>
                </Box>
              </Box>
              <Chip
                icon={<AccessTime />}
                label={dayjs(voyageClass.departureTime).format('HH:mm')}
                color="primary"
                variant="outlined"
              />
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <VoyageJourney
                  departureTime={voyageClass.departureTime}
                  departure={voyageClass.departureGare?.ville.name ?? t(Labels.voyage_item_from)}
                  arrivalTime={voyageClass.estimatedArrivalTime ?? ''}
                  arrival={voyageClass.arrivalGare?.ville.name ?? t(Labels.voyage_item_to)}
                  duration={t(Labels.voyage_item_duration)}
                  stops=""
                  language={language}
                />
              </Grid>
              <Grid size="grow">
                <Box
                  sx={{ display: 'grid', gridTemplateColumns: `repeat(${voyageClass.voyages.length}, 1fr)`, gap: 1 }}
                >
                  {voyageClass.voyages.map(voyage => (
                    <PricingBox
                      key={voyage.id}
                      type={voyage.classe?.name ?? 'Standard'}
                      price={voyage.pricePerSeat?.toLocaleString(language) ?? '0'}
                      voyageId={voyage.id ?? 0}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            {voyageClass.voyages.length > 1 && <Divider sx={{ mt: 2 }} />}
            {voyageClass.voyages.map(voyage => (
              <SeatSelectionPanel key={voyage.id} voyage={voyage} />
            ))}
          </Paper>
        );
      })}
    </>
  );
};

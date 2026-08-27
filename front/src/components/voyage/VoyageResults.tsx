import { Alert, Avatar, Box, Chip, Divider, Grid, Paper, Typography, alpha } from '@mui/material';
import AccessTime from '@mui/icons-material/AccessTime';
import { useEffect } from 'react';
import KoperativeVerifiedIcon from '@/components/shared/KoperativeVerifiedIcon';
import Labels from '@/labelKeys.json';
import VoyageJourney from '@/components/VoyageJourney';
import PricingBox from '@/components/voyage/PricingBox';
import { SeatSelectionPanel } from '@/components';
import type { VoyageClasses } from '@/types/type.util';
import { useTranslation } from 'react-i18next';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { useVoyageSearchStore } from '@/stores/voyage-search.store';
import dayjs from '@/utils/dayjs';
import { DepartureTimeGroupEnum, getTimeFilters, VoyageTypeLabels } from '@/models/enums';

interface VoyageResultsProps {
  voyageClasses: VoyageClasses[];
  language: string;
  selectedDate?: string;
  availableTimeGroups?: DepartureTimeGroupEnum[];
}

export const VoyageResults = ({
  voyageClasses,
  language,
  selectedDate,
  availableTimeGroups = [],
}: VoyageResultsProps) => {
  const { t } = useTranslation();
  const { expandedVoyageId, setExpandedVoyage } = useSeatSelectionStore();

  const departureTimeGroup = useVoyageSearchStore(state => state.departureTimeGroup);
  const setDepartureTimeGroup = useVoyageSearchStore(state => state.setDepartureTimeGroup);

  useEffect(() => {
    const firstVoyage = voyageClasses[0]?.voyages[0];
    if (firstVoyage?.id) {
      const isCurrentlyExpanded = voyageClasses.some(g => g.voyages.some(v => v.id === expandedVoyageId));
      if (!isCurrentlyExpanded) {
        setExpandedVoyage(firstVoyage.id, firstVoyage.classe?.name ?? 'standard');
      }
    }
  }, [voyageClasses, expandedVoyageId, setExpandedVoyage]);

  const timeFilters = getTimeFilters(t);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
          }}
        >
          {selectedDate}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {availableTimeGroups.map(timeGroup => {
            const isSelected = departureTimeGroup === timeGroup;
            const timeFilter = timeFilters.find(f => f.value === timeGroup);
            return (
              <Chip
                key={timeGroup}
                label={timeFilter?.label}
                icon={timeFilter?.icon}
                onClick={() => setDepartureTimeGroup(departureTimeGroup === timeGroup ? null : timeGroup)}
                sx={theme => ({
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '0.875rem',
                  borderRadius: '100px',
                  border: '2px solid',
                  borderColor: isSelected ? 'primary.main' : theme.palette.divider,
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isSelected ? 'primary.main' : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isSelected ? 'primary.dark' : theme.palette.action.hover,
                  },
                  '& .MuiChip-icon': {
                    color: isSelected ? 'primary.contrastText' : 'inherit',
                  },
                })}
              />
            );
          })}
        </Box>
      </Box>

      {voyageClasses.length === 0 ? (
        <Box sx={{ my: 4 }}>
          <Alert severity="info">{t(Labels.voyage_search_no_results, { date: selectedDate })}</Alert>
        </Box>
      ) : (
        voyageClasses.map(voyageClass => {
          return (
            <Paper
              key={`${voyageClass.koperative?.id}-${voyageClass.departureTime}-${voyageClass.departureGare?.id}`}
              sx={{ mb: 2, p: 2, borderRadius: 6, border: '1px solid', borderColor: 'divider' }}
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
                  sx={theme => ({
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  })}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <VoyageJourney
                    departureTime={voyageClass.departureTime}
                    departure={voyageClass.departureGare?.ville.name ?? t(Labels.voyage_item_from)}
                    arrivalTime={voyageClass.estimatedArrivalTime ?? ''}
                    arrival={voyageClass.arrivalGare?.ville.name ?? t(Labels.voyage_item_to)}
                    duration={
                      voyageClass.voyages[0]?.typeVoyage
                        ? t(VoyageTypeLabels[voyageClass.voyages[0].typeVoyage])
                        : t(Labels.voyage_item_duration)
                    }
                    stops=""
                    language={language}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{ display: 'grid', gridTemplateColumns: `repeat(${voyageClass.voyages.length}, 1fr)`, gap: 1 }}
                  >
                    {voyageClass.voyages.map(voyage => (
                      <PricingBox
                        key={voyage.id}
                        type={voyage.classe?.name ?? 'standard'}
                        price={voyage.pricePerSeat?.toLocaleString(language) ?? '0'}
                        voyageId={voyage.id ?? 0}
                        availableSeats={voyage.availableSeats}
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
        })
      )}
    </>
  );
};

import { Alert, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { VoyageItemSkeleton } from '@/skeleton/VoyageItemSkeleton';
import type { Dayjs } from 'dayjs';
import Labels from '@/labelKeys.json';
import { KoperativeWeeklyGrid } from './KoperativeWeeklyGrid';
import { VoyageResults } from './VoyageResults';
import VoyageMonthlyCalendar from './VoyageMonthlyCalendar';
import { KoperativeWeeklySummary, VoyageClasses } from '@/types/type.util';
import { Ville } from '@/models/Ville';
import { DepartureTimeGroupEnum } from '@/models/enums';

interface VoyageWeeklyResultsProps {
  loading?: boolean;
  hasWeeklySummaries: boolean;
  koperativeSummaries: KoperativeWeeklySummary[];
  voyageClasses: VoyageClasses[];
  formattedDate: string;
  language: string;
  koperativeId: number | null;
  passengers: number;
  fromVille: Ville | null;
  toVille: Ville | null;
  onKoperativeClick: (koperativeId: number) => void;
  onDaySelect: (date: Dayjs) => void;
  availableTimeGroups?: DepartureTimeGroupEnum[];
  hasVoyagesOnSelectedDate?: boolean;
}

export const VoyageWeeklyResults = ({
  loading = false,
  hasWeeklySummaries,
  koperativeSummaries,
  voyageClasses,
  formattedDate,
  language,
  koperativeId,
  passengers,
  fromVille,
  toVille,
  onKoperativeClick,
  onDaySelect,
  availableTimeGroups = [],
  hasVoyagesOnSelectedDate = false,
}: VoyageWeeklyResultsProps) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Box sx={{ mt: 2, width: '100%' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          {formattedDate}
        </Typography>
        {Array.from({ length: 3 }, (_, i) => (
          <VoyageItemSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (voyageClasses.length === 0 && hasWeeklySummaries) {
    return (
      <KoperativeWeeklyGrid
        summaries={koperativeSummaries}
        onKoperativeClick={onKoperativeClick}
        selectedDate={formattedDate}
      />
    );
  }

  if (hasVoyagesOnSelectedDate) {
    return (
      <VoyageResults
        voyageClasses={voyageClasses}
        language={language}
        selectedDate={formattedDate}
        availableTimeGroups={availableTimeGroups}
      />
    );
  }

  return (
    <Box sx={{ mt: 2, width: '100%' }}>
      <Alert severity="info">
        <Typography variant="body2">
          {t(Labels.voyage_search_no_results, { date: formattedDate })} — {t(Labels.voyage_no_results_check_calendar)}
        </Typography>
      </Alert>
      {fromVille?.id && toVille?.id && (
        <Box sx={{ mt: 2, width: '100%' }}>
          <VoyageMonthlyCalendar
            departureVilleId={fromVille.id}
            arrivalVilleId={toVille.id}
            koperativeId={koperativeId ?? undefined}
            passengers={passengers}
            onDaySelect={onDaySelect}
          />
        </Box>
      )}
    </Box>
  );
};

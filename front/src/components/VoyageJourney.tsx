import React from 'react';
import { Box, Typography } from '@mui/material';
import { TaxibrousseRedIcon } from './ui';
import { voyageDateUtils } from '@/utils/dayjs';

interface VoyageJourneyProps {
  departureTime: string;
  departure: string;
  arrivalTime: string;
  arrival: string;
  duration: string;
  stops: string;
  language?: string;
}

const VoyageJourney: React.FC<VoyageJourneyProps> = ({
  departureTime,
  departure,
  arrivalTime,
  arrival,
  duration,
  stops,
  language = 'fr',
}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    {/* Departure */}
    <Box sx={{ textAlign: 'left' }}>
      <Typography variant="caption" color="text.secondary">
        {voyageDateUtils.formatWithLocale(departureTime, 'ddd DD MMM', language)}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        {departure}
      </Typography>
    </Box>

    {/* Journey Line with Icon */}
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', mx: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
        {duration}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
        <Box sx={{ flex: 1, height: 2, bgcolor: 'divider', borderRadius: 1 }} />
        <TaxibrousseRedIcon sx={{ mx: 1, fontSize: 18 }} />
        <Box sx={{ flex: 1, height: 2, bgcolor: 'divider', borderRadius: 1 }} />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
        {stops}
      </Typography>
    </Box>

    {/* Arrival */}
    <Box sx={{ textAlign: 'right' }}>
      <Typography variant="caption" color="text.secondary">
        {voyageDateUtils.formatWithLocale(arrivalTime, 'ddd DD MMM', language)}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
        }}
      >
        {arrival}
      </Typography>
    </Box>
  </Box>
);

export default VoyageJourney;

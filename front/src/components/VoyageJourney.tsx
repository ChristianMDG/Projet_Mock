import React from 'react';
import { Box, Typography } from '@mui/material';
import TaxibrousseRedIcon from '@/components/ui/TaxibrousseRedIcon';
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
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: { xs: 1, xm: 2 },
    }}
  >
    {/* Departure */}
    <Box sx={{ textAlign: 'left' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.65rem', xm: '0.75rem' },
        }}
      >
        {voyageDateUtils.formatWithLocale(departureTime, 'ddd DD MMM', language)}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '0.9rem', xm: '1rem' },
        }}
      >
        {departure}
      </Typography>
    </Box>

    {/* Journey Line with Icon */}
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mx: { xs: 0.5, xm: 1 },
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          mb: 0.5,
          fontSize: { xs: '0.65rem', xm: '0.75rem' },
        }}
      >
        {duration}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', width: 1 }}>
        <Box sx={{ flex: 1, height: 2, bgcolor: 'divider', borderRadius: 1 }} />
        <TaxibrousseRedIcon
          sx={{
            mx: { xs: 0.5, xm: 1 },
            fontSize: { xs: 14, xm: 18 },
          }}
        />
        <Box sx={{ flex: 1, height: 2, bgcolor: 'divider', borderRadius: 1 }} />
      </Box>

      {stops && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            mt: 0.5,
            fontSize: { xs: '0.65rem', xm: '0.75rem' },
          }}
        >
          {stops}
        </Typography>
      )}
    </Box>

    {/* Arrival */}
    <Box sx={{ textAlign: 'right' }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontSize: { xs: '0.65rem', xm: '0.75rem' },
        }}
      >
        {voyageDateUtils.formatWithLocale(arrivalTime, 'ddd DD MMM', language)}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: { xs: '0.9rem', xm: '1rem' },
        }}
      >
        {arrival}
      </Typography>
    </Box>
  </Box>
);

export default VoyageJourney;

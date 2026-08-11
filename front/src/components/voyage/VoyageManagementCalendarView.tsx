import React from 'react';
import { Alert, Box, Card, CardContent, Typography } from '@mui/material';
import { CalendarMonth as CalendarIcon, Construction as ConstructionIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Voyage } from '@/models/Voyage';

interface VoyageManagementCalendarViewProps {
  voyages: Voyage[];
  isLoading: boolean;
  onVoyageEdit: (voyage: Voyage) => void;
  onVoyageView: (voyage: Voyage) => void;
  onVoyageDelete: (voyage: Voyage) => void;
  selectedVoyageIds: number[];
  onVoyageSelect: (voyageId: number) => void;
}

export const VoyageManagementCalendarView: React.FC<VoyageManagementCalendarViewProps> = ({
  voyages,
  isLoading: _isLoading,
  onVoyageEdit: _onVoyageEdit,
  onVoyageView: _onVoyageView,
  onVoyageDelete: _onVoyageDelete,
  selectedVoyageIds: _selectedVoyageIds,
  onVoyageSelect: _onVoyageSelect,
}) => {
  const { t } = useTranslation();

  // Placeholder implementation - in a real application, you would integrate
  // with a calendar library like @mui/x-date-pickers or react-big-calendar
  return (
    <Box>
      <Alert severity="info" icon={<ConstructionIcon />} sx={{ mb: 3 }}>
        <Typography variant="body2">
          {t(Labels.travel_hotel_coming_soon)}: Calendar view is under development. Please use Table or Card view for
          now.
        </Typography>
      </Alert>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
              textAlign: 'center',
            }}
          >
            <CalendarIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {t(Labels.voyage_tab_calendar)}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Calendar view for voyage management will be available soon.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(Labels.voyage_management_total_results).replace('{total}', voyages.length.toString())}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VoyageManagementCalendarView;

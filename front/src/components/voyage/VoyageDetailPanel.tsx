import React from 'react';
import { Box, Button, Grid, Tab, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EastIcon from '@mui/icons-material/East';
import EditIcon from '@mui/icons-material/Edit';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RouteIcon from '@mui/icons-material/Route';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useTranslation } from 'react-i18next';
import StyledIcon from '@/components/ui/StyledIcon';
import { ReservationList } from '@/components/reservation';
import ProtectedTx from '@/components/ProtectedTx';
import { SeatBooking } from '@/components/seats';
import ColisList from '@/components/colis/ColisList';
import Labels from '@/labelKeys.json';
import { Colis, Ville, Voyage } from '@/types';
import { SeatConfig } from '@/types/type.props';

export type VoyageDetailSubTab = 'reservation' | 'colis';

interface VoyageDetailPanelProps {
  selectedVoyage: Voyage | null;
  selectedSubTab: VoyageDetailSubTab;
  onSubTabChange: (event: React.SyntheticEvent, newTab: VoyageDetailSubTab) => void;
  currentVille: Ville | null;
  destinationVille: Ville | null;
  canEditVoyage: boolean;
  onEditVoyage: () => void;
  onDeleteVoyage: () => void;
  onAddColis: () => void;
  onEditColis: (colis: Colis) => void;
  onViewColis: (colis: Colis) => void;
  scheduleSuccess?: boolean;
}

const handleBookingComplete = (_seatConfigs: SeatConfig[]) => {};

const VoyageDetailPanel: React.FC<VoyageDetailPanelProps> = ({
  selectedVoyage,
  selectedSubTab,
  onSubTabChange,
  currentVille,
  destinationVille,
  canEditVoyage,
  onEditVoyage,
  onDeleteVoyage,
  onAddColis,
  onEditColis,
  onViewColis,
  scheduleSuccess = false,
}) => {
  const { t } = useTranslation();
  const hasSelectedVoyage = Boolean(selectedVoyage);
  const isReservationTab = selectedSubTab === 'reservation';
  const isColisTab = selectedSubTab === 'colis';
  const showScheduleSuccess = !hasSelectedVoyage && scheduleSuccess;
  const showEmptyHint = !hasSelectedVoyage && !scheduleSuccess;

  return (
    <Grid container spacing={2}>
      <Grid
        size={12}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {hasSelectedVoyage && (
          <TabContext value={String(selectedSubTab)}>
            <TabList onChange={(event, value) => onSubTabChange(event, value as VoyageDetailSubTab)}>
              <Tab
                icon={<StyledIcon icon={RouteIcon} />}
                iconPosition="start"
                label={
                  <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {currentVille?.name}
                    </Typography>
                    <EastIcon color="primary" />
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {destinationVille?.name}
                    </Typography>
                  </Box>
                }
                value="reservation"
                sx={{ minWidth: 120, minHeight: 48, ml: 0.5 }}
              />
              <Tab
                icon={<Inventory2Icon />}
                iconPosition="start"
                label="Colis"
                value="colis"
                sx={{ minWidth: 120, minHeight: 48 }}
              />
            </TabList>
          </TabContext>
        )}
      </Grid>

      {isReservationTab && hasSelectedVoyage && selectedVoyage && (
        <Grid size={12} container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
            <SeatBooking
              voyage={selectedVoyage}
              multiSelect={true}
              showAdvancedControls={true}
              enableBookingFlow={true}
              maxSeatsPerBooking={22}
              onBookingComplete={handleBookingComplete}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
            <ProtectedTx>
              <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={onEditVoyage}
                  disabled={!canEditVoyage}
                  startIcon={<EditIcon />}
                >
                  {t(Labels.button_edit_voyage)}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={onDeleteVoyage}
                  disabled
                  startIcon={<DeleteIcon />}
                >
                  {t(Labels.button_delete_voyage)}
                </Button>
              </Box>
              <ReservationList voyageId={selectedVoyage.id} />
            </ProtectedTx>
          </Grid>
        </Grid>
      )}

      {isReservationTab && showScheduleSuccess && (
        <Grid size={12}>
          <Typography variant="body2" color="success" sx={{ mt: 1, textAlign: 'center', fontWeight: 600 }}>
            {t(Labels.voyage_schedule_submit)}
          </Typography>
        </Grid>
      )}

      {isReservationTab && showEmptyHint && (
        <Grid size={12}>
          <Typography variant="body2" color="grey.600" sx={{ mt: 1, textAlign: 'center' }}>
            {t(Labels.voyage_no_data_hint)}
          </Typography>
        </Grid>
      )}

      {isColisTab && (
        <Grid size={12}>
          {hasSelectedVoyage && selectedVoyage && (
            <ColisList
              handleAddColis={onAddColis}
              voyageId={selectedVoyage.id!}
              handleEditColis={onEditColis}
              handleViewColis={onViewColis}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default VoyageDetailPanel;

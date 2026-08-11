import React, { useMemo, useState, useEffect } from 'react';
import {
  Autocomplete,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ButtonTx } from '@/components/ui';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Ville } from '@/models/Ville';
import { useVilles } from '@/hooks/ville.hooks';
import { useUpdateKoperativeVilles } from '@/hooks/koperative.hooks';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';

interface VilleDialogProps {
  open: boolean;
  onClose: () => void;
  koperativeId: number;
  koperativeVilles: Ville[];
}

const VilleDialog: React.FC<VilleDialogProps> = ({ open, onClose, koperativeId, koperativeVilles }) => {
  const [selectedVillesToAdd, setSelectedVillesToAdd] = useState<Ville[]>([]);
  const [mounted, setMounted] = useState(false);
  const { data: allVilles = [], isLoading: villesLoading } = useVilles();
  const updateVillesMutation = useUpdateKoperativeVilles();
  const { t } = useTranslation();
  const fullScreenQuery = useMediaQuery(theme => theme.breakpoints.down('md'), {
    defaultMatches: false,
    noSsr: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const availableVilles = useMemo(
    () => allVilles.filter(ville => !koperativeVilles.some(kv => kv.id === ville.id)),
    [allVilles, koperativeVilles],
  );

  const formatVilleInfo = (ville: Ville): string => {
    const parts = [];
    if (ville.code) parts.push(ville.code);
    if (ville.province) parts.push(ville.province);
    if (ville.region) parts.push(ville.region);
    return parts.join(' • ');
  };

  const handleAddVilles = async () => {
    if (selectedVillesToAdd.length === 0) return;

    try {
      const updatedVilles = [...koperativeVilles, ...selectedVillesToAdd];
      await updateVillesMutation.mutateAsync({
        id: koperativeId,
        villes: updatedVilles,
      });
      setSelectedVillesToAdd([]);
      onClose();
    } catch (error) {
      console.error('Error adding villes:', error);
    }
  };

  const handleClose = () => {
    setSelectedVillesToAdd([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={mounted ? fullScreenQuery : false} fullWidth maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationCityIcon color="primary" />
          <Typography variant="h5" component="span">
            {t(Labels.button_add_ville)}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              multiple
              options={availableVilles}
              getOptionLabel={option => `${option.name} (${option.code})`}
              value={selectedVillesToAdd}
              onChange={(_, newValue) => setSelectedVillesToAdd(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              getOptionDisabled={option => selectedVillesToAdd.some(v => v.id === option.id)}
              renderOption={(props, option) => (
                <Box {...props} component="li" key={option.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <LocationCityIcon color={option.isActive ? 'success' : 'error'} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatVilleInfo(option)}
                      </Typography>
                    </Box>
                    <Chip
                      label={option.isActive ? t(Labels.ui_status_active) : t(Labels.ui_status_inactive)}
                      size="small"
                      color={option.isActive ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              )}
              renderValue={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option.id}
                    label={option.name}
                    icon={<LocationCityIcon />}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              renderInput={params => (
                <TextField
                  {...params}
                  label={t(Labels.ui_city_select)}
                  placeholder={t(Labels.ui_city_search_placeholder)}
                  helperText={`${selectedVillesToAdd.length} ${t(Labels.ui_city_selected_count)}`}
                />
              )}
              noOptionsText={t(Labels.ui_city_no_available)}
              loading={villesLoading}
            />
          </Box>
          {koperativeVilles.length > 0 && (
            <Box>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                <LocationCityIcon color="success" />
                {t(Labels.ui_city_current_list)} ({koperativeVilles.length} {t(Labels.ui_city_current_count)})
              </Typography>
              <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
                {koperativeVilles.map((ville, index) => (
                  <React.Fragment key={ville.id}>
                    <ListItem>
                      <ListItemIcon>
                        <LocationCityIcon color={ville.isActive ? 'success' : 'error'} />
                      </ListItemIcon>
                      <ListItemText primary={ville.name} secondary={formatVilleInfo(ville)} />
                      <Chip
                        label={ville.isActive ? t(Labels.ui_status_active) : t(Labels.ui_status_inactive)}
                        size="small"
                        color={ville.isActive ? 'success' : 'error'}
                        variant="outlined"
                      />
                    </ListItem>
                    {index < koperativeVilles.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {koperativeVilles.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 2, mt: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {t(Labels.ui_city_no_current)}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: theme => `1.5px solid ${theme.palette.divider}`,
          padding: theme => theme.spacing(2),
        }}
      >
        <ButtonTx onClick={handleClose} startIcon={<CancelIcon />}>
          {t(Labels.ui_button_close)}
        </ButtonTx>
        <ButtonTx
          onClick={handleAddVilles}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={selectedVillesToAdd.length === 0 || updateVillesMutation.isPending}
        >
          {t(Labels.button_add_ville)}
          {selectedVillesToAdd.length > 0 && ` (${selectedVillesToAdd.length})`}
        </ButtonTx>
      </DialogActions>
    </Dialog>
  );
};

export default VilleDialog;

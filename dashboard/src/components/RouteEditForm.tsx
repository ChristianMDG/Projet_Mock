import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import type { Route } from '../api/route.api';
import Labels from '@/labelKeys.json';

interface Props {
  open: boolean;
  route?: Route | null;
  onClose: () => void;
  onSave: (data: Partial<Route>) => Promise<void>;
}

export default function RouteEditForm({ open, route, onClose, onSave }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState<Partial<Route>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (route) {
      setForm({
        id: route.id,
        name: route.name ?? '',
        fraisTaxibrousse: route.fraisTaxibrousse ?? 0,
        fraisKoperative: route.fraisKoperative ?? 0,
        estimatedDurationHours: route.estimatedDurationHours ?? 0,
        distanceKm: route.distanceKm ?? 0,
        description: route.description ?? '',
        isActive: route.isActive ?? true,
      });
    } else {
      setForm({});
    }
    setError(null);
  }, [route]);

  const handleChange = (key: keyof Route, value: any) => {
    setForm((s) => ({ ...s, [key]: value }));
  };

  const handleSubmit = async () => {
    if (form.id && !error) {
      setSaving(true);
      try {
        await onSave(form);
        onClose();
      } catch (e) {
        // swallow - parent handles notification
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{ pb: 1, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        {t(Labels.route_edit_title)}
        <IconButton size="small" onClick={onClose} edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          {/* Section: General Info */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ mb: 1, fontWeight: 700, textTransform: 'uppercase' }}
              >
                {t(Labels.route_edit_general)}
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!form.isActive}
                    onChange={(e) => handleChange('isActive', e.target.checked)}
                    color="primary"
                  />
                }
                label={form.isActive ? t(Labels.route_edit_status_active) : t(Labels.route_edit_status_inactive)}
              />
            </Box>
          </Grid>
          <Grid size={12}>
            <TextField
              label={t(Labels.route_edit_name)}
              value={form.name ?? ''}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label={t(Labels.route_edit_desc)}
              value={form.description ?? ''}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth
              multiline
              minRows={2}
              variant="outlined"
            />
          </Grid>

          {/* Section: Pricing & Logistics */}
          <Grid size={12} sx={{ mt: 1 }}>
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 700, textTransform: 'uppercase' }}>
              {t(Labels.route_edit_pricing)}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t(Labels.route_edit_price_base)}
              type="number"
              value={form.fraisTaxibrousse ?? ''}
              onChange={(e) => handleChange('fraisTaxibrousse', Number(e.target.value))}
              fullWidth
              placeholder="0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t(Labels.route_edit_price_kop)}
              type="number"
              value={form.fraisKoperative ?? ''}
              onChange={(e) => handleChange('fraisKoperative', Number(e.target.value))}
              fullWidth
              placeholder="0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t(Labels.route_edit_duration)}
              type="number"
              value={form.estimatedDurationHours ?? ''}
              onChange={(e) => handleChange('estimatedDurationHours', Number(e.target.value))}
              fullWidth
              placeholder="0"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t(Labels.route_edit_distance)}
              type="number"
              value={form.distanceKm ?? ''}
              onChange={(e) => handleChange('distanceKm', Number(e.target.value))}
              fullWidth
              placeholder="0"
            />
          </Grid>
          {/* Section: Locations (Read-Only) */}
          {(route?.departureGare || route?.arrivalGare) && (
            <>
              <Grid size={12} sx={{ mt: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  sx={{ mb: 1, fontWeight: 700, textTransform: 'uppercase' }}
                >
                  {t(Labels.route_edit_locations)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t(Labels.route_edit_dep_term)}
                  value={
                    route?.departureGare
                      ? `${route.departureGare.name ?? t(Labels.common_na)} ${route.departureGare.ville?.name ? `(${route.departureGare.ville.name})` : ''}`
                      : t(Labels.common_na)
                  }
                  fullWidth
                  slotProps={{ input: { readOnly: true } }}
                  variant="filled"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t(Labels.route_edit_arr_term)}
                  value={
                    route?.arrivalGare
                      ? `${route.arrivalGare.name ?? t(Labels.common_na)} ${route.arrivalGare.ville?.name ? `(${route.arrivalGare.ville.name})` : ''}`
                      : t(Labels.common_na)
                  }
                  fullWidth
                  slotProps={{ input: { readOnly: true } }}
                  variant="filled"
                  size="small"
                />
              </Grid>
            </>
          )}
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !!error} size="small" color="primary">
          {t(Labels.route_edit_save)}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

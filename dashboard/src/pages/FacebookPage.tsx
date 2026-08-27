import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Grid,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import { useTranslation } from 'react-i18next';
import dayjs, { Dayjs } from 'dayjs';
import { Facebook } from '@mui/icons-material';

import { SectionHeader } from '@/components/shared';
import VoyageDescriptionList from '@/components/facebook/VoyageDescriptionList';
import Labels from '@/labelKeys.json';
import { getAllVilles, Ville } from '@/api/ville.api';
import { getGaresByVille } from '@/api/gare.api';
import { getVoyageDescriptions, scheduleFacebookPost } from '@/api/facebook.api';
import { VoyageDescriptionDto } from '@/types/facebook.types';
import type { Gare } from '@/models';

export default function FacebookPage() {
  const { t } = useTranslation();

  // Filters state
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs().add(1, 'day'));
  const [villes, setVilles] = useState<Ville[]>([]);
  const [selectedVilleName, setSelectedVilleName] = useState<string>('ANTANANARIVO');
  const [selectedVilleId, setSelectedVilleId] = useState<number | ''>('');

  const [gares, setGares] = useState<Gare[]>([]);
  const [selectedGareId, setSelectedGareId] = useState<number | ''>(1); // Default Fasan'ny Karana generally

  // Data state
  const [descriptions, setDescriptions] = useState<VoyageDescriptionDto[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDesc, setSelectedDesc] = useState<VoyageDescriptionDto | null>(null);
  const [scheduleTime, setScheduleTime] = useState<Dayjs>(dayjs().add(2, 'hour'));
  const [hashtags, setHashtags] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load Villes and Gares on mount
  useEffect(() => {
    loadVilles();
  }, []);

  const loadVilles = async () => {
    try {
      const data = await getAllVilles();
      setVilles(data);
      const antananarivo = data.find((v) => v.name === 'ANTANANARIVO');
      if (antananarivo) {
        setSelectedVilleId(antananarivo.id);
        loadGares(antananarivo.id);
      } else if (data.length > 0) {
        setSelectedVilleId(data[0].id);
        setSelectedVilleName(data[0].name);
        loadGares(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load villes', error);
    }
  };

  const loadGares = async (villeId: number) => {
    try {
      const data = await getGaresByVille(villeId);
      setGares(data);
      if (data.length > 0 && selectedGareId === '') {
        setSelectedGareId(Number(data[0].id));
      }
    } catch (error) {
      console.error('Failed to load gares', error);
    }
  };

  const handleVilleChange = (villeId: number) => {
    setSelectedVilleId(villeId);
    const ville = villes.find((v) => v.id === villeId);
    if (ville) setSelectedVilleName(ville.name);
    setSelectedGareId('');
    loadGares(villeId);
  };

  const fetchDescriptions = async () => {
    if (selectedDate && selectedGareId !== '' && selectedVilleName) {
      setLoading(true);
      try {
        const data = await getVoyageDescriptions(
          selectedDate.format('YYYY-MM-DD'),
          Number(selectedGareId),
          selectedVilleName
        );
        setDescriptions(data);
      } catch (error) {
        console.error('Failed to fetch descriptions', error);
        alert(t(Labels.common_error));
      } finally {
        setLoading(false);
      }
    }
  };

  // Automatically fetch when filters change if all are valid
  useEffect(() => {
    if (selectedDate && selectedGareId !== '' && selectedVilleName) {
      fetchDescriptions();
    }
  }, [selectedDate, selectedGareId, selectedVilleName]);

  const openScheduleDialog = (desc: VoyageDescriptionDto) => {
    setSelectedDesc(desc);
    setScheduleTime(dayjs().add(2, 'hour'));
    setHashtags(desc.tags || '');
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleSchedule = async () => {
    if (selectedDesc && scheduleTime) {
      setSubmitting(true);
      try {
        await scheduleFacebookPost({
          voyageIds: selectedDesc.voyageIds,
          description: selectedDesc.description,
          scheduledTime: scheduleTime.format('YYYY-MM-DDTHH:mm:ss'),
          hashtags,
          image: imageFile ?? undefined,
        });
        setDialogOpen(false);
        fetchDescriptions(); // Refresh list to remove the scheduled one
      } catch (error) {
        console.error('Failed to schedule post', error);
        alert(t(Labels.facebook_schedule_error));
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <SectionHeader
          icon={<Facebook />}
          title={t(Labels.facebook_title)}
          subtitle={t(Labels.facebook_subtitle)}
          size="small"
        />
      </Box>

      <Card sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <DatePicker
              label={t(Labels.facebook_filter_date)}
              value={selectedDate}
              onChange={(newValue) => newValue && setSelectedDate(newValue)}
              format="DD/MM/YYYY"
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label={t(Labels.facebook_filter_ville)}
              value={selectedVilleId}
              onChange={(e) => handleVilleChange(Number(e.target.value))}
              fullWidth
              size="small"
            >
              {villes.map((ville) => (
                <MenuItem key={ville.id} value={ville.id}>
                  {ville.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label={t(Labels.facebook_filter_gare)}
              value={selectedGareId}
              onChange={(e) => setSelectedGareId(Number(e.target.value))}
              fullWidth
              size="small"
              disabled={gares.length === 0}
            >
              {gares.map((gare) => (
                <MenuItem key={gare.id} value={gare.id}>
                  {gare.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Card>

      <VoyageDescriptionList descriptions={descriptions} loading={loading} onSchedule={openScheduleDialog} />

      {/* Schedule Dialog */}
      <Dialog open={dialogOpen} onClose={() => !submitting && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t(Labels.facebook_schedule_title)}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <DateTimePicker
              label={t(Labels.facebook_schedule_time)}
              value={scheduleTime}
              onChange={(newValue) => newValue && setScheduleTime(newValue)}
              format="DD/MM/YYYY HH:mm"
              slotProps={{ textField: { fullWidth: true } }}
            />

            <TextField
              label={t(Labels.facebook_schedule_hashtags)}
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              fullWidth
              placeholder="#taxibrousse #ezotra"
              helperText="Des hashtags supplémentaires pour ce post"
            />

            <Button variant="outlined" component="label" fullWidth sx={{ height: 100, borderStyle: 'dashed' }}>
              {imageFile ? imageFile.name : t(Labels.facebook_schedule_image)}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                  }
                }}
              />
            </Button>

            {selectedDesc && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  fontSize: '0.8rem',
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  {t(Labels.facebook_col_preview)}
                </Typography>
                {selectedDesc.description}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
            {t(Labels.common_close)}
          </Button>
          <Button
            onClick={handleSchedule}
            variant="contained"
            color="primary"
            disabled={!scheduleTime || submitting}
            startIcon={submitting ? <CircularProgress size={20} /> : null}
          >
            {t(Labels.facebook_schedule_button)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

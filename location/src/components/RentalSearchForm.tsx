import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

export default function RentalSearchForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [agence, setAgence] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(1, 'day'));

  const handleSearch = () => {
    navigate(`/recherche?loc=${agence}&start=${startDate?.format('YYYY-MM-DD')}&end=${endDate?.format('YYYY-MM-DD')}`);
  };

  const hasAgence = Boolean(agence);

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label={t(Labels.rental_search_form_agency_label)}
            placeholder={t(Labels.rental_search_form_agency_placeholder)}
            value={agence}
            onChange={e => setAgence(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <StyledIcon icon={LocationOnIcon} color="action" />
                  </InputAdornment>
                ),
                endAdornment: hasAgence && (
                  <InputAdornment position="end">
                    <StyledIcon icon={SearchIcon} color="action" sx={{ cursor: 'pointer' }} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DatePicker
            label={t(Labels.rental_search_form_start_date)}
            format="DD/MM/YYYY"
            value={startDate}
            onChange={newValue => setStartDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DatePicker
            label={t(Labels.rental_search_form_end_date)}
            format="DD/MM/YYYY"
            value={endDate}
            onChange={newValue => setEndDate(newValue)}
            minDate={startDate ?? dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<StyledIcon icon={SearchIcon} />}
            onClick={handleSearch}
            sx={{ height: '56px', fontSize: '1.1rem' }}
          >
            {t(Labels.rental_search_form_submit)}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

import React from 'react';
import { Alert, Box, Grid, LinearProgress, TextField, Typography, InputAdornment } from '@mui/material';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import StoreIcon from '@mui/icons-material/Store';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SmsIcon from '@mui/icons-material/Sms';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ButtonTx from '@/components/ui/ButtonTx';
import { UserOperator } from '@/models/UserOperator';
import { Koperative } from '@/models/Koperative';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import GareAutocomplete from '@/components/shared/GareAutocomplete';
import { useGuichetRegistrationForm } from '@/hooks/guichet-registration.hooks';
import { useGares } from '@/hooks/gare.hooks';
import MvolaLogo from '@/assets/mvola_logo.jpeg';
import AirtelLogo from '@/assets/airtel_money_logo.jpeg';
import OrangeLogo from '@/assets/orange_money_logo.jpeg';

interface GuichetRegistrationFormProps {
  registeredUser: UserOperator;
  onSuccess: () => void;
}

const GuichetRegistrationForm: React.FC<GuichetRegistrationFormProps> = ({ registeredUser, onSuccess }) => {
  const { t } = useTranslation();
  const {
    formState,
    loading,
    error,
    koperatives,
    koperativesLoading,
    villes,
    villesLoading,
    isFormValid,
    handleKoperativeChange,
    handleVilleChange,
    handleGareChange,
    handleTextChange,
    handleSubmit,
  } = useGuichetRegistrationForm({ registeredUser, onSuccess });

  const { data: gares = [], isLoading: garesLoading } = useGares(
    { ville: formState.ville ? [formState.ville] : [] },
    false,
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
        <StoreIcon color="primary" />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {t(Labels.guichet_registration_form_title)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(Labels.guichet_registration_form_subtitle)}
          </Typography>
        </Box>
      </Box>

      <Alert severity="warning" icon={<WarningAmberIcon fontSize="inherit" />} sx={{ mb: 3, borderRadius: 2 }}>
        {t(Labels.guichet_registration_form_verification_warning)}
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

      <Box
        component="form"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <KoperativeAutocomplete
              id="guichet-reg-koperative"
              value={formState.koperative}
              onChange={val => handleKoperativeChange(val as Koperative | null)}
              label={t(Labels.guichet_registration_form_koperative_label)}
              placeholder={t(Labels.guichet_registration_form_koperative_placeholder)}
              options={koperatives}
              isLoading={koperativesLoading}
              disabled={loading || koperativesLoading}
              startIcon={BusinessIcon}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <VilleAutocomplete
              id="guichet-reg-ville"
              value={formState.ville}
              onChange={handleVilleChange}
              options={villes}
              isLoading={villesLoading}
              label={t(Labels.guichet_registration_form_ville_label)}
              placeholder={t(Labels.guichet_registration_form_ville_placeholder)}
              disabled={loading || villesLoading || !formState.koperative}
              startIcon={LocationCityIcon}
            />
          </Grid>

          {formState.ville && (
            <Grid size={{ xs: 12 }}>
              <GareAutocomplete
                id="guichet-reg-gare"
                value={formState.gare}
                onChange={handleGareChange}
                label={t(Labels.ui_guichet_gare)}
                placeholder={t(Labels.guichet_registration_form_gare_placeholder)}
                options={gares}
                isLoading={garesLoading}
                disabled={loading || garesLoading}
                startIcon={LocationOnIcon}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="guichet-reg-sms-phone"
              label={t(Labels.guichet_registration_form_sms_label)}
              value={formState.smsPhone}
              onChange={handleTextChange('smsPhone')}
              disabled={loading}
              placeholder="034 00 000 00"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SmsIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="guichet-reg-mvola"
              label={t(Labels.guichet_registration_form_mvola_label)}
              value={formState.numeroMvola}
              onChange={handleTextChange('numeroMvola')}
              disabled={loading}
              placeholder="034 00 000 00"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        component="img"
                        src={MvolaLogo}
                        alt="Mvola"
                        sx={{ width: 24, height: 24, borderRadius: 0.5, objectFit: 'cover' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="guichet-reg-airtel"
              label={t(Labels.guichet_registration_form_airtel_label)}
              value={formState.numeroAirtelMoney}
              onChange={handleTextChange('numeroAirtelMoney')}
              disabled={loading}
              placeholder="033 00 000 00"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        component="img"
                        src={AirtelLogo}
                        alt="Airtel Money"
                        sx={{ width: 24, height: 24, borderRadius: 0.5, objectFit: 'cover' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="guichet-reg-orange"
              label={t(Labels.guichet_registration_form_orange_label)}
              value={formState.numeroOrangeMoney}
              onChange={handleTextChange('numeroOrangeMoney')}
              disabled={loading}
              placeholder="032 00 000 00"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box
                        component="img"
                        src={OrangeLogo}
                        alt="Orange Money"
                        sx={{ width: 24, height: 24, borderRadius: 0.5, objectFit: 'cover' }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="guichet-reg-opening-hours"
              label={t(Labels.guichet_form_opening_hours_label)}
              value={formState.openingHours}
              onChange={handleTextChange('openingHours')}
              disabled={loading}
              multiline
              rows={3}
              placeholder={t(Labels.guichet_form_opening_hours_placeholder)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <ButtonTx
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !isFormValid}
              size="large"
              isProtected={false}
            >
              {loading ? t(Labels.button_saving) : t(Labels.button_create)}
            </ButtonTx>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default GuichetRegistrationForm;

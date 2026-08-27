import { FC } from 'react';
import { Box, Card, CardContent, CardHeader, LinearProgress, Typography } from '@mui/material';
import ButtonTx from '@/components/ui/ButtonTx';
import StyledIcon from '@/components/ui/StyledIcon';
import { KoperativeFilterProps } from '@/types/type.props';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Ville } from '@/models/Ville';
import { useKoperatives } from '@/hooks/koperative.hooks';
import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import KoperativeAutocomplete from '@/components/shared/KoperativeAutocomplete';
import { Koperative } from '@/models/Koperative';
import HydrationSafe from '@/components/shared/HydrationSafe';
import VehicleIcon from '@/components/shared/VehicleIcon';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { trackEvent } from '@/hooks/google-analytics.hook';

const KoperativeFilterForm: FC<KoperativeFilterProps> = ({
  filter,
  isLoading,
  setKoperativeFilter,
  onReset,
  onAdd,
}) => {
  const { t } = useTranslation();
  const { data: koperatives = [] } = useKoperatives();

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StyledIcon variant="secondary">
              <BusinessIcon />
            </StyledIcon>
            <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
              {t(Labels.koperative_filter_title)}
            </Typography>
          </Box>
        }
      />
      <CardContent>
        <Grid
          container
          spacing={2}
          sx={{
            alignItems: 'center',
          }}
        >
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <VilleAutocomplete
              id="koperative-filter-ville"
              multiple
              value={filter.ville ?? []}
              onChange={(value: Ville[]) => {
                trackEvent('filter_koperatives', 'Koperative', 'Filter by City');
                setKoperativeFilter({ ville: value });
              }}
              label={t(Labels.koperative_filter_by_city)}
              placeholder={t(Labels.koperative_filter_by_city)}
              startIcon={LocationOnIcon}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KoperativeAutocomplete
              id="koperative-filter-name"
              value={koperatives.find(k => k.name === filter.name) ?? null}
              onChange={value => {
                trackEvent('filter_koperatives', 'Koperative', 'Filter by Name');
                setKoperativeFilter({ name: (value as Koperative)?.name ?? '' });
              }}
              label={t(Labels.koperative_filter_by_name)}
              placeholder={t(Labels.koperative_filter_by_name)}
              startIcon={VehicleIcon}
              options={koperatives}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
              <ButtonTx
                variant="text"
                size="large"
                onClick={onReset}
                startIcon={<RefreshIcon />}
                isProtected={false}
                sx={{ flex: { xs: 1, sm: 'none' } }}
              >
                {t(Labels.button_reset)}
              </ButtonTx>
              <ButtonTx
                variant="contained"
                size="large"
                onClick={onAdd}
                startIcon={<AddIcon />}
                sx={{ flex: { xs: 1, sm: 'none' } }}
              >
                {t(Labels.koperative_filter_add_button)}
              </ButtonTx>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      <HydrationSafe>{isLoading && <LinearProgress />}</HydrationSafe>
    </Card>
  );
};

export default KoperativeFilterForm;

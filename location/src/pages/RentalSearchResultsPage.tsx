import { useVehicles } from '../hooks/vehicle.hooks';
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Drawer,
  IconButton,
  Grid,
  Chip,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import RentalVehicleCard from '../components/RentalVehicleCard';
import RentalSearchForm from '../components/RentalSearchForm';
import StyledIcon from '@/components/ui/StyledIcon';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

import RentalVehicleCardSkeleton from '../components/skeleton/RentalVehicleCardSkeleton';

const filterCategories = ['Berline', 'Citadine', 'SUV', 'SUV 4x4', 'Minibus', 'Utilitaire'];
const filterFuels = ['Essence', 'Diesel'];

function FiltersPanel({ onClose }: { onClose?: () => void }) {
  const isMobileMode = Boolean(onClose);
  const isDesktopMode = !isMobileMode;
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3, minWidth: { md: 240 } }}>
      {isMobileMode && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t(Labels.rental_search_filters)}
          </Typography>
          <IconButton size="small" onClick={onClose}>
            <StyledIcon icon={CloseIcon} />
          </IconButton>
        </Box>
      )}
      {isDesktopMode && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {t(Labels.rental_search_filter_by)}
          </Typography>
          <Button size="small" color="secondary" variant="text" sx={{ fontWeight: 600, p: 0 }}>
            {t(Labels.rental_search_clear_all)}
          </Button>
        </Box>
      )}

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {t(Labels.rental_search_types)}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        {filterCategories.map(cat => (
          <Chip key={cat} label={cat} size="small" variant="outlined" clickable sx={{ borderRadius: 2 }} />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {t(Labels.rental_search_motorization)}
      </Typography>
      <FormGroup>
        {filterFuels.map(fuel => (
          <FormControlLabel key={fuel} control={<Checkbox size="small" />} label={fuel} />
        ))}
      </FormGroup>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
        {t(Labels.rental_search_gearbox)}
      </Typography>
      <FormGroup>
        <FormControlLabel control={<Checkbox size="small" />} label={t(Labels.rental_search_auto_only)} />
      </FormGroup>
    </Box>
  );
}

export default function RentalSearchResultsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation();
  const { data: vehicles, isLoading } = useVehicles();

  return (
    <>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Search bar */}
        <Box sx={{ bgcolor: 'background.paper', py: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Container maxWidth="lg">
            <RentalSearchForm />
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
              {t(Labels.rental_search_results_title, { count: vehicles?.length || 0 })}
            </Typography>
            <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)}>
              <StyledIcon icon={FilterListIcon} />
            </IconButton>
          </Box>

          <Grid container spacing={3}>
            {/* Sidebar desktop */}
            <Grid size={{ md: 3 }} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <FiltersPanel />
              </Box>
            </Grid>

            {/* Results grid */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={3}>
                {isLoading
                  ? Array.from(new Array(4)).map((_, index) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={index}>
                        <RentalVehicleCardSkeleton />
                      </Grid>
                    ))
                  : vehicles?.map(vehicle => (
                      <Grid size={{ xs: 12, sm: 6 }} key={vehicle.id}>
                        <RentalVehicleCard {...vehicle} />
                      </Grid>
                    ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <FiltersPanel onClose={() => setMobileOpen(false)} />
      </Drawer>
    </>
  );
}

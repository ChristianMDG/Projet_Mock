import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonTx, IconButtonTx } from '@/components/ui';
import { VilleDialog } from '@/components/shared';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Ville } from '@/models/Ville';
import { useKoperativeVilles, useUpdateKoperativeVilles } from '@/hooks/koperative.hooks';
import Labels from '@/labelKeys.json';
import { useTranslation } from 'react-i18next';
import ProtectedTx from '@/components/ProtectedTx';

interface VilleListProps {
  koperativeId: number;
}

const VilleList: React.FC<VilleListProps> = ({ koperativeId }) => {
  const [state, setState] = useState({
    filterText: '',
    isAddDialogOpen: false,
    error: '',
  });
  const { data: koperativeVilles = [], isLoading: koperativeVillesLoading } = useKoperativeVilles(koperativeId);
  const updateVillesMutation = useUpdateKoperativeVilles();
  const { t } = useTranslation();

  // Filter villes by search text
  const filteredKoperativeVilles = useMemo(() => {
    if (!state.filterText.trim()) return koperativeVilles;
    return koperativeVilles.filter(
      ville =>
        (ville.name?.toLowerCase().includes(state.filterText.toLowerCase()) ?? false) ||
        (ville.region?.toLowerCase().includes(state.filterText.toLowerCase()) ?? false) ||
        (ville.province?.toLowerCase().includes(state.filterText.toLowerCase()) ?? false) ||
        (ville.code?.toLowerCase().includes(state.filterText.toLowerCase()) ?? false),
    );
  }, [koperativeVilles, state.filterText]);

  const handleRemoveVille = (villeToRemove: Ville) => {
    const updatedVilles = koperativeVilles.filter(v => v.id !== villeToRemove.id);
    updateVillesMutation.mutate({ id: koperativeId, villes: updatedVilles });
  };

  const handleOpenAddDialog = () => {
    setState(prev => ({ ...prev, isAddDialogOpen: true, error: '' }));
  };

  const handleCloseAddDialog = () => {
    setState(prev => ({ ...prev, isAddDialogOpen: false }));
  };

  const getVilleStatusColor = (ville: Ville) => {
    return ville.isActive ? 'success' : 'error';
  };

  const formatVilleInfo = (ville: Ville) => {
    const parts = [];
    if (ville.region) parts.push(ville.region);
    if (ville.province) parts.push(ville.province);
    return parts.join(' • ');
  };

  if (koperativeVillesLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>{t(Labels.loading)}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 1.5,
        }}
      >
        <Typography variant="h4">{t(Labels.ui_label_city)}</Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            alignItems: 'center',
          }}
        >
          <TextField
            size="small"
            placeholder={t(Labels.filters)}
            value={state.filterText}
            onChange={e => setState(prev => ({ ...prev, filterText: e.target.value }))}
            sx={{ minWidth: { xs: '100%', sm: 200 } }}
          />
          <ButtonTx
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            {t(Labels.button_create)}
          </ButtonTx>
        </Box>
      </Box>

      {/* Error Alert */}
      {state.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setState(prev => ({ ...prev, error: '' }))}>
          {state.error}
        </Alert>
      )}

      {/* Statistics */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          {/* Responsive Statistics */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2,
            }}
          >
            {/* Villes totales */}
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
                p: 2,
                boxShadow: 'none',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h4"
                color="primary.main"
                component="div"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {koperativeVilles.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t(Labels.ui_label_city)}
              </Typography>
            </Card>
            {/* Actives */}
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
                p: 2,
                boxShadow: 'none',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h4"
                color="success.main"
                component="div"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {koperativeVilles.filter(v => v.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t(Labels.ui_status_active)}
              </Typography>
            </Card>
            {/* Inactives */}
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
                p: 2,
                boxShadow: 'none',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h4"
                color="error.main"
                component="div"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {koperativeVilles.filter(v => !v.isActive).length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t(Labels.ui_status_inactive)}
              </Typography>
            </Card>
            {/* Provinces */}
            <Card
              variant="outlined"
              sx={{
                textAlign: 'center',
                p: 2,
                boxShadow: 'none',
                bgcolor: 'background.paper',
              }}
            >
              <Typography
                variant="h4"
                color="info.main"
                component="div"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                {new Set(koperativeVilles.map(v => v.province)).size}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t(Labels.ui_label_province)}
              </Typography>
            </Card>
          </Box>
        </CardContent>
      </Card>

      {/* Villes List */}
      <Card>
        <CardContent sx={{ padding: { xs: 0, sm: 2 } }}>
          {filteredKoperativeVilles.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LocationCityIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {koperativeVilles.length === 0 ? t(Labels.ui_city_no_associated) : t(Labels.ui_city_no_found)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {koperativeVilles.length === 0 ? t(Labels.ui_city_add_to_define_zones) : t(Labels.ui_city_no_matches)}
              </Typography>
            </Box>
          ) : (
            <List sx={{ padding: { xs: 0, sm: 2 }, pt: 0 }}>
              {filteredKoperativeVilles.map((ville, index) => (
                <React.Fragment key={ville.id}>
                  <ListItem
                    sx={{
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    secondaryAction={
                      <IconButtonTx
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveVille(ville)}
                        color="error"
                        disabled={updateVillesMutation.isPending}
                      >
                        <DeleteIcon />
                      </IconButtonTx>
                    }
                  >
                    <ListItemIcon>
                      <LocationCityIcon color={getVilleStatusColor(ville)} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle1" component="span">
                            {ville.name}
                          </Typography>
                          {ville.code && <Chip label={ville.code} size="small" variant="outlined" color="primary" />}
                          <Chip
                            label={ville.isActive ? t(Labels.ui_status_active) : t(Labels.ui_status_inactive)}
                            size="small"
                            color={getVilleStatusColor(ville)}
                            variant="filled"
                          />
                        </Box>
                      }
                      secondary={formatVilleInfo(ville)}
                    />
                  </ListItem>
                  {index < filteredKoperativeVilles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Add Villes Dialog */}
      <ProtectedTx>
        <VilleDialog
          open={state.isAddDialogOpen}
          onClose={handleCloseAddDialog}
          koperativeId={koperativeId}
          koperativeVilles={koperativeVilles}
        />
      </ProtectedTx>
    </Box>
  );
};

export default VilleList;

import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  InputAdornment,
  SwipeableDrawer,
  TextField,
  Typography,
} from '@mui/material';
import ButtonTx from '@/components/ui/ButtonTx';
import IconButtonTx from '@/components/ui/IconButtonTx';
import ProtectedTx from '@/components/ProtectedTx';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import WarningIcon from '@mui/icons-material/Warning';
import React, { useState } from 'react';
import { Chauffeur } from '@/types';
import ChauffeurForm from './ChauffeurForm';
import { useChauffeursByKoperative, useDeleteChauffeur } from '@/hooks/chauffeur.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import CloseIcon from '@mui/icons-material/Close';
import { AuthorityEnum } from '@/models/enums';

interface ChauffeurListProps {
  koperativeId: number;
}

const ChauffeurList: React.FC<ChauffeurListProps> = ({ koperativeId }) => {
  // --- STATE ---
  const [modals, setModals] = useState({
    chauffeurForm: { open: false, mode: 'create' as 'create' | 'edit' },
    deleteDialog: { open: false },
  });

  const [selectedItems, setSelectedItems] = useState({
    chauffeur: null as Chauffeur | null,
    chauffeurToDelete: null as Chauffeur | null,
  });

  const [searchQuery, setSearchQuery] = useState('');

  const { t } = useTranslation();

  // --- HOOKS ---
  const { data: chauffeurs = [], isLoading } = useChauffeursByKoperative(koperativeId);
  const deleteChauffeur = useDeleteChauffeur(koperativeId);
  const queryClient = useQueryClient();

  // --- FILTER CHAUFFEURS ---
  const filteredChauffeurs = chauffeurs.filter(chauffeur => {
    const searchLower = searchQuery.toLowerCase();
    const firstName = chauffeur.user?.firstName?.toLowerCase() ?? '';
    const lastName = chauffeur.user?.lastName?.toLowerCase() ?? '';
    const phone = chauffeur.user?.phone?.toLowerCase() ?? '';

    return firstName.includes(searchLower) || lastName.includes(searchLower) || phone.includes(searchLower);
  });

  // --- HANDLERS ---
  const handleAddNew = () => {
    setSelectedItems(prev => ({ ...prev, chauffeur: null }));
    setModals(prev => ({
      ...prev,
      chauffeurForm: { open: true, mode: 'create' },
    }));
  };

  const handleEdit = (chauffeur: Chauffeur) => {
    setSelectedItems(prev => ({ ...prev, chauffeur }));
    setModals(prev => ({
      ...prev,
      chauffeurForm: { open: true, mode: 'edit' },
    }));
  };

  const handleDeleteClick = (chauffeur: Chauffeur) => {
    setSelectedItems(prev => ({ ...prev, chauffeurToDelete: chauffeur }));
    setModals(prev => ({
      ...prev,
      deleteDialog: { open: true },
    }));
  };

  const handleDeleteConfirm = async () => {
    if (selectedItems.chauffeurToDelete?.id) {
      try {
        await deleteChauffeur.mutateAsync(selectedItems.chauffeurToDelete.id);
        setModals(prev => ({
          ...prev,
          deleteDialog: { open: false },
        }));
        setSelectedItems(prev => ({ ...prev, chauffeurToDelete: null }));
      } catch (error) {
        console.error('Error deleting chauffeur:', error);
      }
    }
  };

  const handleDeleteCancel = () => {
    setModals(prev => ({
      ...prev,
      deleteDialog: { open: false },
    }));
    setSelectedItems(prev => ({ ...prev, chauffeurToDelete: null }));
  };

  const handleFormClose = async () => {
    setModals(prev => ({
      ...prev,
      chauffeurForm: { open: false, mode: 'create' },
    }));
    setSelectedItems(prev => ({ ...prev, chauffeur: null }));
    await queryClient.invalidateQueries({ queryKey: ['chauffeurs', 'koperative', koperativeId] });
  };

  const getInitials = (firstName: string = '', lastName: string = '') => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>
          {t(Labels.chauffeur_list_loading)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Grid
        container
        spacing={2}
        sx={{
          mb: 2,
          alignItems: 'center',
        }}
      >
        <Grid size={{ xs: 12, sm: 'grow' }}>
          <Typography variant="h4">{t(Labels.chauffeur_list_title)}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 'auto' }}>
          <ButtonTx
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            {t(Labels.chauffeur_list_new_button)}
          </ButtonTx>
        </Grid>
      </Grid>
      {/* Search Section */}
      <TextField
        fullWidth
        placeholder={t(Labels.chauffeur_list_search_placeholder)}
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        size="small"
        sx={{ mb: 3 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      {filteredChauffeurs.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <SportsMotorsportsIcon color="disabled" sx={{ fontSize: { xs: 64, sm: 80 }, mb: 2 }} />
            <Typography color="text.secondary" variant="h6" gutterBottom>
              {searchQuery ? t(Labels.chauffeur_list_no_results) : t(Labels.chauffeur_list_no_chauffeurs)}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {searchQuery
                ? t(Labels.chauffeur_list_no_results_description)
                : t(Labels.chauffeur_list_no_chauffeurs_description)}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {filteredChauffeurs.map(chauffeur => (
            <Grid size={{ xs: 12 }} key={chauffeur.id}>
              <Card>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      alignItems: 'center',
                    }}
                  >
                    {/* Avatar and Info Section */}
                    <Grid size={{ xs: 12, sm: 'grow' }}>
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          alignItems: 'center',
                        }}
                      >
                        <Grid size="auto">
                          <Avatar
                            src={chauffeur.photo?.url}
                            alt={`${chauffeur.user?.firstName} ${chauffeur.user?.lastName}`}
                            sx={{
                              width: { xs: 56, sm: 64 },
                              height: { xs: 56, sm: 64 },
                              fontSize: '1.25rem',
                            }}
                          >
                            {getInitials(chauffeur.user?.firstName, chauffeur.user?.lastName)}
                          </Avatar>
                        </Grid>
                        <Grid size="grow">
                          <Typography variant="h6" gutterBottom>
                            {`${chauffeur.user?.firstName ?? ''} ${chauffeur.user?.lastName ?? ''}`.trim()}
                          </Typography>

                          {/* Contact and License Info */}
                          <Grid
                            container
                            spacing={1}
                            sx={{
                              mb: 1,
                              alignItems: 'center',
                            }}
                          >
                            {chauffeur.user?.phone && (
                              <ProtectedTx allowedRoles={[AuthorityEnum.ADMIN, AuthorityEnum.OPERATOR]}>
                                <Grid size="auto">
                                  <Grid
                                    container
                                    spacing={0.5}
                                    sx={{
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Grid size="auto">
                                      <PhoneIcon
                                        color="action"
                                        sx={{
                                          fontSize: 'small',
                                        }}
                                      />
                                    </Grid>
                                    <Grid size="auto">
                                      <Typography variant="body2" color="text.secondary">
                                        {chauffeur.user.phone}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </ProtectedTx>
                            )}
                            {chauffeur.licenseNumber && (
                              <Grid size="auto">
                                <Grid
                                  container
                                  spacing={0.5}
                                  sx={{
                                    alignItems: 'center',
                                  }}
                                >
                                  <Grid size="auto">
                                    <SportsMotorsportsIcon
                                      color="action"
                                      sx={{
                                        fontSize: 'small',
                                      }}
                                    />
                                  </Grid>
                                  <Grid size="auto">
                                    <Typography variant="body2" color="text.secondary">
                                      {chauffeur.licenseNumber}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Grid>
                            )}
                          </Grid>

                          {/* Status Chip */}
                          <Chip
                            label={
                              chauffeur.isAvailable
                                ? t(Labels.chauffeur_status_available)
                                : t(Labels.chauffeur_status_unavailable)
                            }
                            color={chauffeur.isAvailable ? 'success' : 'error'}
                            size="small"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Actions Section */}
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <ProtectedTx>
                        <Grid
                          container
                          spacing={1}
                          sx={{
                            justifyContent: { xs: 'stretch', sm: 'flex-end' },
                          }}
                        >
                          <Grid size={{ xs: 6, sm: 'auto' }}>
                            <ButtonTx
                              color="primary"
                              variant="outlined"
                              onClick={() => handleEdit(chauffeur)}
                              aria-label={t(Labels.button_modify)}
                              fullWidth
                              startIcon={<EditIcon />}
                            >
                              {t(Labels.button_modify)}
                            </ButtonTx>
                          </Grid>
                          <Grid size={{ xs: 6, sm: 'auto' }}>
                            <ButtonTx
                              color="error"
                              variant="outlined"
                              onClick={() => handleDeleteClick(chauffeur)}
                              aria-label={t(Labels.button_delete)}
                              disabled={deleteChauffeur.isPending}
                              fullWidth
                              startIcon={<DeleteIcon />}
                            >
                              {t(Labels.button_delete)}
                            </ButtonTx>
                          </Grid>
                        </Grid>
                      </ProtectedTx>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Chauffeur Form */}
      <ChauffeurForm
        open={modals.chauffeurForm.open}
        onClose={handleFormClose}
        koperativeId={koperativeId}
        initialData={selectedItems.chauffeur ?? undefined}
        mode={modals.chauffeurForm.mode}
      />
      <SwipeableDrawer
        anchor="bottom"
        open={modals.deleteDialog.open}
        onClose={handleDeleteCancel}
        onOpen={() => {}}
        disableSwipeToOpen={true}
        slotProps={{
          paper: {
            sx: {
              borderTopLeftRadius: { xs: 16, sm: 8 },
              borderTopRightRadius: { xs: 16, sm: 8 },
              maxHeight: { xs: '80vh', sm: '60vh' },
              mx: { xs: 0, sm: 'auto' },
              maxWidth: { sm: 500 },
            },
          },
        }}
      >
        <Card elevation={0}>
          <CardHeader
            avatar={<WarningIcon color="error" />}
            action={
              <IconButtonTx onClick={handleDeleteCancel} size="small" aria-label="cancel">
                <CloseIcon />
              </IconButtonTx>
            }
            title={
              <Typography variant="h6" color="error">
                {t(Labels.delete_confirmation_title)}
              </Typography>
            }
          />
          <CardContent>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              {t(Labels.delete_confirmation_message).replace(
                '{name}',
                `${selectedItems.chauffeurToDelete?.user?.firstName ?? ''} ${selectedItems.chauffeurToDelete?.user?.lastName ?? ''}`.trim(),
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <ButtonTx onClick={handleDeleteCancel} variant="outlined" fullWidth>
              {t(Labels.button_cancel)}
            </ButtonTx>
            <ButtonTx
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={deleteChauffeur.isPending}
              fullWidth
            >
              {deleteChauffeur.isPending ? t(Labels.button_deleting) : t(Labels.button_delete)}
            </ButtonTx>
          </CardActions>
        </Card>
      </SwipeableDrawer>
    </Box>
  );
};

export default ChauffeurList;

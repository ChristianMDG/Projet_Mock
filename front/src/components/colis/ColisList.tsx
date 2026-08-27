import React from 'react';
import Edit from '@mui/icons-material/Edit';
import List from '@mui/icons-material/List';
import Search from '@mui/icons-material/Search';
import Inventory2 from '@mui/icons-material/Inventory2';
import Delete from '@mui/icons-material/Delete';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Box,
  Typography,
  CircularProgress,
  InputAdornment,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useColisByVoyage, useDeleteColis, useFilteredColis } from '@/hooks/colis.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { Colis } from '@/types';

interface ColisListProps {
  handleAddColis: () => void;
  voyageId: number;
  handleEditColis: (colis: Colis) => void;
  handleViewColis: (colis: Colis) => void;
}

const ColisList: React.FC<ColisListProps> = ({ handleAddColis, voyageId, handleEditColis, handleViewColis }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = React.useState('');
  const { data: voyageColis = [], isLoading: voyageColisLoading } = useColisByVoyage(voyageId);
  const { data: searchedColis = [], isLoading: searchedColisLoading } = useFilteredColis({
    ...(searchTerm.trim() ? { voyageId, search: searchTerm.trim() } : {}),
  });
  const deleteMutation = useDeleteColis();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [colisToDelete, setColisToDelete] = React.useState<Colis | null>(null);
  const hasSearchTerm = Boolean(searchTerm.trim());
  const colis = hasSearchTerm ? searchedColis : voyageColis;
  const isLoading = hasSearchTerm ? searchedColisLoading : voyageColisLoading;
  const undeliveredColis = colis.filter(item => item.status !== 'DELIVERED');

  const handleDeleteClick = (colis: Colis) => {
    setColisToDelete(colis);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (colisToDelete?.id) {
      deleteMutation.mutate(colisToDelete.id);
    }
    setDeleteDialogOpen(false);
    setColisToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setColisToDelete(null);
  };

  const getStatusColor = (statut: string): 'success' | 'warning' | 'info' | 'default' => {
    switch (statut) {
      case 'LOADED':
        return 'success';
      case 'REGISTERED':
        return 'warning';
      case 'DELIVERED':
        return 'info';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (undeliveredColis.length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {t(colis.length > 0 ? Labels.colis_list_no_undelivered_colis : Labels.colis_list_no_colis)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
          {t(
            colis.length > 0
              ? Labels.colis_list_no_undelivered_colis_description
              : Labels.colis_list_no_colis_description,
          )}
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Inventory2 />} onClick={handleAddColis} sx={{ mt: 2 }}>
          {t(Labels.colis_list_add_button)}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        placeholder={t(Labels.search_colis_placeholder)}
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
        fullWidth
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {t(Labels.colis_list_total)}: <strong>{undeliveredColis.length}</strong>
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Inventory2 />} onClick={handleAddColis}>
          {t(Labels.colis_list_add_button)}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {undeliveredColis.map((item: Colis) => (
          <Card key={item.id} sx={{ '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.3s' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {item.senderName} -&gt; {item.recipientName}
                    </Typography>
                    <Chip label={item.status} color={getStatusColor(item.status ?? '')} size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontWeight: 'medium',
                  }}
                >
                  {item.weight} kg
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    {t(Labels.colis_form_sender_info)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'medium',
                    }}
                  >
                    {item.senderName} ({item.senderPhone})
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    {t(Labels.colis_form_recipient_info)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'medium',
                    }}
                  >
                    {item.recipientName} ({item.recipientPhone})
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditColis(item)}
                  startIcon={<Edit />}
                  size="small"
                >
                  {t(Labels.colis_list_edit_button)}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<List />}
                  onClick={() => handleViewColis(item)}
                  size="small"
                >
                  {t(Labels.colis_list_details_button)}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteClick(item)}
                  size="small"
                >
                  {t(Labels.colis_list_delete_button)}
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>{t(Labels.colis_delete_confirm_title)}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(Labels.colis_delete_confirm_message)} <strong>{colisToDelete?.senderName}</strong> →{' '}
            <strong>{colisToDelete?.recipientName}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            {t(Labels.button_cancel)}
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            {t(Labels.button_confirm)}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ColisList;

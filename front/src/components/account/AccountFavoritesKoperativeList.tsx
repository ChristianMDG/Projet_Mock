import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import ListItemButton from '@mui/material/ListItemButton';
import EditIcon from '@mui/icons-material/Edit';
import IconButtonTx from '@/components/ui/IconButtonTx';
import { useKoperativesByVoyageurId } from '@/hooks/koperative.hooks';
import { Koperative, Ville } from '@/types';
import { useTranslation } from 'react-i18next';
import { generateRoute } from '@/constants/routes';

import Labels from '@/labelKeys.json';

interface AccountFavoritesKoperativeListProps {
  voyageurId?: number;
  onEdit?: (koperative: Koperative) => void;
  selectedId?: number;
  showEditButton?: boolean;
}

const AccountFavoritesKoperativeList: React.FC<AccountFavoritesKoperativeListProps> = ({
  voyageurId,
  onEdit,
  selectedId,
  showEditButton = false,
}) => {
  const { data: koperatives } = useKoperativesByVoyageurId(voyageurId ?? 0);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleSelectKoperative = (k: Koperative) => {
    if (k.slug) {
      navigate(generateRoute.koperativeDetail(k.slug, i18n.language));
    }
  };

  const handleEditOpen = (k: Koperative) => {
    if (onEdit) {
      onEdit(k);
    }
  };

  function formatVilles(villes?: Ville[]): string {
    return Array.isArray(villes) && villes.length > 0 ? villes.map(v => v.name).join(', ') : 'Aucune ville associée';
  }

  if (!koperatives || koperatives.length === 0) {
    return (
      <Box component={Paper} elevation={1} sx={{ mb: 3, p: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            textAlign: 'center',
          }}
        >
          {t(Labels.koperative_search_no_results)}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component={Paper} elevation={1} sx={{ mb: 3 }}>
      <List sx={{ pt: 0, pb: 0, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
        {koperatives.map((k: Koperative, idx) => (
          <React.Fragment key={k.id}>
            <ListItem
              key={k.id}
              secondaryAction={
                showEditButton && onEdit ? (
                  <IconButtonTx edge="end" aria-label="edit" onClick={() => handleEditOpen(k)}>
                    <EditIcon />
                  </IconButtonTx>
                ) : null
              }
              disablePadding
            >
              <ListItemButton selected={selectedId === k.id} onClick={() => handleSelectKoperative(k)}>
                <Grid container sx={{ width: 1, display: 'flex', alignItems: 'center' }} spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {k.logoUrl && (
                        <Box
                          component="img"
                          src={k.logoUrl}
                          alt={k.name}
                          sx={{
                            width: 48,
                            height: 48,
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: 1,
                            bgcolor: 'grey.100',
                          }}
                        />
                      )}
                      <ListItemText
                        color="text.primary"
                        primary={
                          <Typography
                            variant="h4"
                            color="text.primary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                          >
                            {k.name?.toUpperCase()}
                          </Typography>
                        }
                        secondary={k.description}
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography component="h5">{formatVilles(k.villes)}</Typography>
                  </Grid>
                </Grid>
              </ListItemButton>
            </ListItem>
            {idx < koperatives.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default AccountFavoritesKoperativeList;

import React from 'react';
import { Box, Card, CardActionArea, CardContent, Chip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';

import ButtonTx from '@/components/ui/ButtonTx';
import { Crafter } from '@/types';
import Labels from '@/labelKeys.json';
import CrafterPng from '@/assets/Crafter.png';

interface CrafterCardProps {
  crafter: Crafter;
  isDeleting: boolean;
  t: (key: string) => string;
  onEdit: (crafter: Crafter) => void;
  onDelete: (crafter: Crafter) => void;
}

const CrafterCard: React.FC<CrafterCardProps> = ({ crafter, onEdit, onDelete, isDeleting, t }) => (
  <Card sx={{ my: 2, position: 'relative' }}>
    <CardActionArea onClick={() => onEdit(crafter)}>
      <CardContent>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size="auto">
            <Box
              component="img"
              src={crafter.photo?.url ?? CrafterPng}
              alt={crafter.model ?? 'Crafter'}
              sx={{
                width: 75,
                height: 65,
                objectFit: 'cover',
                borderRadius: 1,
                boxShadow: 1,
                bgcolor: 'grey.100',
              }}
            />
          </Grid>

          <Grid size="grow">
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  label={crafter.isActive ? t(Labels.ui_status_active) : t(Labels.ui_status_inactive)}
                  color={crafter.isActive ? 'success' : 'error'}
                  size="small"
                  sx={{ height: 18, '& .MuiChip-label': { px: 0.75 } }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    hyphens: 'auto',
                  }}
                >
                  {crafter.model ?? t(Labels.crafter_model_unknown)}
                </Typography>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.25, display: 'block' }}>
                {crafter.registrationNumber} • {crafter.seatCapacity} {t(Labels.crafter_seats)}
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {t(Labels.crafter_mileage)}: {crafter.kilometrage ?? t(Labels.crafter_mileage_na)} km
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </CardActionArea>

    {/* Delete button outside CardActionArea to prevent conflicts */}
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <ButtonTx
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={e => {
          e.stopPropagation(); // Prevent card click when deleting
          onDelete(crafter);
        }}
        disabled={isDeleting}
        hideTextOnMobile
        size="large"
      >
        {t(Labels.button_delete)}
      </ButtonTx>
    </Box>
  </Card>
);

export default CrafterCard;

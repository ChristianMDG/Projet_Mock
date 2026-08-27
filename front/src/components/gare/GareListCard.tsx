import React from 'react';
import { Box, Card, CardContent, CardMedia, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Gare } from '@/types';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import taxibrousseRedUrl from '@/assets/taxibrousse-red.svg?url';
import ProtectedTx from '../ProtectedTx';

interface GareListCardProps {
  gare: Gare;
  onEdit?: (gare: Gare) => void;
  onViewDetails?: (gare: Gare) => void;
  coverImage?: string;
}

const GareListCard: React.FC<GareListCardProps> = ({ gare, onEdit, onViewDetails, coverImage }) => {
  const { t } = useTranslation();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(gare);
    }
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(gare);
    }
  };

  // Priorité: VilleDetail images > coverImage > gare.photo > default
  const villeDetailImages = gare.ville?.detail?.ImageGalery;
  const firstVilleImage = villeDetailImages && villeDetailImages.length > 0 ? villeDetailImages[0]?.url : null;

  const imageSource = firstVilleImage ?? coverImage ?? gare.photo?.url ?? taxibrousseRedUrl;
  const description = gare.description ?? t(Labels.gare_page_description_fallback);
  const addressPreview = gare.address && (gare.address.length > 80 ? `${gare.address.slice(0, 80)}…` : gare.address);
  const hasCustomImage = !!(imageSource && imageSource !== taxibrousseRedUrl);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          image={imageSource}
          alt={gare.name}
          sx={{
            objectFit: hasCustomImage ? 'cover' : 'contain',
            bgcolor: hasCustomImage ? 'neutral.50' : 'secondary.light',
            p: hasCustomImage ? 0 : 2,
            cursor: onViewDetails ? 'pointer' : 'default',
            height: 176,
          }}
          onClick={handleCardClick}
        />

        <ProtectedTx allowedRoles={['ADMIN']}>
          <Tooltip title={t(Labels.gare_card_edit_button)}>
            <IconButton
              onClick={handleEditClick}
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                boxShadow: 1,
              }}
            >
              <EditIcon
                sx={{
                  fontSize: 'small',
                }}
              />
            </IconButton>
          </Tooltip>
        </ProtectedTx>
      </Box>
      <CardContent
        onClick={handleCardClick}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          flexGrow: 1,
          cursor: onViewDetails ? 'pointer' : 'default',
          transition: 'background-color 0.2s',
          '&:hover': onViewDetails
            ? {
                bgcolor: 'action.hover',
              }
            : {},
        }}
      >
        <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
          {gare.name}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {gare.ville?.name ?? '—'}
            {gare.ville?.region && <span> • {gare.ville.region}</span>}
          </Typography>
        </Stack>

        {addressPreview && (
          <Typography variant="body2" color="text.secondary">
            {addressPreview}
          </Typography>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 60,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default GareListCard;

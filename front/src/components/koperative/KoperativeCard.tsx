import React from 'react';
import { Avatar, Box, Card, CardActionArea, CardContent, IconButton, Typography } from '@mui/material';
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Info as InfoIcon,
  LocationCity as LocationCityIcon,
} from '@mui/icons-material';
import { KoperativeVerifiedIcon } from '@/components/shared';
import { Koperative, Ville } from '@/types';
import { IconButtonTx } from '../ui';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { generateRoute } from '@/constants/routes';
import Labels from '@/labelKeys.json';

interface KoperativeCardProps {
  koperative: Koperative;
  onSelect?: (koperative: Koperative) => void;
  onEdit?: (koperative: Koperative) => void;
}

export const KoperativeCard: React.FC<KoperativeCardProps> = ({ koperative, onSelect, onEdit }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const handleSelect = () => {
    if (onSelect) {
      onSelect(koperative);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(koperative);
    }
  };

  const handleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (koperative.id) {
      navigate(generateRoute.cooperativeInfo(koperative.id, i18n.language));
    }
  };

  const formatVilles = (villes?: Ville[]): string => {
    if (!Array.isArray(villes) || villes.length === 0) {
      return 'Aucune ville associée';
    }
    return villes.map(v => v.name).join(', ');
  };

  const getVilleCount = (villes?: Ville[]): number => {
    return Array.isArray(villes) ? villes.length : 0;
  };

  return (
    <Card sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Action Buttons - Positioned absolutely to avoid nesting inside CardActionArea */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          display: 'flex',
          gap: 1,
        }}
      >
        {/* Info Button */}
        <IconButton
          className="info-button"
          onClick={handleInfo}
          title={t(Labels.koperative_info_button)}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'info.main',
              color: 'info.contrastText',
              boxShadow: 2,
            },
          }}
        >
          <InfoIcon />
        </IconButton>

        {/* Edit Button */}
        <IconButtonTx
          className="edit-button"
          onClick={handleEdit}
          allowedRoles={['ADMIN']}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: 2,
            },
          }}
        >
          <EditIcon />
        </IconButtonTx>
      </Box>

      <CardActionArea
        onClick={handleSelect}
        disabled={!onSelect}
        sx={{ height: 1, display: 'flex', alignItems: 'stretch' }}
      >
        <CardContent
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 1.5,
            '&:last-child': { pb: 3 },
          }}
        >
          {/* Header with Logo */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={koperative.logoUrl}
                alt={koperative.name}
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  boxShadow: 2,
                  bgcolor: koperative.logoUrl ? 'grey.100' : 'primary.main',
                  color: koperative.logoUrl ? 'inherit' : 'primary.contrastText',
                }}
              >
                {!koperative.logoUrl && <BusinessIcon sx={{ fontSize: 42 }} />}
              </Avatar>
            </Box>
          </Box>

          {/* Company Name */}
          <Typography
            variant="h6"
            component="h4"
            sx={{
              fontWeight: 600,
              mb: 1,
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {koperative.name?.toUpperCase()}
              <KoperativeVerifiedIcon koperative={koperative} fontSize="inherit" />
            </Box>
          </Typography>

          {/* Description */}
          {koperative.description && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.5,
                flex: 1,
              }}
            >
              {koperative.description}
            </Typography>
          )}

          {/* Cities Served */}
          <Box sx={{ mt: 'auto' }}>
            {getVilleCount(koperative.villes) > 0 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocationCityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 500, textTransform: 'uppercase' }}
                  >
                    {getVilleCount(koperative.villes)} Villes desservies
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {formatVilles(koperative.villes)}
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default KoperativeCard;

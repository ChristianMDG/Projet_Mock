import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { AirlineSeatReclineNormal, Star, Diamond } from '@mui/icons-material';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';

interface PricingBoxProps {
  type: string;
  price: string | null;
  voyageId: number;
  disabled?: boolean;
}

const getPricingIcon = (type: string) => {
  const normalizedType = type.toLowerCase();

  switch (normalizedType) {
    case 'standard':
      return AirlineSeatReclineNormal;
    case 'vip':
      return Star;
    case 'premium':
      return Diamond;
    default:
      return AirlineSeatReclineNormal;
  }
};

const PricingBox: React.FC<PricingBoxProps> = ({ type, price, voyageId, disabled = false }) => {
  const { expandedVoyageId, selectedPricingType, toggleVoyageExpansion, setSelectedPricingType } =
    useSeatSelectionStore();

  const isExpanded = expandedVoyageId === voyageId;
  const isSelected = isExpanded && selectedPricingType === type;
  const isAvailable = price !== null;
  const isClickable = isAvailable && !disabled;

  const IconComponent = getPricingIcon(type);

  const handleClick = () => {
    if (!isClickable) return;

    if (isSelected) {
      toggleVoyageExpansion(voyageId);
    } else {
      if (!isExpanded) toggleVoyageExpansion(voyageId);
      setSelectedPricingType(voyageId, type);
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: isClickable ? 'pointer' : 'default',
        opacity: isAvailable ? 1 : 0.5,
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'transparent',
        transition: 'all 0.2s',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        ...(isClickable && {
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 2,
          },
        }),
      }}
    >
      <Box
        sx={{
          p: 0.5,
          textAlign: 'center',
          bgcolor: isSelected ? 'primary.main' : 'action.hover',
          color: isSelected ? 'primary.contrastText' : 'inherit',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
        }}
      >
        <IconComponent sx={{ fontSize: 16 }} />
        <Typography
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {type}
        </Typography>
      </Box>
      <CardContent sx={{ p: 1, textAlign: 'center', '&:last-child': { pb: 1 } }}>
        <Typography
          variant="body2"
          color={isAvailable ? 'primary.main' : 'text.disabled'}
          sx={{
            fontWeight: 600,
          }}
        >
          {isAvailable ? `${price} AR` : 'Non disponible'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PricingBox;

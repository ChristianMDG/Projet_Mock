import React from 'react';
import { Card, Typography, Box, Chip, SvgIconProps, alpha } from '@mui/material';
import AirlineSeatReclineNormal from '@mui/icons-material/AirlineSeatReclineNormal';
import Diamond from '@mui/icons-material/Diamond';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useTranslation } from 'react-i18next';
import { useSeatSelectionStore } from '@/stores/seat-selection.store';
import { useSeatManagement } from '@/hooks/seat.hooks';
import Labels from '@/labelKeys.json';

interface PricingBoxProps {
  type: string;
  price: string | null;
  voyageId: number;
  disabled?: boolean;
  availableSeats?: number;
}

const PRICING_ICONS: Record<string, React.ComponentType<SvgIconProps>> = {
  standard: WorkspacePremiumIcon,
  premium: WorkspacePremiumIcon,
  vip: Diamond,
};

const getPricingIcon = (type: string) => PRICING_ICONS[type.toLowerCase()] ?? AirlineSeatReclineNormal;

const PricingBox: React.FC<PricingBoxProps> = ({ type, price, voyageId, disabled = false, availableSeats }) => {
  const { t } = useTranslation();
  const { expandedVoyageId, selectedPricingType, toggleVoyageExpansion, setSelectedPricingType, selectedSeats } =
    useSeatSelectionStore();

  const isExpanded = expandedVoyageId === voyageId;
  const isSelected = isExpanded && selectedPricingType === type;
  const isAvailable = price !== null;
  const isClickable = isAvailable && !disabled;

  const { remainingAvailableSeats } = useSeatManagement({
    voyageId,
    availableSeats,
    selectedSeats: selectedSeats[voyageId] ?? [],
  });

  const IconComponent = getPricingIcon(type);

  const getTextColor = () => {
    if (isAvailable) {
      if (isSelected) return 'secondary.main';
      return 'text.primary';
    }
    return 'text.disabled';
  };

  const handleClick = () => {
    if (isClickable) {
      if (isSelected) {
        toggleVoyageExpansion(voyageId);
      } else {
        if (!isExpanded) {
          toggleVoyageExpansion(voyageId);
        }
        setSelectedPricingType(voyageId, type);
      }
    }
  };

  return (
    <Card
      onClick={handleClick}
      variant="outlined"
      sx={{
        cursor: isClickable ? 'pointer' : 'default',
        opacity: isAvailable ? 1 : 0.5,
        border: '2px solid',
        borderColor: isSelected ? 'secondary.main' : theme => alpha(theme.palette.primary.light, 0.2),
        backgroundColor: isSelected ? 'action.selected' : 'background.paper',
        boxShadow: isSelected ? 1 : 0,
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s ease-in-out',
        ...(isClickable && {
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 1,
            borderColor: isSelected ? 'secondary.main' : 'secondary.light',
          },
        }),
      }}
    >
      <Box
        sx={{
          py: 0.5,
          gap: 0.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isSelected ? 'action.selected' : 'secondary.main',
        }}
      >
        <IconComponent
          sx={{
            fontSize: 16,
          }}
        />
        {type && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {type}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="body2" color={getTextColor()} sx={{ fontWeight: 600 }}>
          {isAvailable ? `${price} AR` : 'Non disponible'}
        </Typography>
        {isAvailable && availableSeats !== undefined && (
          <Chip
            label={`${remainingAvailableSeats} ${t(Labels.seat_available)}`}
            color={remainingAvailableSeats > 0 ? 'success' : 'default'}
            variant="outlined"
            size="small"
            icon={<AirlineSeatReclineNormal />}
            sx={theme => ({
              borderColor: alpha(
                remainingAvailableSeats > 0 ? theme.palette.success.main : theme.palette.action.active,
                0.2,
              ),
            })}
          />
        )}
      </Box>
    </Card>
  );
};

export default PricingBox;

import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  EventSeat as SeatIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Room as LocationIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { KoperativeVerifiedIcon, VehicleIcon } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import dayjs from 'dayjs';
import { Voyage } from '../../models/Voyage';
import { VoyageStatusEnum } from '../../models/enums';

interface VoyageCardProps {
  voyage: Voyage;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onView: (voyage: Voyage) => void;
  onEdit: (voyage: Voyage) => void;
  onDelete: (voyage: Voyage) => void;
}

const VoyageCard: React.FC<VoyageCardProps> = ({ voyage, isSelected, onSelect, onView, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  const getStatusColor = (status?: VoyageStatusEnum): 'success' | 'warning' | 'error' | 'info' | 'default' => {
    switch (status) {
      case VoyageStatusEnum.SCHEDULED:
        return 'info';
      case VoyageStatusEnum.ONGOING:
        return 'warning';
      case VoyageStatusEnum.COMPLETED:
        return 'success';
      case VoyageStatusEnum.CANCELLED:
        return 'error';
      case VoyageStatusEnum.DELAYED:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status?: VoyageStatusEnum): string => {
    switch (status) {
      case VoyageStatusEnum.SCHEDULED:
        return t(Labels.enum_voyage_status_scheduled);
      case VoyageStatusEnum.ONGOING:
        return t(Labels.enum_voyage_status_ongoing);
      case VoyageStatusEnum.COMPLETED:
        return t(Labels.enum_voyage_status_completed);
      case VoyageStatusEnum.CANCELLED:
        return t(Labels.enum_voyage_status_cancelled);
      case VoyageStatusEnum.DELAYED:
        return t(Labels.enum_voyage_status_delayed);
      default:
        return t(Labels.status_unknown);
    }
  };

  const departureTime = voyage.departureTime ? dayjs(voyage.departureTime) : null;
  const estimatedArrival = voyage.estimatedArrivalTime ? dayjs(voyage.estimatedArrivalTime) : null;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 4,
        },
      }}
      onClick={() => onView(voyage)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Checkbox
              checked={isSelected}
              onChange={e => {
                e.stopPropagation();
                onSelect(voyage.id!);
              }}
              size="small"
              onClick={e => e.stopPropagation()}
            />
            <Chip size="small" label={getStatusLabel(voyage.status)} color={getStatusColor(voyage.status)} />
          </Box>
          <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Route Information */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <LocationIcon
            color="action"
            sx={{
              fontSize: 'small',
            }}
          />
          <Typography variant="h6" component="div" noWrap>
            {voyage.departureGare?.name} → {voyage.arrivalGare?.name}
          </Typography>
        </Box>

        {/* Time Information */}
        {departureTime && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 1,
            }}
          >
            <ScheduleIcon
              color="action"
              sx={{
                fontSize: 'small',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {departureTime.format('DD/MM/YYYY HH:mm')}
              {estimatedArrival && ` → ${estimatedArrival.format('HH:mm')}`}
            </Typography>
          </Box>
        )}

        {/* Vehicle & Driver */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
          }}
        >
          {voyage.crafter && (
            <Tooltip title={t(Labels.ui_voyage_crafter)}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <VehicleIcon
                  color="action"
                  sx={{
                    fontSize: 'small',
                  }}
                />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {voyage.crafter.registrationNumber}
                </Typography>
              </Box>
            </Tooltip>
          )}

          {voyage.chauffeur && (
            <Tooltip title={t(Labels.ui_voyage_chauffeur)}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <PersonIcon
                  color="action"
                  sx={{
                    fontSize: 'small',
                  }}
                />
                <Typography variant="body2" color="text.secondary" noWrap>
                  {voyage.chauffeur.user?.firstName} {voyage.chauffeur.user?.lastName}
                </Typography>
              </Box>
            </Tooltip>
          )}
        </Box>

        {/* Seats Info */}
        {voyage.crafter?.seatCapacity && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1,
            }}
          >
            <SeatIcon
              color="action"
              sx={{
                fontSize: 'small',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {t(Labels.voyage_available_seats)}: {voyage.crafter.seatCapacity}
            </Typography>
          </Box>
        )}

        {/* Koperative */}
        {voyage.koperative && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 2,
            }}
          >
            <Avatar src={voyage.koperative.logoUrl} sx={{ width: 24, height: 24 }}>
              {voyage.koperative.name?.[0]}
            </Avatar>
            <Typography variant="body2" color="text.secondary" noWrap>
              {voyage.koperative.name}
            </Typography>
            <KoperativeVerifiedIcon koperative={voyage.koperative} fontSize="small" />
          </Box>
        )}
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={e => {
            e.stopPropagation();
            onView(voyage);
          }}
        >
          {t(Labels.view)}
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={e => {
            e.stopPropagation();
            onEdit(voyage);
          }}
        >
          {t(Labels.ui_edit)}
        </Button>
      </CardActions>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleAction(() => onView(voyage))}>
          <ViewIcon sx={{ mr: 1 }} />
          {t(Labels.view)}
        </MenuItem>
        <MenuItem onClick={() => handleAction(() => onEdit(voyage))}>
          <EditIcon sx={{ mr: 1 }} />
          {t(Labels.ui_edit)}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => handleAction(() => onDelete(voyage))} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          {t(Labels.ui_delete)}
        </MenuItem>
      </Menu>
    </Card>
  );
};

interface VoyageManagementCardViewProps {
  voyages: Voyage[];
  selectedVoyageIds: number[];
  onVoyageSelect: (id: number) => void;
  onVoyageView: (voyage: Voyage) => void;
  onVoyageEdit: (voyage: Voyage) => void;
  onVoyageDelete: (voyage: Voyage) => void;
  isLoading?: boolean;
}

const VoyageManagementCardView: React.FC<VoyageManagementCardViewProps> = ({
  voyages,
  selectedVoyageIds,
  onVoyageSelect,
  onVoyageView,
  onVoyageEdit,
  onVoyageDelete,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <Typography>{t(Labels.voyage_management_loading)}</Typography>
      </Box>
    );
  }

  if (voyages.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
          textAlign: 'center',
        }}
      >
        <VehicleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t(Labels.voyage_management_no_results)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(Labels.voyage_try_different_filters)}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {voyages.map(voyage => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={voyage.id}>
          <VoyageCard
            voyage={voyage}
            isSelected={selectedVoyageIds.includes(voyage.id!)}
            onSelect={onVoyageSelect}
            onView={onVoyageView}
            onEdit={onVoyageEdit}
            onDelete={onVoyageDelete}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VoyageManagementCardView;

import React, { useState } from 'react';
import type { ChipProps } from '@mui/material';
import {
  Alert,
  Avatar,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';

import dayjs from 'dayjs';
import { KoperativeVerifiedIcon, VehicleIcon } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useDeleteVoyage } from '@/hooks/voyage.hooks';
import { Voyage } from '@/types';
import { VoyageStatusEnum, VoyageStatusLabels } from '@/models/enums';
import Labels from '@/labelKeys.json';

interface VoyageListTableProps {
  voyages: Voyage[];
  isLoading?: boolean;
  showActions?: boolean;
  title?: string;
  onEdit?: (voyage: Voyage) => void;
  onView?: (voyage: Voyage) => void;
}

export const VoyageListTable: React.FC<VoyageListTableProps> = ({
  voyages,
  isLoading = false,
  showActions = true,
  title,
  onEdit,
  onView,
}) => {
  const { t } = useTranslation();
  const deleteVoyage = useDeleteVoyage();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVoyage, setSelectedVoyage] = useState<Voyage | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, voyage: Voyage) => {
    setAnchorEl(event.currentTarget);
    setSelectedVoyage(voyage);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVoyage(null);
  };

  const handleEdit = () => {
    if (selectedVoyage && onEdit) {
      onEdit(selectedVoyage);
    }
    handleMenuClose();
  };

  const handleView = () => {
    if (selectedVoyage && onView) {
      onView(selectedVoyage);
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (selectedVoyage && window.confirm(t(Labels.voyage_delete_confirm_title))) {
      try {
        await deleteVoyage.mutateAsync(selectedVoyage.id!);
      } catch (error) {
        console.error('Error deleting voyage:', error);
      }
    }
    handleMenuClose();
  };

  const getStatusColor = (status: VoyageStatusEnum): ChipProps['color'] => {
    switch (status) {
      case VoyageStatusEnum.SCHEDULED:
        return 'primary';
      case VoyageStatusEnum.ONGOING:
        return 'warning';
      case VoyageStatusEnum.COMPLETED:
        return 'success';
      case VoyageStatusEnum.CANCELLED:
        return 'error';
      case VoyageStatusEnum.DELAYED:
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
    } catch (error) {
      console.warn('Invalid date format:', dateTime, error);
      return dateTime;
    }
  };

  const formatPrice = (price: number) => {
    try {
      return new Intl.NumberFormat('mg-MG', {
        style: 'currency',
        currency: 'MGA',
        minimumFractionDigits: 0,
      }).format(price);
    } catch {
      // Fallback formatting if Malagasy locale is not available
      return `${price.toLocaleString()} MGA`;
    }
  };

  if (voyages.length === 0 && !isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        {title && (
          <Typography variant="h6" sx={{ mb: 2 }}>
            {title}
          </Typography>
        )}
        <Alert severity="info">{t(Labels.voyage_no_data)}</Alert>
      </Paper>
    );
  }

  return (
    <Paper>
      {title && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t(Labels.voyage_route)}</TableCell>
              <TableCell>{t(Labels.voyage_table_departure)}</TableCell>
              <TableCell>{t(Labels.voyage_table_arrival)}</TableCell>
              <TableCell>{t(Labels.voyage_table_koperative)}</TableCell>
              <TableCell>{t(Labels.voyage_table_vehicle)}</TableCell>
              <TableCell>{t(Labels.voyage_table_driver)}</TableCell>
              <TableCell>{t(Labels.voyage_available_seats)}</TableCell>
              <TableCell>{t(Labels.voyage_table_price)}</TableCell>
              <TableCell>{t(Labels.voyage_status)}</TableCell>
              {showActions && <TableCell align="center">{t(Labels.actions)}</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {voyages.map(voyage => (
              <TableRow key={voyage.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon
                      color="action"
                      sx={{
                        fontSize: 'small',
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 'medium',
                        }}
                      >
                        {voyage.departureGare?.name} → {voyage.arrivalGare?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {voyage.departureGare?.ville?.name} - {voyage.arrivalGare?.ville?.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ScheduleIcon
                      color="action"
                      sx={{
                        fontSize: 'small',
                      }}
                    />
                    <Typography variant="body2">{formatDateTime(voyage.departureTime)}</Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {voyage.estimatedArrivalTime ? formatDateTime(voyage.estimatedArrivalTime) : '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'medium',
                      }}
                    >
                      {voyage.koperative?.name}
                    </Typography>
                    <KoperativeVerifiedIcon koperative={voyage.koperative} fontSize="small" />
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VehicleIcon
                      color="action"
                      sx={{
                        fontSize: 'small',
                      }}
                    />
                    <Box>
                      <Typography variant="body2">{voyage.crafter?.model ?? '-'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {voyage.crafter?.registrationNumber}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      <PersonIcon
                        sx={{
                          fontSize: 'small',
                        }}
                      />
                    </Avatar>
                    <Typography variant="body2">
                      {voyage.chauffeur?.user?.firstName} {voyage.chauffeur?.user?.lastName}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {voyage.availableSeats}/{voyage.crafter?.seatCapacity ?? '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'medium',
                    }}
                  >
                    {voyage.pricePerSeat ? formatPrice(voyage.pricePerSeat) : '-'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={t(VoyageStatusLabels[voyage.status ?? VoyageStatusEnum.SCHEDULED])}
                    color={getStatusColor(voyage.status ?? VoyageStatusEnum.SCHEDULED)}
                    size="small"
                  />
                </TableCell>

                {showActions && (
                  <TableCell align="center">
                    <Tooltip title={t(Labels.more_actions)}>
                      <IconButton size="small" onClick={e => handleMenuOpen(e, voyage)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleView}>
          <Tooltip title={t(Labels.view)}>
            <ViewIcon
              sx={{
                fontSize: 'small',
              }}
            />
          </Tooltip>
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Tooltip title={t(Labels.edit)}>
            <EditIcon
              sx={{
                fontSize: 'small',
              }}
            />
          </Tooltip>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Tooltip title={t(Labels.delete)}>
            <DeleteIcon
              sx={{
                fontSize: 'small',
              }}
            />
          </Tooltip>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

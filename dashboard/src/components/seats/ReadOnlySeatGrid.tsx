import { Badge, Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { Block, BrokenImage, Person } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import UserSeatIcon from './icons/UserSeatIcon';
import DriverSeatIcon from './icons/DriverSeatIcon';
import { getConfigByCapacity } from '@/utils/seatConfigs';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    fontSize: '0.65rem',
    minWidth: 20,
    height: 20,
    padding: '0 6px',
    transform: 'scale(1) translate(70%, -50%)',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.5rem',
      minWidth: 14,
      height: 14,
      padding: '0 2px',
    },
  },
}));

interface SeatConfig {
  id: number;
  position: string;
  status: 'available' | 'reserved' | 'blocked' | 'damaged';
}

interface ReadOnlySeatGridProps {
  seats: SeatConfig[];
  seatCapacity?: number;
  rows?: number; // Deprecated, layout is determined by crafter config
  columns?: number; // Deprecated, layout is determined by crafter config
  title?: string;
}

/**
 * Read-only seat grid component for displaying seat status
 * Used in facturation and reporting views
 */
export default function ReadOnlySeatGrid({ seats, seatCapacity = 18, title }: Readonly<ReadOnlySeatGridProps>) {
  const activeConfig = getConfigByCapacity(seatCapacity);

  const getSeatByPosition = (position: string): SeatConfig | undefined => {
    return seats.find((seat) => seat.position === position);
  };

  const getSeatStyling = (status: SeatConfig['status']) => {
    switch (status) {
      case 'reserved':
        return {
          backgroundColor: 'background.paper',
          border: '2px solid',
          borderColor: 'grey.400',
          color: 'error.contrastText',
        };
      case 'blocked':
        return {
          backgroundColor: 'warning.light',
          border: '2px solid',
          borderColor: 'warning.main',
          color: 'warning.contrastText',
        };
      case 'damaged':
        return {
          backgroundColor: 'grey.500',
          border: '2px solid',
          borderColor: 'grey.700',
          color: 'grey.50',
        };
      case 'available':
      default:
        return {
          backgroundColor: 'background.paper',
          border: '1.5px solid',
          borderColor: 'grey.300',
          color: 'text.secondary',
        };
    }
  };

  const getSeatIcon = (position: string, status: SeatConfig['status']) => {
    const isDriverSeat = position === 'A1';

    if (isDriverSeat) {
      return <DriverSeatIcon fontSize="large" />;
    }

    switch (status) {
      case 'reserved':
        return (
          <StyledBadge badgeContent={position} color="secondary" overlap="circular">
            <Person color="primary" fontSize="large" />
          </StyledBadge>
        );
      case 'blocked':
        return <Block fontSize="large" />;
      case 'damaged':
        return <BrokenImage fontSize="large" />;
      case 'available':
      default:
        return (
          <StyledBadge badgeContent={position} color="default" overlap="circular">
            <UserSeatIcon fontSize="large" />
          </StyledBadge>
        );
    }
  };

  return (
    <Card sx={{ bgcolor: 'background.paper', boxShadow: 1 }}>
      <CardContent>
        {title && (
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            {title}
          </Typography>
        )}
        <Grid container spacing={1.5}>
          {activeConfig.seats.map((row, rowIdx) => (
            <Grid
              container
              size={12}
              spacing={{ xs: 2, sm: 2, md: 3 }}
              key={`row-${rowIdx + 1}`}
              sx={{ mb: 1, display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}
            >
              {row.map((seat, colIdx) => {
                const colSize = 12 / row.length;

                if (seat.hide) {
                  return (
                    <Grid size={colSize} key={`empty-${rowIdx + 1}-${colIdx + 1}`} sx={{ display: 'flex' }}>
                      <Box sx={{ flex: 1 }} />
                    </Grid>
                  );
                }

                const propSeat = getSeatByPosition(seat.position);
                const status = propSeat?.status ?? 'available';
                const styling = getSeatStyling(status);

                return (
                  <Grid size={colSize} key={`seat-${seat.id}`} sx={{ display: 'flex' }}>
                    <Button
                      disabled
                      sx={{
                        width: 1,
                        borderRadius: 4,
                        ...styling,
                        '&:disabled': {
                          cursor: 'default',
                          color: styling.color,
                          backgroundColor: styling.backgroundColor,
                          borderColor: styling.borderColor,
                        },
                      }}
                    >
                      {getSeatIcon(seat.position, status)}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

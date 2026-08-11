import React, { memo, useCallback, useMemo } from 'react';
import { Badge, Button } from '@mui/material';
import { styled, Theme, useTheme } from '@mui/material/styles';
import BlockIcon from '@mui/icons-material/Block';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { TFunction } from 'i18next';
import { SeatStatus } from './constants';
import { SeatConfig } from '@/types/type.props';
import { Person } from '@mui/icons-material';
import { UserSeatIcon } from './UserSeatIcon';
import { DriverSeatIcon } from './DriverSeatIcon';

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

interface SeatProps {
  seatConfig: SeatConfig;
  seatStatus: SeatStatus;
  onSeatClick: (seatConfig: SeatConfig) => void;
  t: TFunction;
  readonly?: boolean;
  displayMine?: boolean;
}

/**
 * Enhanced seat button component with support for all seat status types
 */
export const Seat: React.FC<SeatProps> = memo(({ seatConfig, seatStatus, onSeatClick, readonly = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  readonly = readonly && seatStatus !== 'selected';

  const getReadonlyStyling = (theme: Theme, isDark: boolean) => ({
    backgroundColor: isDark ? theme.palette.grey[800] : '#fff',
    border: `1.5px solid ${isDark ? theme.palette.grey[600] : theme.palette.grey[300]}`,
    color: isDark ? theme.palette.grey[400] : theme.palette.grey[500],
    boxShadow: `0 1px 2px 0 ${isDark ? theme.palette.grey[900] : theme.palette.grey[200]}`,
    clickable: false,
  });

  const getSeatStatusStyling = (seatStatus: SeatStatus, theme: Theme, isDark: boolean) => {
    switch (seatStatus) {
      case 'selected':
        return {
          backgroundColor: theme.palette.primary.main,
          border: `2px solid ${theme.palette.secondary.main}`,
          color: theme.palette.primary.contrastText,
          clickable: true,
        };
      case 'reserved':
        return {
          border: `2px solid ${theme.palette.grey[400]}`,
          color: theme.palette.error.contrastText,
          clickable: false,
        };
      case 'blocked':
        return {
          backgroundColor: theme.palette.warning.light,
          border: `2px solid ${theme.palette.warning.main}`,
          color: theme.palette.warning.contrastText,
          clickable: false,
        };
      case 'damaged':
        return {
          backgroundColor: theme.palette.grey[500],
          border: `2px solid ${theme.palette.grey[700]}`,
          color: theme.palette.grey[50],
          clickable: false,
        };
      case 'available':
      default:
        return {
          backgroundColor: isDark ? theme.palette.background.paper : '#fff',
          border: `1.5px solid ${isDark ? theme.palette.grey[700] : theme.palette.grey[300]}`,
          color: isDark ? theme.palette.text.primary : theme.palette.text.secondary,
          boxShadow: `0 1px 3px 0 ${isDark ? theme.palette.grey[900] : theme.palette.grey[200]}`,
          fontWeight: 'bold',
          clickable: true,
        };
    }
  };

  const styling = useMemo(() => {
    if (readonly) {
      return getReadonlyStyling(theme, isDark);
    }
    return getSeatStatusStyling(seatStatus, theme, isDark);
  }, [seatStatus, theme, isDark, readonly]);

  const handleClick = useCallback(() => {
    if (!readonly && !seatConfig.disable && styling.clickable) {
      onSeatClick(seatConfig);
    }
  }, [readonly, seatConfig, styling.clickable, onSeatClick]);

  const getSeatIcon = () => {
    switch (seatStatus) {
      case 'reserved':
        return (
          <StyledBadge badgeContent={seatConfig.position} color="secondary" overlap="circular">
            <Person color="primary" fontSize="large" />
          </StyledBadge>
        );
      case 'blocked':
        return <BlockIcon fontSize="large" />;
      case 'damaged':
        return <BrokenImageIcon fontSize="large" />;
      default:
        if (seatConfig.position === 'A1') {
          return <DriverSeatIcon fontSize="large" />;
        }
        return (
          <StyledBadge badgeContent={seatConfig.position} color="default" overlap="circular">
            <UserSeatIcon fontSize="large" />
          </StyledBadge>
        );
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={readonly || seatConfig.disable || !styling.clickable}
      sx={{
        width: 1,
        backgroundColor: styling.backgroundColor,
        borderRadius: 4,
        color: styling.color,
        border: styling.border,
        boxShadow: styling.boxShadow,
        '&:hover': {
          backgroundColor: styling.clickable && !readonly ? theme.palette.primary.main : styling.backgroundColor,
          color: styling.clickable && !readonly ? theme.palette.primary.contrastText : styling.color,
        },
        '&:disabled': {
          cursor: readonly ? 'default' : 'not-allowed',
          color: styling.color,
        },
      }}
    >
      {getSeatIcon()}
    </Button>
  );
});

Seat.displayName = 'Seat';

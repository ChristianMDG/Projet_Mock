import React, { memo, useCallback, useMemo } from 'react';
import { Badge, Button } from '@mui/material';
import { styled, Theme, useTheme } from '@mui/material/styles';
import BlockIcon from '@mui/icons-material/Block';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TFunction } from 'i18next';
import { SeatStatus } from '@/utils/constants';
import { SeatConfig } from '@/types/type.props';
import Person from '@mui/icons-material/Person';
import { UserSeatIcon } from './UserSeatIcon';
import { DriverSeatIcon } from './DriverSeatIcon';
import { trackEvent } from '@/hooks/google-analytics.hook';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    fontSize: '0.65rem',
    fontWeight: 600,
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
  editMode?: boolean;
}

/**
 * Enhanced seat button component with support for all seat status types
 */
export const Seat: React.FC<SeatProps> = memo(
  ({ seatConfig, seatStatus, onSeatClick, readonly = false, editMode = false }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';
    readonly = readonly && seatStatus !== 'selected';

    const getReadonlyStyling = (theme: Theme, isDark: boolean) => ({
      backgroundColor: isDark ? theme.palette.grey[800] : 'white',
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
            backgroundColor: isDark ? theme.palette.background.paper : 'white',
            border: `1.5px solid ${isDark ? theme.palette.grey[700] : theme.palette.grey[300]}`,
            color: isDark ? theme.palette.text.primary : theme.palette.text.secondary,
            boxShadow: `0 1px 3px 0 ${isDark ? theme.palette.grey[900] : theme.palette.grey[200]}`,
            fontWeight: 'bold',
            clickable: true,
          };
      }
    };

    const styling = useMemo(() => {
      if (editMode) {
        const isHidden = seatConfig.hide;
        const isDisabled = seatConfig.disable;
        const baseBg = isDark ? theme.palette.background.paper : theme.palette.background.default;
        if (isHidden) {
          return {
            backgroundColor: 'transparent',
            border: `1.5px dashed ${theme.palette.divider}`,
            color: theme.palette.text.disabled,
            boxShadow: undefined as string | undefined,
            clickable: true,
          };
        }
        if (isDisabled) {
          return {
            backgroundColor: theme.palette.action.disabledBackground,
            border: `2px solid ${theme.palette.warning.main}`,
            color: theme.palette.warning.contrastText,
            boxShadow: undefined as string | undefined,
            clickable: true,
          };
        }
        return {
          backgroundColor: baseBg,
          border: `1.5px solid ${theme.palette.success.main}`,
          color: theme.palette.text.primary,
          boxShadow: undefined as string | undefined,
          clickable: true,
        };
      }
      if (readonly) {
        return getReadonlyStyling(theme, isDark);
      }
      return getSeatStatusStyling(seatStatus, theme, isDark);
    }, [seatStatus, theme, isDark, readonly, editMode, seatConfig.hide, seatConfig.disable]);

    const handleClick = useCallback(() => {
      if (editMode) {
        if (seatConfig.position === 'A1' || seatConfig.position === 'A2') return;
        onSeatClick(seatConfig);
        return;
      }
      if (!readonly && !seatConfig.disable && styling.clickable) {
        trackEvent('seat_clicked', 'Booking', `Seat ${seatConfig.position}`);
        onSeatClick(seatConfig);
      }
    }, [editMode, readonly, seatConfig, styling.clickable, onSeatClick]);

    const getSeatIcon = () => {
      const iconSx = {
        fontSize: { xs: '32px', md: '48px' },
      };

      if (editMode) {
        if (seatConfig.position === 'A1') {
          return <DriverSeatIcon sx={iconSx} />;
        }
        if (seatConfig.hide) {
          return <VisibilityOffIcon sx={iconSx} />;
        }
        if (seatConfig.disable) {
          return <BlockIcon sx={iconSx} />;
        }
        return (
          <StyledBadge badgeContent={seatConfig.position} color="default" overlap="circular">
            <UserSeatIcon sx={iconSx} />
          </StyledBadge>
        );
      }

      if (seatConfig.position === 'A1') {
        return <DriverSeatIcon sx={iconSx} />;
      }

      switch (seatStatus) {
        case 'blocked':
          return <BlockIcon sx={iconSx} />;
        case 'damaged':
          return <BrokenImageIcon sx={iconSx} />;
        case 'reserved':
          return (
            <StyledBadge badgeContent={seatConfig.position} color="secondary" overlap="circular">
              <Person color="primary" sx={iconSx} />
            </StyledBadge>
          );
        default:
          return (
            <StyledBadge badgeContent={seatConfig.position} color="default" overlap="circular">
              <UserSeatIcon color="primary" sx={iconSx} />
            </StyledBadge>
          );
      }
    };

    return (
      <Button
        onClick={handleClick}
        disabled={
          editMode
            ? seatConfig.position === 'A1' || seatConfig.position === 'A2'
            : readonly || seatConfig.disable || !styling.clickable
        }
        sx={{
          minWidth: 0,
          width: '100%',
          borderRadius: 4,
          color: styling.color,
          border: styling.border,
          boxShadow: styling.boxShadow,
          backgroundColor: styling.backgroundColor,
          '&:hover': {
            backgroundColor: styling.clickable && !readonly ? theme.palette.primary.main : styling.backgroundColor,
            color: styling.clickable && !readonly ? theme.palette.primary.contrastText : styling.color,
          },
          '&:disabled': {
            cursor: readonly ? 'default' : 'not-allowed',
            color: styling.color,
          },
          '& .MuiSvgIcon-colorPrimary': {
            color: seatStatus === 'selected' ? 'primary.contrastText' : 'primary.main',
          },
          '&:hover .MuiSvgIcon-colorPrimary': {
            color: styling.clickable && !readonly ? 'primary.contrastText' : 'primary.main',
          },
        }}
      >
        {getSeatIcon()}
      </Button>
    );
  },
);

Seat.displayName = 'Seat';

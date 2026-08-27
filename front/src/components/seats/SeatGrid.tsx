import React, { memo } from 'react';
import { Box, Paper, Typography, alpha } from '@mui/material';
import { Seat } from './Seat';
import { SeatGridSkeleton } from './SeatGridSkeleton';
import { BubbleBackground } from './BubbleBackground';
import { SeatStatus } from '@/utils/constants';
import { Crafter } from '@/models/Crafter';
import { CrafterConfig, SeatConfig } from '@/types/type.props';
import { useCrafterConfig } from '@/hooks/crafter.hooks';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';

interface SeatGridProps {
  crafter: Crafter;
  getSeatStatus: (seatNumber: number) => SeatStatus;
  onSeatClick: (seatConfig: SeatConfig) => void;
  readonly?: boolean;
  config?: CrafterConfig;
  editMode?: boolean;
  onSeatEdit?: (seatConfig: SeatConfig) => void;
}

const NOOP = (_seatConfig: SeatConfig) => {};

/**
 * Grid component for rendering all seats based on crafter configuration
 */
export const SeatGrid: React.FC<SeatGridProps> = memo(
  ({ crafter, getSeatStatus, onSeatClick, readonly = false, config, editMode = false, onSeatEdit }) => {
    const { data: queriedConfig, isPending } = useCrafterConfig(config ? undefined : crafter);
    const { t } = useTranslation();
    const activeConfig = config ?? queriedConfig;
    const isConfigLoaded = Boolean(activeConfig) && (!isPending || Boolean(config));

    if (isConfigLoaded) {
      const activeConfigObj = activeConfig!;
      const handleClick = (seat: SeatConfig) => {
        if (editMode) {
          onSeatEdit?.(seat);
          return;
        }
        if (readonly) return;
        onSeatClick(seat);
      };

      const isReadonlyMode = readonly && !editMode;

      return (
        <Paper
          variant="outlined"
          sx={theme => ({
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'auto',
            overflowY: 'hidden',
            borderRadius: 6,
            isolation: 'isolate',
            border: 2,
            borderColor: alpha(theme.palette.divider, 0.12),
          })}
        >
          <BubbleBackground interactive />
          <Box
            sx={{
              zIndex: 1,
              width: '100%',
              maxWidth: '100%',
              position: 'relative',
              p: { xs: 1, sm: 1.5, md: 2, lg: 3 },
              boxSizing: 'border-box',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.5, md: 2 }, width: '100%' }}>
              {activeConfigObj.seats.map((row, rowIdx) => (
                <Box
                  key={`row-${rowIdx + 1}`}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
                    alignItems: 'stretch',
                    gap: { xs: 0.5, sm: 0.75, md: 1 },
                    width: '100%',
                    minWidth: 0,
                  }}
                >
                  {row.map(seat => {
                    const status = getSeatStatus(seat.id);
                    const isSeatVisible = editMode || !seat.hide;
                    return (
                      <Box
                        key={`seat-${seat.id}`}
                        sx={{
                          width: '100%',
                          minWidth: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'stretch',
                          overflow: 'hidden',
                        }}
                      >
                        {isSeatVisible ? (
                          <Seat
                            seatConfig={seat}
                            seatStatus={status}
                            onSeatClick={isReadonlyMode ? NOOP : handleClick}
                            readonly={isReadonlyMode}
                            editMode={editMode}
                            t={t}
                          />
                        ) : (
                          <Box sx={{ width: '100%', height: '100%' }} />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
            {crafter && (
              <Typography variant="caption" sx={{ color: 'text.primary', gap: 1 }}>
                {t(Labels.crafter_seat_configuration_preview)}
                {crafter.model && crafter.registrationNumber && (
                  <Typography variant="caption" sx={{ fontWeight: 500, marginLeft: 0.5 }} color="text.primary">
                    {crafter.registrationNumber}
                  </Typography>
                )}
              </Typography>
            )}
          </Box>
        </Paper>
      );
    }

    return <SeatGridSkeleton />;
  },
);

SeatGrid.displayName = 'SeatGrid';

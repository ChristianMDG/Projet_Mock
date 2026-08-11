/**
 * Constants for KrafterViewer component
 */

import { SeatStatusEnum } from '@/models/enums';

export const SEAT_LAYOUT = {
  ROWS: 5,
  COLS: 4,
  SPECIAL_SEATS: [21, 22, 23],
} as const;

export const RESPONSIVE_CONFIG = {
  MOBILE: {
    fontSize: 14,
    minWidth: 40,
    spacing: 1,
    padding: 1.5,
  },
  TABLET: {
    fontSize: 16,
    minWidth: 44,
    spacing: 2,
    padding: 2,
  },
  DESKTOP: {
    fontSize: 20,
    minWidth: 48,
    spacing: 3,
    padding: 2,
  },
} as const;

// Map our SeatStatusEnum to display status
export type SeatStatus = 'available' | 'reserved' | 'selected' | 'blocked' | 'damaged';

export const mapSeatStatusToDisplay = (seatStatus: SeatStatusEnum, isSelected: boolean = false): SeatStatus => {
  if (isSelected) return 'selected';

  switch (seatStatus) {
    case SeatStatusEnum.AVAILABLE:
      return 'available';
    case SeatStatusEnum.RESERVED:
      return 'reserved';
    case SeatStatusEnum.BLOCKED:
      return 'blocked';
    case SeatStatusEnum.DAMAGED:
      return 'damaged';
    default:
      return 'available';
  }
};

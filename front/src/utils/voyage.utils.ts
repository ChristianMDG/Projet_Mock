import type { ChipProps } from '@mui/material';
import { VoyageTypeEnum } from '@/models/enums';
import dayjs from '@/utils/dayjs';

/**
 * Color mappings for voyage type chips
 */
export const VOYAGE_TYPE_COLORS: Record<VoyageTypeEnum, ChipProps['color']> = {
  [VoyageTypeEnum.NATIONAL]: 'info',
  [VoyageTypeEnum.REGIONAL]: 'success',
};

/**
 * Get chip color for voyage type
 */
export const getVoyageTypeColor = (type?: VoyageTypeEnum): ChipProps['color'] =>
  type ? VOYAGE_TYPE_COLORS[type] : 'default';

/**
 * Checks if a voyage departs within Day J (today), J+1 (tomorrow), or J+2 (day after tomorrow)
 */
export const isShortNoticeDeparture = (departureTime?: string | null): boolean => {
  if (departureTime) {
    const departureDay = dayjs(departureTime).tz('Indian/Antananarivo').startOf('day');
    const today = dayjs().tz('Indian/Antananarivo').startOf('day');
    if (departureDay.isValid()) {
      const diffInDays = departureDay.diff(today, 'day');
      return diffInDays >= 0 && diffInDays <= 1;
    }
  }
  return false;
};

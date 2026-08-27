import type { ChipProps } from '@mui/material';
import { VoyageTypeEnum } from '@/models/enums';

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

/**
 * KrafterViewer Component Module
 *
 * A comprehensive seat selection component with:
 * - Real-time reservation integration
 * - Responsive design for all device sizes
 * - Visual seat status indicators
 * - Clean, modular architecture
 */

export { KrafterViewer } from '../KrafterViewer';
export { Seat } from './Seat';
export { SeatGrid } from './SeatGrid';
export { SeatLegend } from './SeatLegend';
export { useSeatManagement } from '@/hooks/seat.hooks';
export { SEAT_LAYOUT, RESPONSIVE_CONFIG } from '@/utils/constants';
export type { SeatStatus } from '@/utils/constants';

// Seat Management Components
export { default as SeatBooking, SeatBooking as SeatBookingNamed } from './SeatBooking';
export { SeatManagement } from './SeatManagement';
export { SeatReservation } from './SeatReservation';

import { Seat } from '@/models/Seat';
import { SeatConfig } from '@/types/type.props';

/**
 * Seat configuration utilities
 * Provides functions to handle seat capacity calculations and configuration mappings
 *
 * Available configurations:
 * - 10places.json: 10 seats (4x3 grid with some hidden seats)
 * - 18places.json: 18 seats (5x4 grid configuration)
 * - 22places.json: 22 seats (6x4 grid configuration)
 */

// Configuration name to seat capacity mapping
const SEAT_CAPACITY_MAP: Record<string, number> = {
  '10places.json': 10,
  '18places.json': 18,
  '22places.json': 22,
} as const;

// Reverse mapping: capacity to config name for O(1) lookup
const CAPACITY_TO_CONFIG_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(SEAT_CAPACITY_MAP).map(([config, capacity]) => [capacity, config]),
);

// Default seat capacity when configuration is not found
export const DEFAULT_SEAT_CAPACITY = 18;
export const DEFAULT_CONFIG_NAME = '18places.json';

/**
 * Gets the seat capacity based on the configuration name
 * @param configName - The configuration file name (e.g., '10places.json', '18places.json', '22places.json')
 * @returns The number of seats for the given configuration
 *
 * @example
 * ```typescript
 * const capacity = getSeatCapacity('10places.json'); // returns 10
 * const capacity = getSeatCapacity('22places.json'); // returns 22
 * const capacity = getSeatCapacity('unknown.json'); // returns 18 (default)
 * ```
 */
export const getSeatCapacity = (configName: string): number => {
  return SEAT_CAPACITY_MAP[configName] ?? SEAT_CAPACITY_MAP[DEFAULT_CONFIG_NAME];
};

/**
 * Gets the configuration name from seat capacity
 * @param capacity - The seat capacity number
 * @returns The configuration name or null if not found
 *
 * @example
 * ```typescript
 * const configName = getConfigNameByCapacity(10); // returns '10places.json'
 * const configName = getConfigNameByCapacity(15); // returns null (not supported)
 * ```
 */
export const getConfigNameByCapacity = (capacity: number): string | null => {
  return CAPACITY_TO_CONFIG_MAP[capacity] ?? CAPACITY_TO_CONFIG_MAP[DEFAULT_SEAT_CAPACITY];
};

/**
 * Maps Seat entities to SeatConfig format for use with KrafterViewer
 * @param seats Array of Seat entities
 * @returns Array of SeatConfig objects
 *
 * @example
 * ```typescript
 * const seats: Seat[] = [{ id: 1, seatNum: 'A1' }, { id: 2, seatNum: 'B2' }];
 * const seatConfigs = mapSeatsToSeatConfigs(seats);
 * // Returns: [{ id: 1, row: 'A', column: 1, hide: false, disable: false, position: 'A1' }]
 * ```
 */
export const mapSeatsToSeatConfigs = (seats?: Seat[]): SeatConfig[] =>
  seats?.map(seat => {
    return {
      id: Number(seat.seatNum),
      row: seat.position.charAt(0),
      column: Number.parseInt(seat.position.slice(1)),
      position: seat.position,
      disable: false,
      hide: false,
    };
  }) ?? [];

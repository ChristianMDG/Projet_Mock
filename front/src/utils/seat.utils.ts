import { Seat } from '@/models/Seat';
import { CrafterConfig, SeatConfig } from '@/types/type.props';
import config10places from '@/10places.json';
import config18places from '@/18places.json';
import config22places from '@/22places.json';

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
    const pos = seat?.position ?? '';
    return {
      id: seat?.seatNum ? Number(seat.seatNum) : 0,
      row: pos ? pos.charAt(0) : '',
      column: pos ? (Number.parseInt(pos.slice(1)) ?? 0) : 0,
      position: pos,
      disable: false,
      hide: false,
    };
  }) ?? [];

export const SEAT_GRID_LIMITS = {
  MIN_ROWS: 1,
  MAX_ROWS: 8,
  MIN_COLUMNS: 1,
  MAX_COLUMNS: 6,
} as const;

const DEFAULT_CONFIG_MAP: Record<string, CrafterConfig> = {
  '10places.json': config10places as CrafterConfig,
  '18places.json': config18places as CrafterConfig,
  '22places.json': config22places as CrafterConfig,
};

export const getDefaultSeatConfig = (configName?: string): CrafterConfig => {
  const fileName = configName ?? DEFAULT_CONFIG_NAME;
  return DEFAULT_CONFIG_MAP[fileName] ?? DEFAULT_CONFIG_MAP[DEFAULT_CONFIG_NAME];
};

export const DRIVER_SEAT_POSITION = 'A1';
export const NON_EDITABLE_SEAT_POSITIONS: readonly string[] = ['A1', 'A2'];

export const isNonEditableSeat = (seat?: Pick<SeatConfig, 'position'>): boolean =>
  !!seat?.position && NON_EDITABLE_SEAT_POSITIONS.includes(seat.position);

export const countVisibleSeats = (config: CrafterConfig): number =>
  config.seats.flat().filter(seat => !seat.hide).length;

export const countUsableSeats = (config: CrafterConfig): number =>
  config.seats.flat().filter(seat => !seat.hide && !seat.disable).length;

export const buildSeatConfig = (rows: number, columns: number, previous?: CrafterConfig): CrafterConfig => {
  const seats: SeatConfig[][] = [];
  let id = 1;
  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    const rowSeats: SeatConfig[] = [];
    for (let c = 1; c <= columns; c++) {
      const previousSeat = previous?.seats[r]?.[c - 1];
      rowSeats.push({
        id,
        row: rowLetter,
        column: c,
        hide: previousSeat?.hide ?? false,
        disable: previousSeat?.disable ?? false,
        position: `${rowLetter}${c}`,
      });
      id++;
    }
    seats.push(rowSeats);
  }
  const config: CrafterConfig = {
    configType: `${rows}x${columns}`,
    rows,
    columns,
    totalSeats: 0,
    seats,
  };
  config.totalSeats = countVisibleSeats(config);
  return config;
};

export const cycleSeatState = (seat: SeatConfig): Pick<SeatConfig, 'hide' | 'disable'> => {
  const isEnabled = !seat.hide && !seat.disable;
  const isHidden = seat.hide && !seat.disable;
  if (isEnabled) return { hide: true, disable: false };
  if (isHidden) return { hide: false, disable: true };
  return { hide: false, disable: false };
};

export const updateSeatInConfig = (
  config: CrafterConfig,
  seatId: number,
  patch: Pick<SeatConfig, 'hide' | 'disable'>,
): CrafterConfig => {
  const seats = config.seats.map(row => row.map(seat => (seat.id === seatId ? { ...seat, ...patch } : seat)));
  const next: CrafterConfig = { ...config, seats };
  next.totalSeats = countVisibleSeats(next);
  return next;
};

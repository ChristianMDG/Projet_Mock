export interface SeatConfig {
  id: number;
  row: string;
  column: number;
  hide: boolean;
  disable: boolean;
  position: string;
}

export interface CrafterConfig {
  configType: string;
  rows: number;
  columns: number;
  totalSeats: number;
  seats: SeatConfig[][];
}

export const config10places: CrafterConfig = {
  configType: '4x3',
  rows: 4,
  columns: 3,
  totalSeats: 10,
  seats: [
    [
      { id: 1, row: 'A', column: 1, hide: false, disable: false, position: 'A1' },
      { id: 2, row: 'A', column: 2, hide: true, disable: false, position: 'A2' },
      { id: 3, row: 'A', column: 3, hide: false, disable: false, position: 'A3' },
    ],
    [
      { id: 4, row: 'B', column: 1, hide: false, disable: false, position: 'B1' },
      { id: 5, row: 'B', column: 2, hide: false, disable: false, position: 'B2' },
      { id: 6, row: 'B', column: 3, hide: false, disable: false, position: 'B3' },
    ],
    [
      { id: 7, row: 'C', column: 1, hide: false, disable: false, position: 'C1' },
      { id: 8, row: 'C', column: 2, hide: false, disable: false, position: 'C2' },
      { id: 9, row: 'C', column: 3, hide: false, disable: false, position: 'C3' },
    ],
    [
      { id: 10, row: 'D', column: 1, hide: false, disable: false, position: 'D1' },
      { id: 11, row: 'D', column: 2, hide: false, disable: false, position: 'D2' },
      { id: 12, row: 'D', column: 3, hide: false, disable: false, position: 'D3' },
    ],
  ],
};

export const config18places: CrafterConfig = {
  configType: '5x4',
  rows: 5,
  columns: 4,
  totalSeats: 18,
  seats: [
    [
      { id: 1, row: 'A', column: 1, hide: false, disable: true, position: 'A1' },
      { id: 2, row: 'A', column: 2, hide: true, disable: true, position: 'A2' },
      { id: 3, row: 'A', column: 3, hide: false, disable: false, position: 'A3' },
      { id: 4, row: 'A', column: 4, hide: false, disable: false, position: 'A4' },
    ],
    [
      { id: 5, row: 'B', column: 1, hide: false, disable: false, position: 'B1' },
      { id: 6, row: 'B', column: 2, hide: false, disable: false, position: 'B2' },
      { id: 7, row: 'B', column: 3, hide: false, disable: false, position: 'B3' },
      { id: 8, row: 'B', column: 4, hide: false, disable: false, position: 'B4' },
    ],
    [
      { id: 9, row: 'C', column: 1, hide: false, disable: false, position: 'C1' },
      { id: 10, row: 'C', column: 2, hide: false, disable: false, position: 'C2' },
      { id: 11, row: 'C', column: 3, hide: false, disable: false, position: 'C3' },
      { id: 12, row: 'C', column: 4, hide: false, disable: false, position: 'C4' },
    ],
    [
      { id: 13, row: 'D', column: 1, hide: false, disable: false, position: 'D1' },
      { id: 14, row: 'D', column: 2, hide: false, disable: false, position: 'D2' },
      { id: 15, row: 'D', column: 3, hide: false, disable: false, position: 'D3' },
      { id: 16, row: 'D', column: 4, hide: false, disable: false, position: 'D4' },
    ],
    [
      { id: 17, row: 'E', column: 1, hide: false, disable: false, position: 'E1' },
      { id: 18, row: 'E', column: 2, hide: false, disable: false, position: 'E2' },
      { id: 19, row: 'E', column: 3, hide: false, disable: false, position: 'E3' },
      { id: 20, row: 'E', column: 4, hide: false, disable: false, position: 'E4' },
    ],
  ],
};

export const config22places: CrafterConfig = {
  configType: '6x4',
  rows: 6,
  columns: 4,
  totalSeats: 22,
  seats: [
    [
      { id: 1, row: 'A', column: 1, hide: false, disable: true, position: 'A1' },
      { id: 2, row: 'A', column: 2, hide: true, disable: true, position: 'A2' },
      { id: 3, row: 'A', column: 3, hide: false, disable: false, position: 'A3' },
      { id: 4, row: 'A', column: 4, hide: false, disable: false, position: 'A4' },
    ],
    [
      { id: 5, row: 'B', column: 1, hide: false, disable: false, position: 'B1' },
      { id: 6, row: 'B', column: 2, hide: false, disable: false, position: 'B2' },
      { id: 7, row: 'B', column: 3, hide: false, disable: false, position: 'B3' },
      { id: 8, row: 'B', column: 4, hide: false, disable: false, position: 'B4' },
    ],
    [
      { id: 9, row: 'C', column: 1, hide: false, disable: false, position: 'C1' },
      { id: 10, row: 'C', column: 2, hide: false, disable: false, position: 'C2' },
      { id: 11, row: 'C', column: 3, hide: false, disable: false, position: 'C3' },
      { id: 12, row: 'C', column: 4, hide: false, disable: false, position: 'C4' },
    ],
    [
      { id: 13, row: 'D', column: 1, hide: false, disable: false, position: 'D1' },
      { id: 14, row: 'D', column: 2, hide: false, disable: false, position: 'D2' },
      { id: 15, row: 'D', column: 3, hide: false, disable: false, position: 'D3' },
      { id: 16, row: 'D', column: 4, hide: false, disable: false, position: 'D4' },
    ],
    [
      { id: 17, row: 'E', column: 1, hide: false, disable: false, position: 'E1' },
      { id: 18, row: 'E', column: 2, hide: false, disable: false, position: 'E2' },
      { id: 19, row: 'E', column: 3, hide: false, disable: false, position: 'E3' },
      { id: 20, row: 'E', column: 4, hide: false, disable: false, position: 'E4' },
    ],
    [
      { id: 21, row: 'F', column: 1, hide: false, disable: false, position: 'F1' },
      { id: 22, row: 'F', column: 2, hide: false, disable: false, position: 'F2' },
      { id: 23, row: 'F', column: 3, hide: false, disable: false, position: 'F3' },
      { id: 24, row: 'F', column: 4, hide: false, disable: false, position: 'F4' },
    ],
  ],
};

export const getConfigByCapacity = (capacity: number): CrafterConfig => {
  switch (capacity) {
    case 10:
      return config10places;
    case 22:
      return config22places;
    case 18:
    default:
      return config18places;
  }
};

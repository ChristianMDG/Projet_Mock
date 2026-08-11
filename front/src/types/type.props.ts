import type { Koperative } from '@/models/Koperative';
import { Ville } from '@/models/Ville';
import { KoperativeFilter } from './type.util';

export interface KoperativeFormDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Koperative>;
}

export interface VilleSelectionListProps {
  villes: Ville[];
  checkedVilles: number[];
  handleToggle: (id: number) => () => void;
}

export interface KoperativeFilterProps {
  filter: KoperativeFilter;
  isLoading: boolean;
  setKoperativeFilter: (filter: Partial<KoperativeFilter>) => void;
  onReset: () => void;
  onAdd: () => void;
}

// Crafter configuration types
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

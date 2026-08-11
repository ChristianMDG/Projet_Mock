export interface Chauffeur {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  isAvailable: boolean;
  photoUrl?: string;
  user?: Record<string, unknown>;
  koperative?: { id: number };
}

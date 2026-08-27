import { Voyage } from '@/models/Voyage';
import { Voyageur } from '@/models/Voyageur';
import { Reservation } from '@/models/Reservation';

/**
 * Base interface for all reservation form components
 */
export interface ReservationFormProps {
  voyage: Voyage;
  selectedSeats: number[];
  onSuccess: (reservation: Reservation) => void;
  onError?: (error: string) => void;
  showSeatsDisplay?: boolean;
}

/**
 * Props for desktop reservation form (modal/card)
 */
export interface ReservationFormCardProps {
  voyage: Voyage;
  selectedSeats: number[];
  onClose: () => void;
  onSuccess?: (reservationCode: string) => void;
}

/**
 * Props for mobile reservation form (drawer)
 */
export interface ReservationFormDrawerProps {
  open: boolean;
  onClose: () => void;
  voyage: Voyage;
  selectedSeats: number[];
}

/**
 * Data structure for reservation creation
 */
export interface ReservationCreateData {
  voyage: Voyage;
  selectedSeats: number[] | string;
  userForm: UserFormData;
  foundUser: Voyageur | null;
  notes: string;
  status?: string;
}

/**
 * User form data interface (re-exported for convenience)
 */
export interface UserFormData {
  firstName: string;
  lastName: string;
  phone: string;
  idNumber: string;
}

/**
 * Selected seats display props
 */
export interface SelectedSeatsProps {
  selectedSeats: number[] | string;
  voyage: Voyage;
  classe?: { id: number; name: string; description?: string };
}

/**
 * Form state interface for internal use
 */
export interface ReservationFormState {
  foundUser: Voyageur | null;
  userForm: UserFormData;
  notes: string;
  loading: boolean;
  error: string | null;
  success: string | null;
}

/**
 * Form handlers interface
 */
export interface ReservationFormHandlers {
  handleUserFound: (user: Voyageur | null) => void;
  handleSearchValueChange: (searchValue: string) => void;
  handleCreateReservation: () => Promise<void>;
  resetForm: () => void;
}

/**
 * Validation result interface
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: string[];
  missingFields: string[];
}

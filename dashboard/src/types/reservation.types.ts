// Reservation Status Enum
export enum ReservationStatusEnum {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  CANCELLED_BY_OPERATOR = 'CANCELLED_BY_OPERATOR',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

// Payment Status Enum
export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
}

// Status display labels (Translation keys)
export const ReservationStatusLabels: Record<ReservationStatusEnum, string> = {
  [ReservationStatusEnum.PENDING_PAYMENT]: 'enum_reservation_status_pending_payment',
  [ReservationStatusEnum.CONFIRMED]: 'enum_reservation_status_confirmed',
  [ReservationStatusEnum.CANCELLED_BY_USER]: 'enum_reservation_status_cancelled_by_user',
  [ReservationStatusEnum.CANCELLED_BY_OPERATOR]: 'enum_reservation_status_cancelled_by_operator',
  [ReservationStatusEnum.COMPLETED]: 'enum_reservation_status_completed',
  [ReservationStatusEnum.NO_SHOW]: 'enum_reservation_status_no_show',
};

export const PaymentStatusLabels: Record<PaymentStatusEnum, string> = {
  [PaymentStatusEnum.PENDING]: 'enum_payment_status_pending',
  [PaymentStatusEnum.PAID]: 'enum_payment_status_paid',
  [PaymentStatusEnum.FAILED]: 'enum_payment_status_failed',
  [PaymentStatusEnum.REFUNDED]: 'enum_payment_status_refunded',
  [PaymentStatusEnum.PARTIALLY_PAID]: 'enum_payment_status_partially_paid',
};

// Voyageur (Traveler) interface
export interface Voyageur {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
}

// Voyage interface
export interface Voyage {
  id: number;
  departureCity?: string;
  arrivalCity?: string;
  departureDate?: string;
}

// Seat interface
export interface Seat {
  id: number;
  seatNumber: string;
}

// Facturation (Billing) interface
export interface Facturation {
  id: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: PaymentStatusEnum;
}

// Main Reservation interface
export interface Reservation {
  id: number;
  voyage?: Voyage;
  voyageur?: Voyageur;
  seats?: Seat[];
  bookingReference: string;
  status: ReservationStatusEnum;
  bookingDate: string;
  totalAmount: number;
  notes?: string;
  facturation?: Facturation;
  createdAt?: string;
  updatedAt?: string;
}

// Filter configuration
export interface ReservationFilters {
  status?: ReservationStatusEnum | '';
  paymentStatus?: PaymentStatusEnum | '';
  searchQuery?: string;
  phoneNumber?: string;
  bookingReference?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Sort configuration
export interface ReservationSortConfig {
  field: keyof Reservation;
  direction: 'asc' | 'desc';
}

// Pagination configuration
export interface ReservationPagination {
  page: number;
  pageSize: number;
  total: number;
}

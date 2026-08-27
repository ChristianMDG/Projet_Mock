// Rental Types (Backend-sourced only - see design.md's naming-decision note:
// this Vehicle type has exactly one source, the backend, so it is not unified
// with the CMS-shaped Vehicle/VehicleResponse types in cms.types.ts)

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  category: string;
  seats: number;
  volumeUtility?: number;
  pricePerDay: number;
  imageUrl?: string;
  available: boolean;
  agencyLocation: string;
  transmission?: string | null;
  fuel?: string | null;
}

export interface DriverInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface RentalReservationCreateRequest {
  vehicleId: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  driverName: string;
  driverPhone: string;
  driverEmail: string;
}

export interface RentalReservation {
  id: number;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'PAYMENT_FAILED' | 'CANCELLED';
  bookingReference: string | null;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
}

export interface RentalPaymentInitiateRequest {
  phoneNumber: string;
  paymentMethod: 'MOBILE_MONEY';
}

export interface RentalPaymentInitiationResponse {
  transactionReference: string;
  paymentUrl: string | null;
  status: string;
  operatorName: string;
}

export enum CheckoutStep {
  DRIVER_INFO = 'driver-info',
  PAYMENT = 'payment',
  TRACKING = 'tracking',
  CONFIRMATION = 'confirmation',
}

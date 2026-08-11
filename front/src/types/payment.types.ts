// Payment-specific types

export interface PaymentFormData {
  amount: number;
  paymentMethod: string;
  phoneNumber?: string;
  reservationIds: number[];
}

export interface ReservationSummary {
  voyageId: number;
  selectedSeats: string[];
  totalAmount: number;
  voyageDetails: {
    departure: string;
    arrival: string;
    departureTime: string;
    koperativeName: string;
  };
}

import { Voyageur } from '@/models/Voyageur';
import { Reservation } from '@/models/Reservation';
import { Voyage } from '@/models/Voyage';
import { Seat } from '@/models/Seat';
import { ReservationStatusEnum, SeatStatusEnum } from '@/models/enums';
import type { UserFormData } from '@/types/user.type';
import { createReservation } from '@/api/reservation.api';
import { formatBookingDate, generateBookingReference } from '@/utils/reservation.utils';
import { Crafter } from '@/types';

export interface ReservationCreateData {
  voyage: Voyage;
  selectedSeats: Seat[];
  userForm: UserFormData;
  notes?: string;
  status?: ReservationStatusEnum;
  upsertVoyageur: (data: UserFormData) => Promise<Voyageur>;
}

export const createReservationHandler = async ({
  voyage,
  selectedSeats,
  userForm,
  notes = '',
  status = ReservationStatusEnum.PENDING_PAYMENT,
  upsertVoyageur,
}: ReservationCreateData): Promise<Reservation> => {
  // Note: Will be removed when Voyageur and Account are unified properly
  const voyageur = userForm.id ? { id: userForm.id } : await upsertVoyageur(userForm);

  const totalAmount = selectedSeats.length * (voyage.pricePerSeat ?? 0);
  const minimalSeats = selectedSeats.map((s: Seat) => ({
    seatNum: s.seatNum,
    seatStatus: s.seatStatus ?? SeatStatusEnum.RESERVED,
    position: s.position,
    voyage: { id: voyage.id } as Voyage,
    crafter: voyage.crafter?.id ? ({ id: voyage.crafter.id } as Crafter) : undefined,
  })) as Seat[];

  return createReservation({
    voyage: { id: voyage.id } as Voyage,
    voyageur: { id: voyageur.id } as Voyageur,
    seats: minimalSeats,
    seatCount: selectedSeats.length,
    bookingReference: generateBookingReference(),
    totalAmount,
    status,
    bookingDate: formatBookingDate(),
    notes,
  });
};

export const getEmptyUserForm = (): UserFormData => ({
  firstName: '',
  lastName: '',
  phone: '',
  idNumber: '',
});

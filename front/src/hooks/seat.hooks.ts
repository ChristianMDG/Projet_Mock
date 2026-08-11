import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Voyage } from '@/models/Voyage';
import { Seat } from '@/models/Seat';
import { SeatConfig } from '@/types/type.props';
import { mapSeatStatusToDisplay, SeatStatus } from '@/components/seats/constants';
import { seatApi } from '@/api/seat.api';
import { SeatStatusEnum } from '@/models/enums';

interface UseSeatManagementProps {
  voyage?: Voyage;
  selectedSeats?: SeatConfig[];
  onSelectSeat?: (seatConfig: SeatConfig) => void;
  multiSelect?: boolean;
}

interface UseSeatManagementReturn {
  selected: SeatConfig[];
  seats: Seat[];
  loading: boolean;
  error: string | null;
  getSeatStatus: (seatNumber: number) => SeatStatus;
  handleSeatClick: (seatConfig: SeatConfig) => void;
  clearSelection: () => void;
  availableSeatsCount: number;
  reservedSeatsCount: number;
}

export const useSeatManagement = ({
  voyage,
  selectedSeats = [],
  onSelectSeat,
}: UseSeatManagementProps): UseSeatManagementReturn => {
  const { data: seats = [], isLoading: loading, error: queryError } = useVoyageSeats(voyage?.id ?? 0);

  const error = queryError ? 'error_loading_seats' : null;
  const availableSeatsCount = seats.filter((seat: Seat) => seat.seatStatus === SeatStatusEnum.AVAILABLE).length;
  const reservedSeatsCount = seats.filter((seat: Seat) => seat.seatStatus === SeatStatusEnum.RESERVED).length;

  const getSeatStatus = useCallback(
    (seatNumber: number): SeatStatus => {
      if (selectedSeats.some(seatConfig => seatConfig.id === seatNumber)) return 'selected';

      const seat = seats.find((s: Seat) => Number.parseInt(s.seatNum) === seatNumber);
      return seat ? mapSeatStatusToDisplay(seat.seatStatus) : 'available';
    },
    [selectedSeats, seats],
  );

  const handleSeatClick = useCallback(
    (seatConfig: SeatConfig) => {
      const seatNumber = seatConfig.id;
      const status = getSeatStatus(seatNumber);

      if (['reserved', 'blocked', 'damaged'].includes(status)) return;

      onSelectSeat?.(seatConfig);
    },
    [getSeatStatus, onSelectSeat],
  );

  const clearSelection = useCallback(() => {
    // This is now handled by the parent component through the store
  }, []);

  return {
    selected: selectedSeats,
    seats,
    loading,
    error,
    getSeatStatus,
    handleSeatClick,
    clearSelection,
    availableSeatsCount,
    reservedSeatsCount,
  };
};

// Query Keys
export const SEAT_ENTITY_KEYS = {
  all: ['seat-entities'] as const,
  byVoyage: (voyageId: number) => [...SEAT_ENTITY_KEYS.all, 'voyage', voyageId] as const,
  byVoyageAndReservation: (voyageId: number, reservationId: number) =>
    [...SEAT_ENTITY_KEYS.all, 'voyage', voyageId, 'reservation', reservationId] as const,
  byReservation: (reservationId: number) => [...SEAT_ENTITY_KEYS.all, 'reservation', reservationId] as const,
  available: (voyageId: number) => [...SEAT_ENTITY_KEYS.byVoyage(voyageId), 'available'] as const,
  reserved: (voyageId: number) => [...SEAT_ENTITY_KEYS.byVoyage(voyageId), 'reserved'] as const,
  count: (voyageId: number) => [...SEAT_ENTITY_KEYS.byVoyage(voyageId), 'count'] as const,
  detail: (id: number) => [...SEAT_ENTITY_KEYS.all, 'detail', id] as const,
};

export const useVoyageSeats = (voyageId: number) => {
  return useQuery({
    queryKey: SEAT_ENTITY_KEYS.byVoyage(voyageId),
    queryFn: () => seatApi.getByVoyageId(voyageId),
    enabled: !!voyageId,
  });
};

export const useSeatsByVoyageAndReservation = (voyageId?: number, reservationId?: number) => {
  return useQuery<Seat[], Error>({
    queryKey:
      voyageId && reservationId
        ? SEAT_ENTITY_KEYS.byVoyageAndReservation(voyageId, reservationId)
        : ['seats', 'disabled'],
    queryFn: () => seatApi.getByVoyageAndReservation(voyageId!, reservationId!),
    enabled: !!voyageId && !!reservationId,
    staleTime: 30_000,
  });
};

export const useSeatsByReservation = (reservationId?: number) => {
  return useQuery<Seat[], Error>({
    queryKey: reservationId ? SEAT_ENTITY_KEYS.byReservation(reservationId) : ['seats', 'disabled'],
    queryFn: () => seatApi.getByReservationId(reservationId!),
    enabled: !!reservationId,
    staleTime: 30_000,
  });
};

export const useAvailableSeats = (voyageId: number) => {
  return useQuery({
    queryKey: SEAT_ENTITY_KEYS.available(voyageId),
    queryFn: () => seatApi.getAvailableSeats(voyageId),
    enabled: !!voyageId,
  });
};

export const useReservedSeats = (voyageId: number) => {
  return useQuery({
    queryKey: SEAT_ENTITY_KEYS.reserved(voyageId),
    queryFn: () => seatApi.getReservedSeats(voyageId),
    enabled: !!voyageId,
  });
};

export const useAvailableSeatsCount = (voyageId: number) => {
  return useQuery({
    queryKey: SEAT_ENTITY_KEYS.count(voyageId),
    queryFn: () => seatApi.getAvailableSeatsCount(voyageId),
    enabled: !!voyageId,
  });
};

export const useSeat = (id: number) => {
  return useQuery({
    queryKey: SEAT_ENTITY_KEYS.detail(id),
    queryFn: () => seatApi.getById(id),
    enabled: !!id,
  });
};

export const useInitializeSeats = () => {
  const queryClient = useQueryClient();

  return useMutation<Seat[], Error, { voyageId: number; crafterId: number }>({
    mutationFn: ({ voyageId, crafterId }: { voyageId: number; crafterId: number }) => {
      return seatApi.initializeSeats(voyageId, crafterId);
    },
    onSuccess: async (_: Seat[], { voyageId }: { voyageId: number; crafterId: number }) => {
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(voyageId) });
    },
  });
};

export const useCreateSeat = () => {
  const queryClient = useQueryClient();

  return useMutation<Seat, Error, Seat>({
    mutationFn: (seat: Seat) => seatApi.create(seat),
    onSuccess: async (newSeat: Seat) => {
      if (newSeat.voyage?.id) {
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(newSeat.voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(newSeat.voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(newSeat.voyage.id) });
      }
    },
  });
};

export const useUpdateSeatStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Seat, Error, { seatId: number; status: SeatStatusEnum }>({
    mutationFn: ({ seatId, status }: { seatId: number; status: SeatStatusEnum }) => {
      return seatApi.updateStatus(seatId, status);
    },
    onSuccess: async (updatedSeat: Seat) => {
      if (updatedSeat.voyage?.id) {
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(updatedSeat.voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(updatedSeat.voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(updatedSeat.voyage.id) });
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(updatedSeat.voyage.id) });
      }
      if (updatedSeat.id) {
        await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.detail(updatedSeat.id) });
      }
    },
  });
};

export const useReserveSeat = () => {
  const queryClient = useQueryClient();

  return useMutation<Seat, Error, { voyageId: number; seatNumber: number }>({
    mutationFn: ({ voyageId, seatNumber }: { voyageId: number; seatNumber: number }) => {
      return seatApi.reserveSeat(voyageId, seatNumber);
    },
    onSuccess: async (_: Seat, { voyageId }: { voyageId: number; seatNumber: number }) => {
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(voyageId) });
    },
  });
};

export const useReleaseSeat = () => {
  const queryClient = useQueryClient();

  return useMutation<Seat, Error, { voyageId: number; seatNumber: number }>({
    mutationFn: ({ voyageId, seatNumber }: { voyageId: number; seatNumber: number }) => {
      return seatApi.releaseSeat(voyageId, seatNumber);
    },
    onSuccess: async (_: Seat, { voyageId }: { voyageId: number; seatNumber: number }) => {
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(voyageId) });
    },
  });
};

export const useReleaseSeatsByReservation = () => {
  const queryClient = useQueryClient();

  return useMutation<Seat[], Error, { voyageId: number; reservationId: number }>({
    mutationFn: ({ voyageId, reservationId }: { voyageId: number; reservationId: number }) => {
      return seatApi.releaseSeatsByReservation(voyageId, reservationId);
    },
    onSuccess: async (_: Seat[], { voyageId, reservationId }: { voyageId: number; reservationId: number }) => {
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.byVoyage(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.available(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.reserved(voyageId) });
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.count(voyageId) });
      await queryClient.invalidateQueries({
        queryKey: SEAT_ENTITY_KEYS.byVoyageAndReservation(voyageId, reservationId),
      });
    },
  });
};

export const useDeleteSeat = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => seatApi.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: SEAT_ENTITY_KEYS.all });
    },
  });
};

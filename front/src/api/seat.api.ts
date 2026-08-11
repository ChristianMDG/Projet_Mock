import api from './axios';
import { Seat } from '@/models/Seat';
import { SeatStatusEnum } from '@/models/enums';

/**
 * Optimized API calls for seat management
 */
export const seatApi = {
  /**
   * Get seats for a specific voyage (optimized - only essential data)
   */
  getByVoyageId: async (voyageId: number) => {
    const response = await api.get(`/seats/voyage/${voyageId}`);
    return response.data;
  },

  /**
   * Get a specific seat by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/seats/${id}`);
    return response.data;
  },

  /**
   * Create a new seat
   */
  create: async (seatData: Partial<Seat>) => {
    const response = await api.post('/seats', seatData);
    return response.data;
  },

  /**
   * Update an existing seat
   */
  update: async (id: number, seatData: Partial<Seat>) => {
    const response = await api.put(`/seats/${id}`, seatData);
    return response.data;
  },

  /**
   * Delete a seat
   */
  delete: async (id: number) => {
    await api.delete(`/seats/${id}`);
  },

  /**
   * Update seat status
   */
  updateStatus: async (id: number, status: SeatStatusEnum) => {
    const response = await api.patch(`/seats/${id}/status`, { status });
    return response.data;
  },

  /**
   * Get available seats for a voyage
   */
  getAvailableSeats: async (voyageId: number) => {
    const response = await api.get(`/seats/voyage/${voyageId}/available`);
    return response.data;
  },

  /**
   * Get reserved seats for a voyage
   */
  getReservedSeats: async (voyageId: number) => {
    const response = await api.get(`/seats/voyage/${voyageId}/reserved`);
    return response.data;
  },

  /**
   * Get seats for a voyage belonging to a reservation
   */
  getByVoyageAndReservation: async (voyageId: number, reservationId: number) => {
    const response = await api.get(`/seats/voyage/${voyageId}/reservation/${reservationId}`);
    return response.data;
  },

  /**
   * Get all seats for a specific reservation
   */
  getByReservationId: async (reservationId: number) => {
    const response = await api.get(`/seats/reservation/${reservationId}`);
    return response.data;
  },

  /**
   * Get available seats count for a voyage
   */
  getAvailableSeatsCount: async (voyageId: number) => {
    const response = await api.get(`/seats/voyage/${voyageId}/available/count`);
    return response.data;
  },

  /**
   * Initialize seats for a voyage
   */
  initializeSeats: async (voyageId: number, crafterId: number) => {
    const response = await api.post(`/seats/voyage/${voyageId}/initialize`, { crafterId });
    return response.data;
  },

  /**
   * Reserve a seat
   */
  reserveSeat: async (voyageId: number, seatNumber: number) => {
    const response = await api.patch(`/seats/voyage/${voyageId}/seat/${seatNumber}/reserve`);
    return response.data;
  },

  /**
   * Release a seat
   */
  releaseSeat: async (voyageId: number, seatNumber: number) => {
    const response = await api.patch(`/seats/voyage/${voyageId}/seat/${seatNumber}/release`);
    return response.data;
  },

  /**
   * Release all seats for a reservation
   */
  releaseSeatsByReservation: async (voyageId: number, reservationId: number) => {
    const response = await api.patch(`/seats/voyage/${voyageId}/reservation/${reservationId}/release`);
    return response.data;
  },
};

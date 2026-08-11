import api from './axios';
import type { Reservation } from '@/types/reservation.types';

export interface RouteStats {
  name: string;
  count: number;
  revenue: number;
}

export interface DashboardStats {
  // Reservations
  totalReservations: number;
  confirmedCount: number;
  pendingCount: number;
  cancelledCount: number;
  completedCount: number;
  noShowCount: number;
  totalRevenue: number;
  recentReservations: Reservation[];
  // Voyages
  totalVoyages: number;
  scheduledVoyages: number;
  ongoingVoyages: number;
  completedVoyages: number;
  cancelledVoyages: number;
  // Koperatives
  totalKoperatives: number;
  activeKoperatives: number;
  // User Statistics
  connectedWebSocketUsers?: number;
  // Chart data
  reservationStatusDistribution: Record<string, number>;
  voyageStatusDistribution: Record<string, number>;
  routeStats: RouteStats[];
}

export const fetchDashboardData = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>('/dashboard/stats');
  return data;
};

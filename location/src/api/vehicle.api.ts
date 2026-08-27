import axiosInstance from './axios';
import { Vehicle } from '@/types/rental.types';

export const getVehicles = async (): Promise<Vehicle[]> => {
  const { data } = await axiosInstance.get<Vehicle[]>('/api/rental/vehicles');
  return data;
};

export const getVehiclesByCategory = async (category: string): Promise<Vehicle[]> => {
  const { data } = await axiosInstance.get<Vehicle[]>(`/api/rental/vehicles/category/${encodeURIComponent(category)}`);
  return data;
};

export const getVehicleById = async (id: Vehicle['id']): Promise<Vehicle> => {
  const { data } = await axiosInstance.get<Vehicle>(`/api/rental/vehicles/${id}`);
  return data;
};

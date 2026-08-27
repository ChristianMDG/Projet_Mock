import { useQuery } from '@tanstack/react-query';

import { Vehicle } from '@/types/rental.types';
import { getVehicles, getVehiclesByCategory, getVehicleById } from '../api/vehicle.api';

export const useVehicles = (category?: string) => {
  return useQuery({
    queryKey: ['vehicles', category],
    queryFn: () => (category ? getVehiclesByCategory(category) : getVehicles()),
    retry: false,
  });
};

export const useVehicle = (id: Vehicle['id'] | undefined) => {
  return useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => getVehicleById(id!),
    enabled: !!id,
    retry: false,
  });
};

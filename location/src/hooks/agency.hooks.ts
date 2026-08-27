import { useQuery } from '@tanstack/react-query';
import { Agency } from '@/types/cms.types';
import { getAgencies, getAgencyById } from '../api/agency.api';

export const useAgencies = () => {
  return useQuery({
    queryKey: ['agencies'],
    queryFn: getAgencies,
  });
};

export const useAgency = (id: Agency['id'] | undefined) => {
  return useQuery({
    queryKey: ['agency', id],
    queryFn: () => getAgencyById(id!),
    enabled: !!id,
  });
};

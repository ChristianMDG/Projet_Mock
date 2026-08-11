import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useVoyageSearchStore, VoyageSearchState } from '@/stores/voyage-search.store';
import { useVilles } from '@/hooks/ville.hooks';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import { confirmReservationWithoutVoyageur, ReservationWithoutVoyageurRequest } from '@/api/reservation.api';
import { useAuthStore } from '@/stores/auth.store';

export const useReservation = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { setSearchParams } = useVoyageSearchStore();
  const { data: villes = [], isLoading } = useVilles();

  const handleRouteReservation = (route: string) => {
    // Parse the route (e.g., "FIANARANTSOA - ANTANANARIVO")
    const parts = route.split('-').map(part => part.trim());
    if (parts.length === 2) {
      const [departureVilleName, arrivalVilleName] = parts;

      // Find corresponding cities in the list
      const departureVille = villes.find(ville => ville.name?.toUpperCase() === departureVilleName.toUpperCase());
      const arrivalVille = villes.find(ville => ville.name?.toUpperCase() === arrivalVilleName.toUpperCase());

      // Update store with found cities
      const newParams: Partial<VoyageSearchState> = {};
      if (departureVille) newParams.fromVille = departureVille;
      if (arrivalVille) newParams.toVille = arrivalVille;

      if (Object.keys(newParams).length > 0) {
        setSearchParams(newParams);
      }

      // Redirect to home page to display search
      navigate(ROUTES.home[i18n.language]);
    }
  };

  return {
    isLoading,
    handleRouteReservation,
  };
};

export const useConfirmReservationWithoutVoyageur = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (request: ReservationWithoutVoyageurRequest) => confirmReservationWithoutVoyageur(request),
    onSuccess: (_data, variables) => {
      // Invalidate all reservations
      queryClient.invalidateQueries({ queryKey: ['reservations'] });

      // Invalidate voyage-specific reservations
      if (variables.voyageId) {
        queryClient.invalidateQueries({ queryKey: ['reservations', 'voyage', variables.voyageId] });

        // Invalidate voyage seats
        queryClient.invalidateQueries({ queryKey: ['seat-entities', 'voyage', variables.voyageId] });
        queryClient.invalidateQueries({ queryKey: ['seat-entities', 'voyage', variables.voyageId, 'available'] });
        queryClient.invalidateQueries({ queryKey: ['seat-entities', 'voyage', variables.voyageId, 'reserved'] });
        queryClient.invalidateQueries({ queryKey: ['seat-entities', 'voyage', variables.voyageId, 'count'] });
      }
    },
  });

  const canConfirmWithoutVoyageur =
    user?.authorities?.some(auth => auth.name === 'ADMIN' || auth.name === 'OPERATOR') ?? false;

  return {
    confirmReservation: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    canConfirmWithoutVoyageur,
  };
};

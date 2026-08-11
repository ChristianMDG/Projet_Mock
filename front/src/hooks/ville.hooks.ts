import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ville } from '@/models/Ville';
import { createVille, deleteVille, getVilleByKeyword, getVilles, updateVille } from '@/api/ville.api';

// Fetch all villes
export function useVilles() {
  return useQuery<Ville[], Error>({
    queryKey: ['villes'],
    queryFn: getVilles,
  });
}

// Create a ville
export function useCreateVille() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ville: Partial<Ville>) => createVille(ville),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['villes'] });
    },
  });
}

// Update a ville
export function useUpdateVille() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ville }: { id: number; ville: Partial<Ville> }) => updateVille(id, ville),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['villes'] });
    },
  });
}

// Delete a ville
export function useDeleteVille() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVille(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['villes'] });
    },
  });
}

/**
 * Détecte la ville de l'utilisateur via la géolocalisation du navigateur.
 * Utilise Nominatim (OpenStreetMap) pour le reverse geocoding – gratuit, pas de clé API.
 * Le nom de la ville retourné est dans la langue du navigateur (Accept-Language automatique).
 * Ce nom est ensuite recherché via le endpoint /api/villes/search?keyword=.
 */
export function useDetectedVille() {
  const [detectedVille, setDetectedVille] = useState<Ville | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      setIsDetecting(true);

      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
              { headers: { 'Accept-Language': navigator.language } },
            );
            const { address } = await res.json();
            const cityName = address?.city ?? address?.town ?? address?.village ?? '';
            console.log('Géolocalisation réussie, adresse:', address, ', ville détectée:', cityName);

            if (cityName) {
              const villes = await getVilleByKeyword(cityName);
              if (villes.length > 0) setDetectedVille(villes[0]);
            }
          } catch (error) {
            console.error('Erreur lors de la géolocalisation:', error);
            // géolocalisation est optionnelle
          } finally {
            setIsDetecting(false);
          }
        },
        () => setIsDetecting(false),
        { timeout: 8000, maximumAge: 300_000 },
      );
    }
  }, []);

  return { detectedVille, isDetecting };
}

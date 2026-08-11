import { Voyageur } from '@/models/Voyageur';
import { UserFormData } from '@/components/forms';

export const populateVoyageur = (voyageur: Voyageur): UserFormData => ({
  id: voyageur.id,
  firstName: voyageur.firstName ?? '',
  lastName: voyageur.lastName ?? '',
  phone: voyageur.phone ?? '',
  email: voyageur.email ?? '',
  idNumber: voyageur.idNumber ?? '',
  address: voyageur.address ?? '',
});

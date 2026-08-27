import { useState, useCallback } from 'react';

import { useKoperatives } from '@/hooks/koperative.hooks';
import { useVillesByKoperativeId } from '@/hooks/ville.hooks';
import { useCreateOperator } from '@/hooks/operator.hooks';
import { useCreateGuichet } from '@/hooks/guichet.hooks';
import { UserOperator } from '@/models/UserOperator';
import { Koperative } from '@/models/Koperative';
import { Gare } from '@/models/Gare';
import { Ville } from '@/models/Ville';

export interface GuichetFormState {
  koperative: Koperative | null;
  ville: Ville | null;
  gare: Gare | null;
  smsPhone: string;
  numeroMvola: string;
  numeroAirtelMoney: string;
  numeroOrangeMoney: string;
  openingHours: string;
}

export interface UseGuichetRegistrationFormProps {
  registeredUser: UserOperator;
  onSuccess: () => void;
}

const buildGuichetName = (user: UserOperator, villeName?: string): string => {
  if (villeName) {
    return `Guichet ${villeName}`;
  }
  const fallbackName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.phone;
  return `Guichet ${fallbackName}`.trim();
};

export const useGuichetRegistrationForm = ({ registeredUser, onSuccess }: UseGuichetRegistrationFormProps) => {
  const [formState, setFormState] = useState<GuichetFormState>({
    koperative: null,
    ville: null,
    gare: null,
    smsPhone: registeredUser.phone ?? '',
    numeroMvola: '',
    numeroAirtelMoney: '',
    numeroOrangeMoney: '',
    openingHours: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: koperatives = [], isLoading: koperativesLoading } = useKoperatives();

  const koperativeId = formState.koperative?.id;
  const { data: villes = [], isLoading: villesLoading } = useVillesByKoperativeId(koperativeId);

  const createOperator = useCreateOperator();
  const createGuichet = useCreateGuichet(koperativeId ?? 0);

  const isFormValid = Boolean(formState.koperative);

  const handleKoperativeChange = useCallback((koperative: Koperative | null) => {
    setFormState(prev => ({ ...prev, koperative, ville: null, gare: null }));
  }, []);

  const handleVilleChange = useCallback((ville: Ville | null) => {
    setFormState(prev => ({ ...prev, ville, gare: null }));
  }, []);

  const handleGareChange = useCallback((gare: Gare | null) => {
    setFormState(prev => ({ ...prev, gare }));
  }, []);

  const handleTextChange = useCallback(
    (field: keyof GuichetFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState(prev => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (loading || !formState.koperative || !formState.gare) return;

    setLoading(true);
    setError(null);

    try {
      const selectedVille = formState.ville;
      const guichetName = buildGuichetName(registeredUser, selectedVille?.name);

      // 1. Create Guichet
      const guichetPayload = {
        name: guichetName,
        koperative: { id: formState.koperative.id },
        gare: { id: formState.gare.id } as Gare,
        phones: registeredUser.phone,
        smsPhone: formState.smsPhone.trim(),
        numeroMvola: formState.numeroMvola.trim(),
        numeroAirtelMoney: formState.numeroAirtelMoney.trim(),
        numeroOrangeMoney: formState.numeroOrangeMoney.trim(),
        openingHours: formState.openingHours.trim(),
        isActive: false,
      };

      const createdGuichet = await createGuichet.mutateAsync(guichetPayload);

      // 2. Create Operator and assign Guichet
      const operatorPayload: Partial<UserOperator> = {
        lastName: registeredUser.lastName ?? '',
        firstName: registeredUser.firstName ?? '',
        email: registeredUser.email ?? '',
        phone: registeredUser.phone ?? '',
        username: registeredUser.phone ?? '',
        password: registeredUser.password ?? '',
        idNumber: registeredUser.idNumber ?? '',
        isActive: false,
        koperative: { id: formState.koperative.id },
        guichets: [createdGuichet],
        withKoperative: true,
      };

      await createOperator.mutateAsync(operatorPayload);
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, [loading, formState, registeredUser, createOperator, createGuichet, onSuccess]);

  return {
    formState,
    loading,
    error,
    koperatives,
    koperativesLoading,
    villes,
    villesLoading,
    isFormValid,
    handleKoperativeChange,
    handleVilleChange,
    handleGareChange,
    handleTextChange,
    handleSubmit,
  };
};

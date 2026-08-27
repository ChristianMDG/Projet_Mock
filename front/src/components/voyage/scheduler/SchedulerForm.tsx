import React, { useMemo } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from '@/utils/dayjs';
import { Ville } from '@/models/Ville';
import { RecurrenceTypeEnum, VoyageTypeEnum } from '@/models/enums';
import { Voyage, VoyageManager } from '@/models/Voyage';
import { useScheduleVoyage, useUpdateVoyage } from '@/hooks/voyage.hooks';
import { useGares } from '@/hooks/gare.hooks';
import { useClassesByKoperative } from '@/hooks/classe.hooks';
import { useGetCraftersByKoperative } from '@/hooks/crafter.hooks';
import { useChauffeursByKoperative } from '@/hooks/chauffeur.hooks';
import { Classe } from '@/models/Classe';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import VoyageSchedulerForm from './VoyageSchedulerForm';

export interface ClasseEntry {
  classe: Classe | null;
  priceKoperative: number;
  availableSeats: number;
  crafter: Crafter | null;
  chauffeur: Chauffeur | null;
}

const validationSchema = Yup.object({
  classeEntries: Yup.array()
    .of(
      Yup.object({
        priceKoperative: Yup.number().required().min(0),
        classe: Yup.object().nullable(),
        availableSeats: Yup.number().required().min(1).max(50),
        crafter: Yup.object().nullable().required(),
        chauffeur: Yup.object().nullable().required(),
      }),
    )
    .min(1),
  departureGare: Yup.object().nullable().required(),
  arrivalGare: Yup.object().nullable().required(),
  departureTime: Yup.string().required(),
  pourcentageMinimumAvance: Yup.number().min(0, 'Min 0%').max(100, 'Max 100%').default(0),
  recurrenceStartDate: Yup.string().when('recurrenceType', {
    is: (type: string) => type !== RecurrenceTypeEnum.ONE_OFF,
    then: schema => schema.required(),
  }),
  recurrenceEndDate: Yup.string().when('recurrenceType', {
    is: (type: string) => type !== RecurrenceTypeEnum.ONE_OFF,
    then: schema => schema.required(),
  }),
});

export interface SchedulerFormProps {
  onClose: () => void;
  koperativeId: number;
  initialData?: Partial<Voyage>;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
  onSuccess?: (voyages: Voyage[]) => void;
}

const SchedulerForm: React.FC<SchedulerFormProps> = ({
  onClose,
  koperativeId,
  initialData,
  departureVille,
  arrivalVille,
  onSuccess,
}) => {
  const scheduleVoyage = useScheduleVoyage();
  const updateVoyage = useUpdateVoyage();

  const { data: gares = [] } = useGares();
  const { data: classes = [] } = useClassesByKoperative(koperativeId);
  const { data: crafters = [] } = useGetCraftersByKoperative(koperativeId);
  const { data: chauffeurs = [] } = useChauffeursByKoperative(koperativeId);

  const isEditMode = Boolean(initialData?.id);

  const filteredDepartureGares = useMemo(
    () => (departureVille ? gares.filter(g => g.ville?.id === departureVille.id) : gares),
    [gares, departureVille],
  );

  const filteredArrivalGares = useMemo(
    () => (arrivalVille ? gares.filter(g => g.ville?.id === arrivalVille.id) : gares),
    [gares, arrivalVille],
  );

  const initialValues = {
    classeEntries: [
      {
        classe: initialData?.classe as Classe | null,
        priceKoperative: initialData?.priceKoperative ?? 0,
        availableSeats: initialData?.availableSeats ?? 18,
        crafter: initialData?.crafter as Crafter | null,
        chauffeur: initialData?.chauffeur as Chauffeur | null,
      },
    ] as ClasseEntry[],
    description: initialData?.description ?? '',
    pourcentageMinimumAvance: initialData?.pourcentageMinimumAvance ?? 0,
    departureGare: initialData?.departureGare ?? null,
    arrivalGare: initialData?.arrivalGare ?? null,
    departureTime: initialData?.departureTime ?? dayjs().tz('Indian/Antananarivo').add(1, 'hour').toISOString(),
    estimatedArrivalTime: initialData?.estimatedArrivalTime ?? '',
    recurrenceType: initialData?.recurrenceType ?? RecurrenceTypeEnum.ONE_OFF,
    customInterval: initialData?.customInterval ?? 1,
    koperative: initialData?.koperative ?? { id: koperativeId },
    recurrenceStartDate: initialData?.recurrenceStartDate ?? dayjs().tz('Indian/Antananarivo').format('YYYY-MM-DD'),
    recurrenceEndDate:
      initialData?.recurrenceEndDate ?? dayjs().tz('Indian/Antananarivo').add(3, 'months').format('YYYY-MM-DD'),
    selectedWeekdays: VoyageManager.parseWeekdays(initialData?.weekdays) ?? [],
    selectedMonthlyDates: VoyageManager.parseMonthlyDates(initialData?.monthlyDates) ?? [],
    typeVoyage: initialData?.typeVoyage ?? VoyageTypeEnum.NATIONAL,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    const sharedData = {
      departureGare: values.departureGare ?? undefined,
      arrivalGare: values.arrivalGare ?? undefined,
      description: values.description,
      pourcentageMinimumAvance: Number(values.pourcentageMinimumAvance ?? 0),
      departureTime: values.departureTime,
      estimatedArrivalTime: values.estimatedArrivalTime || undefined,
      koperative: values.koperative,
      recurrenceType: values.recurrenceType,
      customInterval: values.customInterval,
      typeVoyage: values.typeVoyage,
    };

    const recurrenceExtra =
      values.recurrenceType !== RecurrenceTypeEnum.ONE_OFF
        ? {
            weekdays: values.selectedWeekdays.length > 0 ? values.selectedWeekdays : undefined,
            monthlyDates: values.selectedMonthlyDates.length > 0 ? values.selectedMonthlyDates : undefined,
            recurrenceStartDate: values.recurrenceStartDate,
            recurrenceEndDate: values.recurrenceEndDate,
          }
        : {};

    try {
      const defaultCrafter = crafters[0];
      const defaultChauffeur = chauffeurs[0];

      if (isEditMode && initialData?.id) {
        const entry = values.classeEntries[0];

        const voyageData: Partial<Voyage> = {
          ...sharedData,
          classe: entry?.classe ?? undefined,
          priceKoperative: entry?.priceKoperative ?? 0,
          availableSeats: entry?.availableSeats ?? 18,
          crafter: entry?.crafter ?? defaultCrafter,
          chauffeur: entry?.chauffeur ?? defaultChauffeur,
        };

        const updatedVoyage = await updateVoyage.mutateAsync({ id: initialData.id, voyage: voyageData });
        onSuccess?.([updatedVoyage]);
      } else {
        const allCreated: Voyage[] = [];
        // If cooperative has no classes, we schedule the entries anyway.
        // If there are classes, we only schedule entries with a selected class.
        const validEntries =
          classes.length > 0
            ? values.classeEntries.filter(entry => entry.classe?.id && entry.classe.id > 0)
            : values.classeEntries;

        for (const entry of validEntries) {
          const voyageData: Partial<Voyage> = {
            ...sharedData,
            classe: entry.classe ?? undefined,
            priceKoperative: entry.priceKoperative,
            availableSeats: entry.availableSeats,
            crafter: entry.crafter ?? defaultCrafter,
            chauffeur: entry.chauffeur ?? defaultChauffeur,
          };
          const scheduleData = VoyageManager.toScheduleFormat(voyageData, recurrenceExtra);
          const voyages = await scheduleVoyage.mutateAsync(scheduleData);
          allCreated.push(...voyages);
        }
        onSuccess?.(allCreated);
      }
      onClose();
    } catch (error) {
      console.error('❌ [SchedulerForm] Error saving voyage:', error);
    }
  };

  const currentError = scheduleVoyage.error ?? updateVoyage.error;
  const isLoading = scheduleVoyage.isPending || updateVoyage.isPending;

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      <Form>
        <VoyageSchedulerForm
          filteredDepartureGares={filteredDepartureGares}
          filteredArrivalGares={filteredArrivalGares}
          classes={classes}
          isEditMode={isEditMode}
          isLoading={isLoading}
          currentError={currentError}
          onClose={onClose}
          departureVille={departureVille}
          arrivalVille={arrivalVille}
          koperativeId={koperativeId}
        />
      </Form>
    </Formik>
  );
};

export default SchedulerForm;

import React, { useMemo } from 'react';
import { SwipeableDrawer } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from '@/utils/dayjs';
import { Ville } from '@/models/Ville';
import { RecurrenceTypeEnum } from '@/models/enums';
import { Voyage, VoyageManager } from '@/models/Voyage';
import { useScheduleVoyage, useUpdateVoyage } from '@/hooks/voyage.hooks';
import { useGares } from '@/hooks/gare.hooks';
import { useGetCraftersByKoperative } from '@/hooks/crafter.hooks';
import { useChauffeursByKoperative } from '@/hooks/chauffeur.hooks';
import { useClassesByKoperative } from '@/hooks/classe.hooks';
import { Classe } from '@/models/Classe';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import VoyageSchedulerForm from './VoyageSchedulerForm';

export interface ClasseEntry {
  classe: Classe | null;
  pricePerSeat: number;
  availableSeats: number;
  crafter: Crafter | null;
  chauffeur: Chauffeur | null;
}

// Validation Schema
const validationSchema = Yup.object({
  classeEntries: Yup.array()
    .of(
      Yup.object({
        pricePerSeat: Yup.number().required().min(0),
        classe: Yup.object().nullable(),
        availableSeats: Yup.number().required().min(1).max(50),
        crafter: Yup.object().nullable(),
        chauffeur: Yup.object().nullable(),
      }),
    )
    .min(1),
  departureGare: Yup.object().nullable().required(),
  arrivalGare: Yup.object().nullable().required(),
  departureTime: Yup.string().required(),
  recurrenceStartDate: Yup.string().when('recurrenceType', {
    is: (type: string) => type !== RecurrenceTypeEnum.ONE_OFF,
    then: schema => schema.required(),
  }),
  recurrenceEndDate: Yup.string().when('recurrenceType', {
    is: (type: string) => type !== RecurrenceTypeEnum.ONE_OFF,
    then: schema => schema.required(),
  }),
});

interface SchedulerFormDrawerProps {
  open: boolean;
  onClose: () => void;
  koperativeId: number;
  initialData?: Partial<Voyage>;
  departureVille?: Ville | null;
  arrivalVille?: Ville | null;
  onSuccess?: (voyages: Voyage[]) => void;
}

const SchedulerFormDrawer: React.FC<SchedulerFormDrawerProps> = ({
  open,
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
  const { data: crafters = [] } = useGetCraftersByKoperative(koperativeId);
  const { data: chauffeurs = [] } = useChauffeursByKoperative(koperativeId);
  const { data: classes = [] } = useClassesByKoperative(koperativeId);

  const isEditMode = Boolean(initialData?.id);

  // Filter gares by ville
  const filteredDepartureGares = useMemo(
    () => (departureVille ? gares.filter(g => g.ville?.id === departureVille.id) : gares),
    [gares, departureVille],
  );

  const filteredArrivalGares = useMemo(
    () => (arrivalVille ? gares.filter(g => g.ville?.id === arrivalVille.id) : gares),
    [gares, arrivalVille],
  );

  // Initial form values
  const initialValues = {
    classeEntries: [
      {
        classe: (initialData?.classe ?? null) as Classe | null,
        pricePerSeat: initialData?.pricePerSeat ?? 0,
        availableSeats: initialData?.availableSeats ?? 12,
        crafter: (initialData?.crafter ?? null) as Crafter | null,
        chauffeur: (initialData?.chauffeur ?? null) as Chauffeur | null,
      },
    ] as ClasseEntry[],
    description: initialData?.description ?? '',
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
  };

  // Form submission
  const handleSubmit = async (values: typeof initialValues) => {
    const sharedData = {
      departureGare: values.departureGare ?? undefined,
      arrivalGare: values.arrivalGare ?? undefined,
      description: values.description,
      departureTime: values.departureTime,
      estimatedArrivalTime: values.estimatedArrivalTime || undefined,
      koperative: values.koperative,
      recurrenceType: values.recurrenceType,
      customInterval: values.customInterval,
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
      if (isEditMode && initialData?.id) {
        const entry = values.classeEntries[0];
        const voyageData: Partial<Voyage> = {
          ...sharedData,
          classe: entry?.classe ?? undefined,
          pricePerSeat: entry?.pricePerSeat ?? 0,
          availableSeats: entry?.availableSeats ?? 12,
          crafter: entry?.crafter ?? undefined,
          chauffeur: entry?.chauffeur ?? undefined,
        };
        const updatedVoyage = await updateVoyage.mutateAsync({ id: initialData.id, voyage: voyageData });
        onSuccess?.([updatedVoyage]);
      } else {
        const allCreated: Voyage[] = [];
        for (const entry of values.classeEntries) {
          const voyageData: Partial<Voyage> = {
            ...sharedData,
            classe: entry.classe ?? undefined,
            pricePerSeat: entry.pricePerSeat,
            availableSeats: entry.availableSeats,
            crafter: entry.crafter ?? undefined,
            chauffeur: entry.chauffeur ?? undefined,
          };
          const scheduleData = VoyageManager.toScheduleFormat(voyageData, recurrenceExtra);
          const voyages = await scheduleVoyage.mutateAsync(scheduleData);
          allCreated.push(...voyages);
        }
        onSuccess?.(allCreated);
      }
      onClose();
    } catch (error) {
      console.error('Error saving voyage:', error);
    }
  };

  const currentError = scheduleVoyage.error ?? updateVoyage.error;
  const isLoading = scheduleVoyage.isPending || updateVoyage.isPending;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={false}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%' },
          maxWidth: 875,
          margin: '0 auto',
          bgcolor: 'inherit',
        },
      }}
    >
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
            crafters={crafters}
            chauffeurs={chauffeurs}
            classes={classes}
            isEditMode={isEditMode}
            isLoading={isLoading}
            currentError={currentError}
            onClose={onClose}
            departureVille={departureVille}
            arrivalVille={arrivalVille}
          />
        </Form>
      </Formik>
    </SwipeableDrawer>
  );
};

export default SchedulerFormDrawer;

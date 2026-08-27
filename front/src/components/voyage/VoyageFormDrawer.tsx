import React, { useMemo } from 'react';
import { Box, Button, SwipeableDrawer, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Labels from '@/labelKeys.json';
import { RecurrenceTypeEnum, VoyageStatusEnum } from '@/models/enums';
import { Voyage, VoyageManager } from '@/models/Voyage';
import { Gare } from '@/models/Gare';
import { Crafter } from '@/models/Crafter';
import { Chauffeur } from '@/models/Chauffeur';
import { Koperative } from '@/models/Koperative';
import { useTheme } from '@mui/material/styles';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useGares } from '@/hooks/gare.hooks';
import { useGetCraftersByKoperative } from '@/hooks/crafter.hooks';
import { useChauffeursByKoperative } from '@/hooks/chauffeur.hooks';
import { useClassesByKoperative } from '@/hooks/classe.hooks';
import { Classe } from '@/models/Classe';
import VoyageFormFields from './VoyageFormFields';

interface VoyageFormDrawerProps {
  open: boolean;
  onClose: () => void;
  voyage?: Partial<Voyage> | null;
  onSubmit: (voyage: Partial<Voyage>) => void;
  isLoading?: boolean;
  koperativeId?: number;
}

interface VoyageFormValues {
  id?: number;
  description: string;
  departureGareId: number | '';
  arrivalGareId: number | '';
  departureTime: string;
  estimatedArrivalTime: string;
  availableSeats: number | '';
  priceKoperative: number | '';
  crafterId: number | '';
  chauffeurId: number | '';
  classeId: number | '';
  status: VoyageStatusEnum;
  recurrenceType: RecurrenceTypeEnum;
  customInterval: number | '';
  selectedWeekdays: number[];
  selectedMonthlyDates: number[];
  recurrenceStartDate: string;
  recurrenceEndDate: string;
  isTemplate: boolean;
}

const createVoyageValidationSchema = (t: (key: string) => string) =>
  Yup.object({
    description: Yup.string().trim().required(t(Labels.field_required)),
    departureGareId: Yup.number().required(t(Labels.field_required)),
    arrivalGareId: Yup.number().required(t(Labels.field_required)),
    departureTime: Yup.string().required(t(Labels.field_required)),
    availableSeats: Yup.number().min(1, t(Labels.voyage_validation_seats_min)).required(t(Labels.field_required)),
    priceKoperative: Yup.number().min(1, t(Labels.voyage_validation_price_min)).required(t(Labels.field_required)),
    crafterId: Yup.number().required(t(Labels.field_required)),
    chauffeurId: Yup.number().required(t(Labels.field_required)),
    selectedWeekdays: Yup.array().when('recurrenceType', {
      is: RecurrenceTypeEnum.WEEKLY,
      then: schema => schema.min(1, t(Labels.voyage_validation_weekday_required)),
    }),
    selectedMonthlyDates: Yup.array().when('recurrenceType', {
      is: RecurrenceTypeEnum.MONTHLY,
      then: schema => schema.min(1, t(Labels.voyage_validation_monthly_date_required)),
    }),
    customInterval: Yup.number()
      .transform((value, originalValue) => (originalValue === '' ? undefined : value))
      .optional()
      .nullable()
      .when('recurrenceType', {
        is: RecurrenceTypeEnum.CUSTOM,
        then: schema => schema.min(1, t(Labels.voyage_validation_interval_min)).required(t(Labels.field_required)),
      }),
  });

const VoyageFormDrawer: React.FC<VoyageFormDrawerProps> = ({
  open,
  onClose,
  voyage,
  onSubmit,
  isLoading = false,
  koperativeId,
}) => {
  console.log('🚪 [VoyageFormDrawer] rendered - open:', open, 'voyage:', voyage);
  const { t } = useTranslation();
  const theme = useTheme();

  // Memoize validation schema with translations
  const validationSchema = useMemo(() => createVoyageValidationSchema(t), [t]);

  // Fetch data for dropdowns
  const { data: gares = [] } = useGares();
  const { data: crafters = [] } = useGetCraftersByKoperative(koperativeId ?? 0);
  const { data: chauffeurs = [] } = useChauffeursByKoperative(koperativeId ?? 0);
  const { data: classes = [] } = useClassesByKoperative(koperativeId);

  const initialValues = useMemo<VoyageFormValues>(() => {
    if (voyage) {
      return {
        id: voyage.id,
        description: voyage.description ?? '',
        departureGareId: voyage.departureGare?.id ?? '',
        arrivalGareId: voyage.arrivalGare?.id ?? '',
        departureTime: voyage.departureTime ?? '',
        estimatedArrivalTime: voyage.estimatedArrivalTime ?? '',
        availableSeats: voyage.availableSeats ?? '',
        priceKoperative: voyage.priceKoperative ?? '',
        crafterId: voyage.crafter?.id ?? '',
        chauffeurId: voyage.chauffeur?.id ?? '',
        classeId: voyage.classe?.id ?? '',
        status: voyage.status ?? VoyageStatusEnum.SCHEDULED,
        recurrenceType: voyage.recurrenceType ?? RecurrenceTypeEnum.ONE_OFF,
        customInterval: voyage.customInterval ?? '',
        selectedWeekdays: VoyageManager.parseWeekdays(voyage.weekdays),
        selectedMonthlyDates: VoyageManager.parseMonthlyDates(voyage.monthlyDates),
        recurrenceStartDate: voyage.recurrenceStartDate ?? '',
        recurrenceEndDate: voyage.recurrenceEndDate ?? '',
        isTemplate: voyage.isTemplate ?? false,
      };
    }
    return {
      description: '',
      departureGareId: '',
      arrivalGareId: '',
      departureTime: '',
      estimatedArrivalTime: '',
      availableSeats: '',
      priceKoperative: '',
      crafterId: '',
      chauffeurId: '',
      classeId: '',
      status: VoyageStatusEnum.SCHEDULED,
      recurrenceType: RecurrenceTypeEnum.ONE_OFF,
      customInterval: '',
      selectedWeekdays: [],
      selectedMonthlyDates: [],
      recurrenceStartDate: '',
      recurrenceEndDate: '',
      isTemplate: false,
    };
  }, [voyage]);

  const handleFormSubmit = (values: VoyageFormValues) => {
    console.warn('📋 [VoyageFormDrawer] Form submitted with values:', values);

    const submissionData: Partial<Voyage> = {
      id: values.id,
      koperative: { id: koperativeId } as Koperative,
      departureGare: values.departureGareId ? ({ id: values.departureGareId } as Gare) : undefined,
      arrivalGare: values.arrivalGareId ? ({ id: values.arrivalGareId } as Gare) : undefined,
      departureTime: values.departureTime,
      estimatedArrivalTime: values.estimatedArrivalTime || undefined,
      availableSeats: values.availableSeats as number,
      priceKoperative: values.priceKoperative as number,
      crafter: values.crafterId ? ({ id: values.crafterId } as Crafter) : undefined,
      chauffeur: values.chauffeurId ? ({ id: values.chauffeurId } as Chauffeur) : undefined,
      classe: values.classeId ? ({ id: values.classeId } as Classe) : undefined,
      status: values.status,
      description: values.description,
      recurrenceType: values.recurrenceType,
      customInterval: values.customInterval ? (values.customInterval as number) : undefined,
      isTemplate: values.isTemplate,
      weekdays: values.selectedWeekdays.length > 0 ? JSON.stringify(values.selectedWeekdays) : undefined,
      monthlyDates: values.selectedMonthlyDates.length > 0 ? JSON.stringify(values.selectedMonthlyDates) : undefined,
      recurrenceStartDate: values.recurrenceStartDate || undefined,
      recurrenceEndDate: values.recurrenceEndDate || undefined,
    };
    onSubmit(submissionData);
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: '500px', md: '600px' },
            maxWidth: '100vw',
          },
        },
      }}
    >
      <Box sx={{ p: theme.spacing(2) }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2">
            {voyage?.id ? t(Labels.voyage_edit_schedule) : t(Labels.voyage_schedule_new)}
          </Typography>
          <Button onClick={onClose} color="inherit">
            {t(Labels.ui_cancel)}
          </Button>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize
        >
          <Form>
            <VoyageFormFields
              onClose={onClose}
              isLoading={isLoading}
              gares={gares}
              crafters={crafters}
              chauffeurs={chauffeurs}
              classes={classes}
            />
          </Form>
        </Formik>
      </Box>
    </SwipeableDrawer>
  );
};

export default VoyageFormDrawer;

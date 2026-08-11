import React from 'react';
import { SwipeableDrawer } from '@mui/material';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Colis } from '@/models/Colis';
import { useUpdateColis, useCreateColis } from '@/hooks/colis.hooks';
import { useGetCraftersByKoperative } from '@/hooks/crafter.hooks';
import ColisSchedulerForm from './ColisSchedulerForm'; // Create a separate form component for the colis fields
import { Voyage } from '@/models/Voyage';

// Validation Schema for Colis
const validationSchema = Yup.object({
  senderName: Yup.string().required('Sender name is required').max(100),
  senderPhone: Yup.string().required('Sender phone is required').min(10).max(13),
  recipientName: Yup.string().required('Recipient name is required').max(100),
  recipientPhone: Yup.string().required('Recipient phone is required').min(10).max(13),
  description: Yup.string().max(500),
  type: Yup.string().nullable(),
  content: Yup.string().max(500),
  estimatedValue: Yup.number().nullable().min(0),
  weight: Yup.number().required('Weight is required').min(0.1),
  price: Yup.number().required('Price is required').min(0),
  status: Yup.string().required('Status is required'),
  crafterId: Yup.number().nullable(),
  reservation: Yup.object().nullable(),
});

interface ColisSchedulerFormDrawerProps {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<Colis>;
  onSuccess?: (colis: Colis[]) => void;
  koperativeId: number;
  voyage?: Voyage | null;
}

const ColisSchedulerFormDrawer: React.FC<ColisSchedulerFormDrawerProps> = ({
  open,
  onClose,
  initialData,
  onSuccess,
  koperativeId,
  voyage,
}: ColisSchedulerFormDrawerProps) => {
  const createColis = useCreateColis();
  const updateColis = useUpdateColis();

  const { data: crafters = [] } = useGetCraftersByKoperative(koperativeId);
  const isEditMode = Boolean(initialData?.id);

  // Initial form values
  const initialValues = {
    senderName: initialData?.senderName ?? '',
    senderPhone: initialData?.senderPhone ?? '',
    recipientName: initialData?.recipientName ?? '',
    recipientPhone: initialData?.recipientPhone ?? '',
    description: initialData?.description ?? '',
    type: initialData?.type ?? '',
    content: initialData?.content ?? '',
    estimatedValue: initialData?.estimatedValue ?? 0,
    weight: initialData?.weight ?? 1.0,
    price: initialData?.price ?? 0.0,
    status: initialData?.status ?? 'REGISTERED',
    crafterId: initialData?.crafter?.id ?? '',
    reservation: initialData?.reservation ?? null,
    voyageId: voyage?.id ?? null,
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const colisData: Colis = {
        ...values,
        crafter: values.crafterId ? crafters.find(c => c.id === values.crafterId) : undefined,
        reservation: values.reservation ?? undefined,
        voyageId: values.voyageId ?? undefined,
      };

      if (isEditMode && initialData?.id) {
        const updatedColis = await updateColis.mutateAsync({ id: initialData.id, colis: colisData });
        onSuccess?.([updatedColis]);
      } else {
        const newColis = await createColis.mutateAsync(colisData);
        onSuccess?.([newColis]);
      }

      onClose(); // Close the drawer after submitting
    } catch (error) {
      console.error('Error saving colis:', error);
    }
  };

  const currentError = createColis.error ?? updateColis.error;
  const isLoading = createColis.isPending || updateColis.isPending;

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
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
          <ColisSchedulerForm
            crafters={crafters}
            isEditMode={isEditMode}
            isLoading={isLoading}
            currentError={currentError}
            onClose={onClose}
          />
        </Form>
      </Formik>
    </SwipeableDrawer>
  );
};

export default ColisSchedulerFormDrawer;

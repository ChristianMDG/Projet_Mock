import React, { useEffect } from 'react';
import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import LocalShipping from '@mui/icons-material/LocalShipping';
import Payment from '@mui/icons-material/Payment';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import { StyledIcon } from '@/components/ui';
import VilleAutocomplete from '@/components/shared/VilleAutocomplete';
import FormTextField from '@/components/inputs/FormTextField';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useCartStore } from '@/stores/cart.store';
import { useTombanaFee } from '@/hooks/delivery.hooks';
import { formatPrice } from './utils';
import Labels from '@/labelKeys.json';

interface DeliveryInfoProps {
  onBack: () => void;
  onContinue: () => void;
}

interface DeliveryInfoFormValues {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
}

interface DeliveryInfoFieldsProps {
  onBack: () => void;
}

/**
 * Renders the delivery form fields. Extracted so it can use `useFormikContext`
 * and sync form values back into `useCheckoutStore` in real time, keeping the
 * store as the single source of truth for checkout persistence (Requirement 29).
 */
const DeliveryInfoFields: React.FC<DeliveryInfoFieldsProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { values } = useFormikContext<DeliveryInfoFormValues>();

  const deliveryDestination = useCheckoutStore(state => state.deliveryDestination);
  const setDeliveryDestination = useCheckoutStore(state => state.setDeliveryDestination);
  const setRecipientName = useCheckoutStore(state => state.setRecipientName);
  const setRecipientPhone = useCheckoutStore(state => state.setRecipientPhone);
  const setShippingAddress = useCheckoutStore(state => state.setShippingAddress);
  const items = useCartStore(state => state.items);
  const setDeliveryVoyage = useCartStore(state => state.setDeliveryVoyage);
  const deliveryFee = useCartStore(state => state.getDeliveryFee());

  const totalWeight = items.reduce((acc, item) => acc + (item.product.weight ?? 0.1) * item.quantity, 0);
  const { data: tombana } = useTombanaFee(deliveryDestination?.id, totalWeight);

  useEffect(() => {
    if (deliveryDestination?.id && tombana) {
      setDeliveryVoyage({
        deliveryFee: tombana.frais ?? 5000,
        estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      });
    } else {
      setDeliveryVoyage(null);
    }
  }, [deliveryDestination?.id, tombana, setDeliveryVoyage]);

  useEffect(() => {
    setRecipientName(values.recipientName);
  }, [values.recipientName, setRecipientName]);

  useEffect(() => {
    setRecipientPhone(values.recipientPhone);
  }, [values.recipientPhone, setRecipientPhone]);

  useEffect(() => {
    setShippingAddress(values.shippingAddress);
  }, [values.shippingAddress, setShippingAddress]);

  const hasDeliveryDestination = Boolean(deliveryDestination);
  const hasRecipientName = values.recipientName.trim().length > 0;
  const hasRecipientPhone = values.recipientPhone.trim().length > 0;
  const hasShippingAddress = values.shippingAddress.trim().length > 0;
  const canProceedToPayment = hasDeliveryDestination && hasRecipientName && hasRecipientPhone && hasShippingAddress;
  const hasDeliveryFee = hasDeliveryDestination && deliveryFee > 0;

  return (
    <>
      <VilleAutocomplete
        value={deliveryDestination}
        onChange={setDeliveryDestination}
        label={t(Labels.shop_delivery_destination)}
        required
        startIcon={LocalShipping}
      />

      {hasDeliveryFee && (
        <Chip
          icon={<StyledIcon icon={LocalShipping} fontSize="small" />}
          label={`${t(Labels.shop_delivery_fee)}: ${formatPrice(deliveryFee)}`}
          color="primary"
          variant="outlined"
          sx={{ mt: 1.5 }}
        />
      )}

      <Typography variant="h6" sx={{ fontWeight: 600, my: 2 }}>
        {t(Labels.shop_recipient_info)}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormTextField name="recipientName" label={t(Labels.shop_recipient_name)} required />
        <FormTextField name="recipientPhone" label={t(Labels.shop_recipient_phone)} required />
        <FormTextField name="shippingAddress" label={t(Labels.shop_shipping_address)} required multiline rows={2} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={onBack} startIcon={<StyledIcon icon={ArrowBack} />}>
          {t(Labels.shop_go_back)}
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canProceedToPayment}
          type="submit"
          startIcon={<StyledIcon icon={Payment} />}
        >
          {t(Labels.shop_proceed_to_payment)}
        </Button>
      </Box>
    </>
  );
};

/**
 * Step 1 of the checkout flow: collects the delivery destination and recipient
 * information, then advances to the payment step once all required fields are valid.
 */
const DeliveryInfo: React.FC<DeliveryInfoProps> = ({ onBack, onContinue }) => {
  const { t } = useTranslation();
  const recipientName = useCheckoutStore(state => state.recipientName);
  const recipientPhone = useCheckoutStore(state => state.recipientPhone);
  const shippingAddress = useCheckoutStore(state => state.shippingAddress);

  const initialValues: DeliveryInfoFormValues = { recipientName, recipientPhone, shippingAddress };

  const validationSchema = Yup.object({
    recipientName: Yup.string().trim().required(t(Labels.shop_customer_name_required)),
    recipientPhone: Yup.string()
      .matches(/^03[2-9]\d{7}$/, t(Labels.shop_phone_number_invalid_format))
      .required(t(Labels.shop_customer_phone_required)),
    shippingAddress: Yup.string().trim().required(t(Labels.shop_delivery_address_required)),
  });

  const handleSubmit = () => {
    onContinue();
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <StyledIcon icon={LocalShipping} />
        {t(Labels.shop_delivery_title)}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {t(Labels.shop_delivery_description)}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        <Form>
          <DeliveryInfoFields onBack={onBack} />
        </Form>
      </Formik>
    </Paper>
  );
};

export default DeliveryInfo;

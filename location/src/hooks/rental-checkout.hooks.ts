import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Labels from '@/labelKeys.json';
import { useRentalCheckoutStore } from '../stores/rental-checkout.store';
import { CheckoutStep } from '../types/rental.types';

export function useCheckoutStepper() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { step, setStep } = useRentalCheckoutStore();

  const steps = [t(Labels.rental_checkout_step_1), t(Labels.rental_checkout_step_2), t(Labels.rental_checkout_step_3)];

  const activeStep = (() => {
    if (step === CheckoutStep.DRIVER_INFO) return 0;
    if (step === CheckoutStep.PAYMENT) return 1;
    if (step === CheckoutStep.TRACKING) return 2;
    if (step === CheckoutStep.CONFIRMATION) return 3;
    return 0;
  })();

  const handleBack = () => {
    if (step === CheckoutStep.DRIVER_INFO) {
      navigate(-1);
    } else if (step === CheckoutStep.PAYMENT) {
      setStep(CheckoutStep.DRIVER_INFO);
    }
  };

  return { steps, activeStep, handleBack };
}

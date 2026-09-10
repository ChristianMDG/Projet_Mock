import React, { useCallback, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { FormikHelpers } from 'formik';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cart.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import CartReview from '@/components/shop/CartReview';
import DeliveryInfo from '@/components/shop/DeliveryInfo';
import CheckoutProgress from '@/components/shop/CheckoutProgress';
import PaymentMethodSelection from '@/components/shop/PaymentMethodSelection';
import OrderConfirmation from '@/components/shop/OrderConfirmation';
import OrderSummarySidebar from '@/components/shop/OrderSummarySidebar';
import PaymentStatusInline from '@/components/payment/PaymentStatusInline';
import { ROUTES } from '@/constants/routes';
import Labels from '@/labelKeys.json';
import { PaymentMethod, DeliveryMethod } from '@/types/shop-enums.types';
import { MobileMoneyOperatorEnum, PaymentTransactionStatusEnum } from '@/models/enums';
import { useCreateOrder, useInitiateOrderPayment } from '@/hooks/order.hooks';
import { usePaymentWebSocket } from '@/hooks/payment.hooks';
import { useCurrencyFormatter } from '@/utils/currency.utils';
import SEO from '@/components/shared/SEO';
import { trackEvent } from '@/hooks/google-analytics.hook';

const resolveBackendPaymentMethod = (): PaymentMethod => {
  return PaymentMethod.MOBILE_MONEY;
};

const CHECKOUT_STEP_LABELS = [
  Labels.shop_step_cart,
  Labels.shop_step_delivery,
  Labels.shop_step_payment,
  Labels.shop_step_confirmation,
];

const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const { formatAriary } = useCurrencyFormatter();

  const createOrderMutation = useCreateOrder();
  const initiatePaymentMutation = useInitiateOrderPayment();

  const {
    activeStep,
    deliveryDestination,
    recipientName,
    recipientPhone,
    shippingAddress,
    selectedPaymentMethod,
    orderConfirmed,
    paymentError,
    showMobileMoneyStatus,
    mobileMoneyTransactionRef,
    mobileMoneyOperator,
    paymentTotal,
    setActiveStep,
    setSelectedPaymentMethod,
    setPaymentPhone,
    setOrderConfirmed,
    setPaymentError,
    setConfirmedOrderNumber,
    setShowMobileMoneyStatus,
    setMobileMoneyTransactionRef,
    setMobileMoneyOperator,
    setPaymentItems,
    setPaymentSubtotal,
    setPaymentDeliveryFee,
    setPaymentTotal,
    setOrderId,
    resetCheckout,
  } = useCheckoutStore();

  const [currentPaymentStatus, setCurrentPaymentStatus] = useState<PaymentTransactionStatusEnum>(
    PaymentTransactionStatusEnum.INITIATED,
  );

  useEffect(() => {
    trackEvent('checkout_initiated', 'Shop', 'Checkout Initiated');
  }, []);

  useEffect(() => {
    // Reset checkout flow on mount if a previous order was already completed
    if (useCheckoutStore.getState().orderConfirmed) {
      useCheckoutStore.getState().resetCheckout();
    }
  }, []);

  // WebSocket integration for real-time payment updates (same as PaymentPage)
  const { isConnected: wsConnected, lastNotification } = usePaymentWebSocket({
    transactionReference: mobileMoneyTransactionRef,
    enabled: Boolean(mobileMoneyTransactionRef) && showMobileMoneyStatus,
    onSuccess: notification => setCurrentPaymentStatus(notification.status),
    onFailure: notification => setCurrentPaymentStatus(notification.status),
    onTimeout: notification => setCurrentPaymentStatus(notification.status),
  });

  const handleMobileMoneyCompleted = useCallback(() => {
    const cartState = useCartStore.getState();
    const hasCartItems = cartState.items.length > 0;
    if (hasCartItems) {
      setPaymentItems([...cartState.items]);
      setPaymentSubtotal(cartState.getSubtotal());
      setPaymentDeliveryFee(cartState.getDeliveryFee());
      setPaymentTotal(cartState.getTotal());
    }
    clearCart();
    setOrderConfirmed(true);
    setActiveStep(3);
    trackEvent('checkout_step', 'Shop', 'confirmation', 3);
    trackEvent('shop_order_confirmed', 'Shop', selectedPaymentMethod, paymentTotal);
  }, [
    clearCart,
    setOrderConfirmed,
    setActiveStep,
    selectedPaymentMethod,
    paymentTotal,
    setPaymentItems,
    setPaymentSubtotal,
    setPaymentDeliveryFee,
    setPaymentTotal,
  ]);

  useEffect(() => {
    if (currentPaymentStatus === PaymentTransactionStatusEnum.COMPLETED) {
      const id = setTimeout(() => {
        handleMobileMoneyCompleted();
      }, 1500);
      return () => clearTimeout(id);
    }
  }, [currentPaymentStatus, handleMobileMoneyCompleted]);

  const subtotal = getSubtotal();
  const total = getTotal();
  const isBusy = createOrderMutation.isPending || initiatePaymentMutation.isPending;

  const handleSubmitPayment = async (
    values: { paymentMethodId: string; mobileMoneyOperator: MobileMoneyOperatorEnum; phoneNumber: string },
    {
      setSubmitting,
    }: FormikHelpers<{ paymentMethodId: string; mobileMoneyOperator: MobileMoneyOperatorEnum; phoneNumber: string }>,
  ) => {
    setPaymentError(null);
    setSelectedPaymentMethod(values.paymentMethodId);
    setPaymentPhone(values.phoneNumber);

    try {
      const paymentMethod = resolveBackendPaymentMethod();
      const villeId = deliveryDestination?.id;

      if (villeId === undefined) {
        throw new Error(t(Labels.shop_order_payment_error));
      }

      // 1. Create the order in backend
      const order = await createOrderMutation.mutateAsync({
        customerPhone: recipientPhone,
        customerName: recipientName,
        deliveryAddress: shippingAddress,
        villeId,
        paymentMethod,
        deliveryMethod: DeliveryMethod.STANDARD,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
          lineTotal: item.product.price * item.quantity,
          productName: item.product.name,
          productSku: item.product.sku,
        })),
        subtotal,
        total,
      });

      if (order.id) {
        setOrderId(order.id);
        setConfirmedOrderNumber(order.orderNumber ?? String(order.id));

        // 2. Initiate mobile money payment
        const initiated = await initiatePaymentMutation.mutateAsync({
          id: order.id,
          request: {
            paymentMethod,
            phoneNumber: values.phoneNumber,
          },
        });

        const currentDeliveryFee = useCartStore.getState().getDeliveryFee();
        setPaymentItems([...items]);
        setPaymentSubtotal(subtotal);
        setPaymentDeliveryFee(currentDeliveryFee);
        setPaymentTotal(total);

        if (initiated.paymentUrl) {
          clearCart();
          window.location.href = initiated.paymentUrl;
          return;
        }

        // Mobile Money flow — show real-time status tracker
        const transactionRef = initiated.transactionReference ?? null;
        setMobileMoneyTransactionRef(transactionRef);
        setMobileMoneyOperator(values.mobileMoneyOperator);
        setCurrentPaymentStatus(PaymentTransactionStatusEnum.INITIATED);
        setShowMobileMoneyStatus(true);
      } else {
        throw new Error(t(Labels.shop_order_payment_error));
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : t(Labels.shop_order_payment_error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMobileMoneyRetry = useCallback(() => {
    setShowMobileMoneyStatus(false);
    setMobileMoneyTransactionRef(null);
    setMobileMoneyOperator(null);
    setPaymentError(null);
    setCurrentPaymentStatus(PaymentTransactionStatusEnum.INITIATED);
  }, [setShowMobileMoneyStatus, setMobileMoneyTransactionRef, setMobileMoneyOperator, setPaymentError]);

  const hasCartItems = items.length > 0;
  const showEmptyCart = !hasCartItems && !orderConfirmed && activeStep === 0;
  const stepTitle = `${t(Labels.shop_checkout)} - ${t(CHECKOUT_STEP_LABELS[activeStep])}`;

  if (showEmptyCart) {
    return (
      <Container maxWidth="lg" sx={{ px: '0 !important' }}>
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <SEO title={stepTitle} />
          <ShoppingBag sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            {t(Labels.shop_cart_empty)}
          </Typography>
          <Button variant="contained" onClick={() => navigate(ROUTES.shop[i18n.language])}>
            {t(Labels.shop_back_to_shop)}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: '0 !important' }}>
      <Box sx={{ py: { xs: 2, md: 3 } }}>
        <SEO title={stepTitle} />

        {/* Checkout progress tracker */}
        <CheckoutProgress />

        <Grid container spacing={{ xs: 2, md: 3 }}>
          {/* Main content */}
          <Grid size={{ xs: 12, md: 6 }}>
            {/* Step 0: Cart Review */}
            {activeStep === 0 && (
              <CartReview
                onContinue={() => {
                  setActiveStep(1);
                  trackEvent('checkout_step', 'Shop', 'delivery', 1);
                }}
              />
            )}

            {/* Step 1: Delivery */}
            {activeStep === 1 && (
              <DeliveryInfo
                onBack={() => setActiveStep(0)}
                onContinue={() => {
                  const cartState = useCartStore.getState();
                  const hasCartItems = cartState.items.length > 0;
                  if (hasCartItems) {
                    setPaymentItems([...cartState.items]);
                    setPaymentSubtotal(cartState.getSubtotal());
                    setPaymentDeliveryFee(cartState.getDeliveryFee());
                    setPaymentTotal(cartState.getTotal());
                  }
                  setActiveStep(2);
                  trackEvent('checkout_step', 'Shop', 'payment', 2);
                }}
              />
            )}

            {/* Step 2: Payment */}
            {activeStep === 2 && (
              <Box>
                <Card>
                  <CardContent>
                    {showMobileMoneyStatus ? (
                      <Box>
                        <PaymentStatusInline
                          transactionReference={mobileMoneyTransactionRef}
                          wsConnected={wsConnected}
                          lastNotification={lastNotification}
                          operator={
                            (selectedPaymentMethod.toUpperCase() as MobileMoneyOperatorEnum) ||
                            mobileMoneyOperator ||
                            undefined
                          }
                          paymentStatus={currentPaymentStatus}
                          setPaymentStatus={setCurrentPaymentStatus}
                          onRetry={handleMobileMoneyRetry}
                          orderSummary={{
                            total,
                            itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
                            destination: deliveryDestination?.name,
                            formatAmount: formatAriary,
                          }}
                        />
                      </Box>
                    ) : (
                      <PaymentMethodSelection
                        total={total}
                        onBack={() => setActiveStep(1)}
                        onSubmit={handleSubmitPayment}
                        isBusy={isBusy}
                        paymentError={paymentError}
                        onDismissError={() => setPaymentError(null)}
                      />
                    )}
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Step 3: Confirmation */}
            {activeStep === 3 && (
              <OrderConfirmation
                onContinueShopping={() => {
                  resetCheckout();
                  navigate(ROUTES.shop[i18n.language]);
                }}
              />
            )}
          </Grid>

          {/* Order Summary Sidebar */}
          <Grid size={{ xs: 12, md: 6 }}>
            <OrderSummarySidebar />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CheckoutPage;

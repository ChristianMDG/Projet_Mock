import React, { useCallback, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import CheckCircleRounded from '@mui/icons-material/CheckCircleRounded';
import ErrorIcon from '@mui/icons-material/ErrorRounded';
import HourglassEmptyRounded from '@mui/icons-material/HourglassEmptyRounded';
import PhoneAndroidRounded from '@mui/icons-material/PhoneAndroidRounded';
import WifiRounded from '@mui/icons-material/WifiRounded';
import WifiOffRounded from '@mui/icons-material/WifiOffRounded';
import ReplayIcon from '@mui/icons-material/ReplayRounded';
import PasswordRounded from '@mui/icons-material/PasswordRounded';
import { useTranslation } from 'react-i18next';
import { PaymentTransactionStatusEnum, MobileMoneyOperatorEnum } from '@/models/enums';
import { PaymentNotification } from '@/services/payment-websocket.service';
import { useCheckPaymentStatus } from '@/hooks/payment.hooks';
import Labels from '@/labelKeys.json';
import { useSearchParams } from 'react-router-dom';

type AlertColor = 'success' | 'error' | 'warning' | 'info';

export interface OrderSummaryInfo {
  total: number;
  itemCount: number;
  destination?: string;
  formatAmount: (amount: number) => string;
}

interface PaymentStatusInlineProps {
  transactionReference: string | null;
  wsConnected: boolean;
  lastNotification: PaymentNotification | null;
  operator?: MobileMoneyOperatorEnum;
  onRetry?: () => void;
  paymentStatus: PaymentTransactionStatusEnum;
  setPaymentStatus: (status: PaymentTransactionStatusEnum) => void;
  orderSummary?: OrderSummaryInfo;
}

const PaymentStatusInline: React.FC<PaymentStatusInlineProps> = ({
  transactionReference,
  lastNotification,
  paymentStatus,
  wsConnected,
  operator,
  onRetry,
  setPaymentStatus,
  orderSummary,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');

  const { FAILED, TIMEOUT, PENDING_OTP, PROCESSING, CANCELLED, INITIATED, COMPLETED, OTP_VERIFIED } =
    PaymentTransactionStatusEnum;

  const isPendingValidation = useCallback((): boolean => {
    return ![COMPLETED, FAILED, TIMEOUT, CANCELLED].includes(paymentStatus);
  }, [COMPLETED, FAILED, TIMEOUT, CANCELLED, paymentStatus]);

  const [remainingTime, setRemainingTime] = React.useState(6);
  const checkPaymentStatusMutation = useCheckPaymentStatus();

  const handleManualCheck = useCallback(async () => {
    if (transactionReference && operator) {
      try {
        setRemainingTime(6);
        const result = await checkPaymentStatusMutation.mutateAsync({
          reference: transactionReference,
          operator: operator,
        });
        if (result) {
          setPaymentStatus(result.status);
        }
      } catch (error) {
        console.error('Manual status check failed:', error);
      }
    }
  }, [transactionReference, operator, checkPaymentStatusMutation, setPaymentStatus]);

  useEffect(() => {
    const nextStatus = lastNotification?.status;
    if (nextStatus && nextStatus !== paymentStatus) {
      setPaymentStatus(nextStatus);
    }
  }, [lastNotification, setPaymentStatus, paymentStatus]);

  useEffect(() => {
    if (statusParam === PaymentTransactionStatusEnum.CANCELLED) {
      setPaymentStatus(PaymentTransactionStatusEnum.CANCELLED);
    }
  }, [statusParam, setPaymentStatus]);

  useEffect(() => {
    if (remainingTime > 0 && isPendingValidation()) {
      const timer = setInterval(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [remainingTime, isPendingValidation]);

  const getAlertMessage = (): string => {
    const statusMessages: Record<PaymentTransactionStatusEnum, string> = {
      [PENDING_OTP]: t(Labels.payment_phone_notification),
      [PROCESSING]: t(Labels.processing),
      [COMPLETED]: t(Labels.payment_completed_successfully),
      [FAILED]: t(Labels.payment_processing_failed),
      [CANCELLED]: t(Labels.payment_processing_failed),
      [TIMEOUT]: t(Labels.payment_otp_expired),
      [INITIATED]: '',
      [OTP_VERIFIED]: '',
    };
    return statusMessages[paymentStatus] ?? '';
  };

  const statusColors: Record<string, string> = {
    [COMPLETED]: theme.palette.success.main,
    [FAILED]: theme.palette.error.main,
    [CANCELLED]: theme.palette.error.main,
    [TIMEOUT]: theme.palette.warning.main,
    [PENDING_OTP]: theme.palette.primary.main,
    [PROCESSING]: theme.palette.primary.main,
    default: theme.palette.grey[500],
  };

  const getStatusIcon = (): React.ReactElement => {
    const iconSize = isMobile ? 56 : 88;
    const innerIconSize = isMobile ? 32 : 48;
    const iconProps = { sx: { fontSize: iconSize } };

    const spinnerSize = isMobile ? 56 : 72;
    const statusIcons: Partial<Record<PaymentTransactionStatusEnum, React.ReactElement>> = {
      [COMPLETED]: <CheckCircleRounded {...iconProps} sx={{ ...iconProps.sx, color: 'success.main' }} />,
      [FAILED]: <ErrorIcon {...iconProps} sx={{ ...iconProps.sx, color: 'error.main' }} />,
      [CANCELLED]: <ErrorIcon {...iconProps} sx={{ ...iconProps.sx, color: 'error.main' }} />,
      [TIMEOUT]: <HourglassEmptyRounded {...iconProps} sx={{ ...iconProps.sx, color: 'warning.main' }} />,
      [PENDING_OTP]: (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={spinnerSize} thickness={2} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PhoneAndroidRounded sx={{ fontSize: innerIconSize, color: 'primary.main' }} />
          </Box>
        </Box>
      ),
      [PROCESSING]: (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={spinnerSize} thickness={2} />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PhoneAndroidRounded sx={{ fontSize: innerIconSize, color: 'secondary.main' }} />
          </Box>
        </Box>
      ),
    };
    return statusIcons[paymentStatus] ?? <CircularProgress size={spinnerSize} thickness={2} />;
  };

  const getStatusMessage = (): string => {
    const statusMessages: Record<PaymentTransactionStatusEnum, string> = {
      [INITIATED]: t(Labels.enum_payment_status_pending),
      [PENDING_OTP]: t(Labels.enum_payment_status_pending),
      [PROCESSING]: t(Labels.processing),
      [COMPLETED]: t(Labels.travel_status_completed),
      [FAILED]: t(Labels.enum_payment_status_failed),
      [TIMEOUT]: t(Labels.payment_processing_failed),
      [CANCELLED]: t(Labels.status_cancelled),
      [OTP_VERIFIED]: t(Labels.processing),
    };
    return statusMessages[paymentStatus] ?? t(Labels.processing);
  };

  const getStatusColor = (): AlertColor => {
    const bgColors: Partial<Record<PaymentTransactionStatusEnum, AlertColor>> = {
      [COMPLETED]: 'success',
      [FAILED]: 'error',
      [CANCELLED]: 'error',
      [TIMEOUT]: 'warning',
    };
    return bgColors[paymentStatus] ?? 'info';
  };

  const isTerminalStatus = (status: PaymentTransactionStatusEnum) =>
    [COMPLETED, FAILED, TIMEOUT, CANCELLED].includes(status);

  const shouldShowRetryButton = () => onRetry && isTerminalStatus(paymentStatus) && paymentStatus !== COMPLETED;
  const showCompletionAlert = Boolean(getAlertMessage()) && !isPendingValidation();

  const activeColor = statusColors[paymentStatus] || statusColors.default;

  return (
    <Zoom in={true} style={{ transitionDelay: '100ms' }}>
      <Stack
        spacing={2}
        sx={{
          width: '100%',
          zIndex: 1,
          alignItems: 'center',
        }}
      >
        {/* Order summary recap (shop context) */}
        {orderSummary && (
          <Fade in={true}>
            <Box
              sx={{
                width: '100%',
                p: 1.5,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Stack
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {orderSummary.itemCount} article{orderSummary.itemCount > 1 ? 's' : ''}
                  {orderSummary.destination && ` · ${orderSummary.destination}`}
                </Typography>
                <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700 }}>
                  {orderSummary.formatAmount(orderSummary.total)}
                </Typography>
              </Stack>
            </Box>
          </Fade>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: isMobile ? 2 : 3,
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: isMobile ? 2 : 3, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{getStatusIcon()}</Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <Typography
                variant="h5"
                sx={{
                  color: activeColor,
                  letterSpacing: '-0.5px',
                  fontWeight: '700',
                }}
              >
                {getStatusMessage()}
              </Typography>

              {transactionReference && (
                <Fade in={true}>
                  <Box
                    sx={{
                      gap: 1,
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: alpha(theme.palette.text.primary, 0.04),
                      borderColor: alpha(theme.palette.text.primary, 0.04),
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        fontWeight: 'medium',
                      }}
                    >
                      {t(Labels.payment_otp_title)}:
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      sx={{
                        fontWeight: '700',
                        fontFamily: 'SFMono-Regular, Consolas, monospace',
                      }}
                    >
                      {transactionReference}
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
          </Box>

          <Chip
            icon={
              wsConnected ? <WifiRounded sx={{ fontSize: 'small' }} /> : <WifiOffRounded sx={{ fontSize: 'small' }} />
            }
            label={wsConnected ? t(Labels.user_connected) : t(Labels.user_disconnected)}
            color={wsConnected ? 'success' : 'default'}
            size="small"
            variant={wsConnected ? 'filled' : 'outlined'}
            sx={{
              fontWeight: 600,
              borderRadius: '8px',
              flexShrink: 0,
              alignSelf: { xs: 'flex-end', sm: 'center' },
              ...(wsConnected && {
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: 'success.main',
                border: '1px solid',
                borderColor: alpha(theme.palette.success.main, 0.2),
                '& .MuiChip-icon': { color: 'success.main' },
              }),
            }}
          />
        </Box>

        {/* Alerts */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {isPendingValidation() && (
            <Fade in={true}>
              <Alert
                severity="info"
                variant="outlined"
                icon={<PasswordRounded />}
                sx={{
                  borderRadius: 3,
                  borderWidth: 1.5,
                  bgcolor: alpha(theme.palette.info.main, 0.02),
                  borderColor: alpha(theme.palette.info.main, 0.08),
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {t(Labels.payment_phone_validation_prompt)}
                </Typography>
              </Alert>
            </Fade>
          )}

          {lastNotification && wsConnected && (
            <Fade in={true}>
              <Alert severity="info" sx={{ borderRadius: 3, bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                <Typography variant="body2">{t(lastNotification.message)}</Typography>
              </Alert>
            </Fade>
          )}

          {showCompletionAlert && (
            <Fade in={true}>
              <Alert
                severity={getStatusColor()}
                variant="outlined"
                sx={{
                  borderRadius: 3,
                  borderWidth: 1.5,
                  bgcolor: alpha(theme.palette.info.main, 0.02),
                  borderColor: alpha(theme.palette.info.main, 0.08),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: '500',
                  }}
                >
                  {getAlertMessage()}
                </Typography>
              </Alert>
            </Fade>
          )}
        </Box>

        {shouldShowRetryButton() && (
          <Fade in={true}>
            <Button
              variant="contained"
              onClick={onRetry}
              size="large"
              color="primary"
              startIcon={<ReplayIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {t(Labels.payment_retry_button)}
            </Button>
          </Fade>
        )}

        {isPendingValidation() && (
          <Fade in={true}>
            <Button
              variant="contained"
              onClick={handleManualCheck}
              disabled={checkPaymentStatusMutation.isPending || remainingTime > 0}
              size="medium"
              color="secondary"
              sx={{
                mt: 1,
                width: 1,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              {checkPaymentStatusMutation.isPending
                ? t(Labels.processing)
                : `${t(Labels.payment_status_check)} (${remainingTime}s)`}
            </Button>
          </Fade>
        )}
      </Stack>
    </Zoom>
  );
};

export default PaymentStatusInline;

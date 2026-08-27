import { useMutation } from '@tanstack/react-query';
import { sendSms, type SendSmsPayload } from '@/api/sms.api';

export const useSendSms = () =>
  useMutation({
    mutationFn: (payload: SendSmsPayload) => sendSms(payload),
  });

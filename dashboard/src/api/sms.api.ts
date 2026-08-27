import api from './axios';

export interface SendSmsPayload {
  recipients: string[];
  message: string;
  voyageId?: number;
}

export interface SendSmsResponse {
  sent: number;
  failed: number;
  errors?: string[];
}

// TODO: backend endpoint POST /api/sms/send must be implemented (Orange SMS API integration).
export const sendSms = async (payload: SendSmsPayload): Promise<SendSmsResponse> => {
  const { data } = await api.post<SendSmsResponse>('/sms/send', payload);
  return data;
};

import api from './api';

export interface PaymentPayload {
  reservation: { id: number };
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
}

export async function createPayment(payment: PaymentPayload) {
  const response = await api.post('/payments', payment);
  return response.data;
} 
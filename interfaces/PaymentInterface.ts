export interface Payment {
  id_pay: string;
  id_payer: string;
  id_receiver: string | null;
  related_type: string;
  id_related: string;
  concept: string;
  description?: string;
  notes?: string | null;
  amount: number;
  currency: string;
  created_at?: string;
  due_date?: string | null;
  payment_date?: string | null;
  method?: string | null;
  reference_code?: string | null;
  status?: string;
  counterparty_name?: string;
  my_role?: 'payer' | 'receiver' | string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  // El objeto `payment` contiene la representación completa del pago en tu modelo interno.
  payment: Payment | null;
}

export interface GetPaymentsResponse {
  success: boolean;
  data: Payment[];
  message?: string;
  statusCode?: number;
}

export interface CreatePaymentIntentResponse {
  success: boolean;
  data: PaymentIntentResponse;
  message?: string;
  statusCode?: number;
}
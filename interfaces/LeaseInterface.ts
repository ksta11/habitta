// Interfaces para el sistema de arrendamiento

export interface LeaseProperty {
  id: string;
  title: string;
  address: string;
  city: string;
  type: string;
  rooms: number;
  bathrooms: number;
  area: number;
  images: Array<{
    url_image: string;
  }>;
}

export interface LeaseOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Lease {
  id: string;
  id_renter: string;
  id_property: string;
  id_owner: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: 'active' | 'completed' | 'cancelled' | 'pending_renewal';
  payment_day: number; // Día del mes para pago
  contract_url?: string; // URL del contrato firmado
  created_at: string;
  property: LeaseProperty;
  owner: LeaseOwner;
}

export interface LeaseDocument {
  id: string;
  id_lease: string;
  type: 'contract' | 'addendum' | 'payment_receipt' | 'inventory' | 'other';
  name: string;
  url: string;
  upload_date: string;
}

export interface GetActiveLeaseResponse {
  success: boolean;
  data: Lease | null;
  message?: string;
}

export interface GetLeaseDocumentsResponse {
  success: boolean;
  data: LeaseDocument[];
  message?: string;
}

export interface PaymentHistory {
  id: string;
  id_lease: string;
  amount: number;
  payment_date: string;
  due_date: string;
  status: 'paid' | 'pending' | 'late' | 'cancelled';
  payment_method?: string;
  receipt_url?: string;
}

export interface GetLeasePaymentHistoryResponse {
  success: boolean;
  data: PaymentHistory[];
  message?: string;
}

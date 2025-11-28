// Interfaces para el sistema de arrendamientos desde la perspectiva del Owner

// Información del inquilino en el lease
export interface LeaseRenter {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Información de la propiedad en el lease
export interface OwnerLeaseProperty {
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

// Lease desde la perspectiva del Owner
export interface OwnerLease {
  id: string;
  id_renter: string;
  id_property: string;
  id_owner: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  deposit: number;
  status: 'active' | 'completed' | 'cancelled' | 'pending_renewal';
  payment_day: number;
  contract_url?: string;
  created_at: string;
  
  // Datos adicionales para el owner
  renter: LeaseRenter;
  property: OwnerLeaseProperty;
  
  // Stats de pagos
  payments_on_time?: number;
  payments_late?: number;
  last_payment_date?: string;
  next_payment_date?: string;
  
  // Mantenimiento
  maintenance_requests_count?: number;
  pending_maintenance_count?: number;
}

// Documento del lease
export interface OwnerLeaseDocument {
  id: string;
  id_lease: string;
  type: 'contract' | 'addendum' | 'payment_receipt' | 'inventory' | 'other';
  name: string;
  url: string;
  upload_date: string;
}

// Historial de pagos
export interface OwnerPaymentHistory {
  id: string;
  id_lease: string;
  amount: number;
  payment_date: string;
  due_date: string;
  status: 'paid' | 'pending' | 'late' | 'cancelled';
  payment_method?: string;
  receipt_url?: string;
}

// Respuestas de la API
export interface GetOwnerLeasesResponse {
  success: boolean;
  data: OwnerLease[];
  message?: string;
}

export interface GetOwnerLeaseByIdResponse {
  success: boolean;
  data: OwnerLease | null;
  message?: string;
}

export interface GetOwnerLeaseDocumentsResponse {
  success: boolean;
  data: OwnerLeaseDocument[];
  message?: string;
}

export interface GetOwnerLeasePaymentHistoryResponse {
  success: boolean;
  data: OwnerPaymentHistory[];
  message?: string;
}

// Stats globales para el owner
export interface OwnerLeasesStats {
  total: number;
  active: number;
  pendingRenewal: number;
  completed: number;
  totalMonthlyIncome: number;
  occupancyRate: number; // % de propiedades ocupadas
  averageRent: number;
  upcomingExpirations: number; // Leases que expiran en los próximos 30 días
}

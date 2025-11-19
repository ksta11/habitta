// Interfaces para el sistema de mantenimiento desde la perspectiva del Owner

import { 
  MaintenanceCategory, 
  MaintenancePriority, 
  MaintenanceStatus,
  MaintenanceImage 
} from '../MaintenanceInterface';

// Información del inquilino (renter) en la solicitud
export interface MaintenanceRenter {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Información de la propiedad en la solicitud
export interface MaintenanceProperty {
  id: string;
  title: string;
  address: string;
  images: Array<{
    url_image: string;
  }>;
}

// Solicitud de mantenimiento desde la perspectiva del Owner
export interface OwnerMaintenanceRequest {
  id: string;
  id_lease: string;
  id_renter: string;
  id_property: string;
  id_owner: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  request_date: string;
  scheduled_date?: string;
  completion_date?: string;
  images: MaintenanceImage[];
  owner_notes?: string;
  renter_rating?: number;
  renter_review?: string;
  estimated_cost?: number;
  actual_cost?: number;
  
  // Datos adicionales para el owner
  renter: MaintenanceRenter;
  property: MaintenanceProperty;
}

// DTO para actualizar solicitud como owner
export interface OwnerUpdateMaintenanceRequestDTO {
  status?: MaintenanceStatus;
  scheduled_date?: string;
  completion_date?: string;
  owner_notes?: string;
  estimated_cost?: number;
  actual_cost?: number;
}

// Respuestas de la API
export interface GetOwnerMaintenanceRequestsResponse {
  success: boolean;
  data: OwnerMaintenanceRequest[];
  message?: string;
}

export interface GetOwnerMaintenanceRequestByIdResponse {
  success: boolean;
  data: OwnerMaintenanceRequest | null;
  message?: string;
}

export interface UpdateOwnerMaintenanceRequestResponse {
  success: boolean;
  data: OwnerMaintenanceRequest;
  message?: string;
}

// Filtros para solicitudes de mantenimiento
export type OwnerMaintenanceFilter = 
  | 'all'
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'rejected';

// Stats para el owner
export interface OwnerMaintenanceStats {
  total: number;
  pending: number;
  inReview: number;
  approved: number;
  inProgress: number;
  completed: number;
  rejected: number;
  averageResponseTime: number; // en horas
  averageCost: number;
}

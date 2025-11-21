// Interfaces para el sistema de mantenimiento desde la perspectiva del Owner

import { 
  MaintenanceStatus,
  MaintenanceUser,
  MaintenanceProperty
} from '../MaintenanceInterface';

// Solicitud de mantenimiento desde la perspectiva del Owner (basado en respuesta del backend)
export interface OwnerMaintenanceRequest {
  id_maintenance: string;
  id_property: string;
  id_owner: string;
  id_user: string;
  title: string;
  description: string;
  status: MaintenanceStatus;
  responsibility: 'user' | 'owner';
  cost_estimate: number | null;
  scheduled_date: string | null;
  confirmed_date: string | null;
  completed_date: string | null;
  attachments: string[] | null;
  created_by: 'user' | 'owner';
  id_payment: string | null;
  created_at: string;
  updated_at: string;
  
  // Relaciones anidadas
  property?: MaintenanceProperty;
  user?: MaintenanceUser;
  payment?: any | null;
}

// DTO para actualizar solicitud como owner
export interface OwnerUpdateMaintenanceRequestDTO {
  status?: MaintenanceStatus;
  scheduled_date?: string;
  confirmed_date?: string;
  completed_date?: string;
  cost_estimate?: number;
  responsibility?: 'user' | 'owner';
  attachments?: string[];
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

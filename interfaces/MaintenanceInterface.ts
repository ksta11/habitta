// Interfaces para el sistema de solicitudes de mantenimiento

export type MaintenanceStatus = 
  | 'pending'       // Pendiente de revisión
  | 'in_review'     // En revisión por el propietario
  | 'approved'      // Aprobada
  | 'in_progress'   // En progreso
  | 'completed'     // Completada
  | 'rejected'      // Rechazada
  | 'cancelled';    // Cancelada

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'urgent';

export type MaintenanceCategory = 
  | 'plumbing'      // Plomería
  | 'electrical'    // Eléctrico
  | 'heating'       // Calefacción/Climatización
  | 'appliances'    // Electrodomésticos
  | 'structural'    // Estructural
  | 'painting'      // Pintura
  | 'cleaning'      // Limpieza
  | 'pest_control'  // Control de plagas
  | 'security'      // Seguridad
  | 'other';        // Otro

export interface MaintenanceImage {
  id?: string;
  url_image: string;
}

export interface MaintenanceRequest {
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
  renter_rating?: number; // Calificación del inquilino sobre el servicio
  renter_review?: string;
  estimated_cost?: number;
  actual_cost?: number;
  property_title?: string;
  property_address?: string;
}

export interface CreateMaintenanceRequestDTO {
  id_lease: string;
  id_property: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  images?: MaintenanceImage[];
}

export interface UpdateMaintenanceRequestDTO {
  title?: string;
  description?: string;
  category?: MaintenanceCategory;
  priority?: MaintenancePriority;
  status?: MaintenanceStatus;
  scheduled_date?: string;
  owner_notes?: string;
  estimated_cost?: number;
  actual_cost?: number;
  renter_rating?: number;
  renter_review?: string;
}

export interface GetMaintenanceRequestsResponse {
  success: boolean;
  data: MaintenanceRequest[];
  message?: string;
}

export interface CreateMaintenanceRequestResponse {
  success: boolean;
  data: MaintenanceRequest;
  message?: string;
}

export interface UpdateMaintenanceRequestResponse {
  success: boolean;
  data: MaintenanceRequest;
  message?: string;
}

export interface DeleteMaintenanceRequestResponse {
  success: boolean;
  message?: string;
}

// Utilidades para categorías y prioridades
export const MAINTENANCE_CATEGORIES = {
  plumbing: { label: 'Plomería', icon: 'tint' },
  electrical: { label: 'Eléctrico', icon: 'bolt' },
  heating: { label: 'Climatización', icon: 'thermometer' },
  appliances: { label: 'Electrodomésticos', icon: 'cutlery' },
  structural: { label: 'Estructural', icon: 'home' },
  painting: { label: 'Pintura', icon: 'paint-brush' },
  cleaning: { label: 'Limpieza', icon: 'shower' },
  pest_control: { label: 'Control de Plagas', icon: 'bug' },
  security: { label: 'Seguridad', icon: 'lock' },
  other: { label: 'Otro', icon: 'wrench' },
};

export const MAINTENANCE_PRIORITIES = {
  low: { label: 'Baja', color: '#10b981' },
  medium: { label: 'Media', color: '#f59e0b' },
  high: { label: 'Alta', color: '#ef4444' },
  urgent: { label: 'Urgente', color: '#dc2626' },
};

export const MAINTENANCE_STATUSES = {
  pending: { label: 'Pendiente', color: '#9ca3af' },
  in_review: { label: 'En Revisión', color: '#3b82f6' },
  approved: { label: 'Aprobada', color: '#8b5cf6' },
  in_progress: { label: 'En Progreso', color: '#f59e0b' },
  completed: { label: 'Completada', color: '#10b981' },
  rejected: { label: 'Rechazada', color: '#ef4444' },
  cancelled: { label: 'Cancelada', color: '#6b7280' },
};

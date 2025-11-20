// Interfaces para el sistema de solicitudes de mantenimiento

export type MaintenanceStatus = 
  | 'pending'       // Pendiente de revisión
  | 'in_review'     // En revisión por el propietario
  | 'accepted'      // Aceptada y programada por owner
  | 'confirmed'     // Confirmada por user
  | 'approved'      // Aprobada (legacy)
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

export type CreatedBy = 'user' | 'owner';
export type Responsibility = 'user' | 'owner';

export interface MaintenanceImage {
  id?: string;
  url_image: string;
}

// Datos de usuario/owner/property anidados en la respuesta
export interface MaintenanceUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  pushToken?: string;
}

export interface MaintenanceProperty {
  id: string;
  title: string;
  address: string;
}

export interface MaintenancePayment {
  id: string;
  // Agregar campos de payment según tu backend
}

// Interfaz principal basada en la respuesta del backend
export interface MaintenanceRequest {
  // IDs principales
  id_maintenance: string;
  id_property: string;
  id_owner: string;
  id_user: string;
  
  // Campos obligatorios
  title: string;
  description: string;
  status: MaintenanceStatus;
  responsibility: Responsibility;
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
  
  // Campos de costos
  cost_estimate: number | null;
  actual_cost?: number | null;
  estimated_cost?: number | null; // Alias para compatibilidad
  
  // Fechas
  scheduled_date: string | null;
  confirmed_date: string | null;
  completed_date: string | null;
  request_date?: string; // Alias para created_at
  completion_date?: string; // Alias para completed_date
  
  // Campos opcionales que pueden no venir del backend
  category?: MaintenanceCategory;
  priority?: MaintenancePriority;
  attachments: string[] | null;
  images?: MaintenanceImage[];
  owner_notes?: string;
  id_payment: string | null;
  
  // Relaciones anidadas
  property?: MaintenanceProperty;
  property_title?: string; // Para compatibilidad
  property_address?: string; // Para compatibilidad
  owner?: MaintenanceUser;
  user?: MaintenanceUser;
  payment?: MaintenancePayment | null;
  
  // Campos legacy para compatibilidad
  id?: string; // Alias para id_maintenance
}

// DTO para crear una solicitud de mantenimiento
export interface CreateMaintenanceRequestDTO {
  id_property: string;
  id_owner: string;
  id_user: string;
  title: string;
  description: string;
  created_by: CreatedBy;
  responsibility: Responsibility;
  cost_estimate?: number;
}

// DTO para actualizar una solicitud de mantenimiento
export interface UpdateMaintenanceRequestDTO {
  title?: string;
  description?: string;
  status?: MaintenanceStatus;
  scheduled_date?: string;
  confirmed_date?: string;
  completed_date?: string;
  cost_estimate?: number;
  responsibility?: Responsibility;
  attachments?: string[];
}

// Respuestas de la API
export interface GetMaintenanceRequestsResponse {
  success: boolean;
  data: MaintenanceRequest[];
  message?: string;
}

export interface CreateMaintenanceRequestResponse {
  success: boolean;
  data: MaintenanceRequest;
  message: string;
}

export interface UpdateMaintenanceRequestResponse {
  success: boolean;
  data: MaintenanceRequest;
  message: string;
}

export interface DeleteMaintenanceRequestResponse {
  success: boolean;
  message: string;
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
  accepted: { label: 'Aceptada', color: '#8b5cf6' },
  confirmed: { label: 'Confirmada', color: '#10b981' },
  approved: { label: 'Aprobada', color: '#8b5cf6' },
  in_progress: { label: 'En Progreso', color: '#f59e0b' },
  completed: { label: 'Completada', color: '#10b981' },
  rejected: { label: 'Rechazada', color: '#ef4444' },
  cancelled: { label: 'Cancelada', color: '#6b7280' },
};

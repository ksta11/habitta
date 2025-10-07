// Interfaces para el sistema de aplicaciones de arriendo

export interface Renter {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface ApplicationProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  images: Array<{
    url_image: string;
  }>;
}

export interface Application {
  id: string;
  id_renter: string;
  id_property: string;
  status: 'pending' | 'pre_approved' | 'approved' | 'rejected' | 'withdraw';
  description: string;
  application_date: string;
  renter: Renter;
  property: ApplicationProperty;
}

export interface GetOwnerApplicationsResponse {
  success: boolean;
  data: Application[];
  message?: string;
}

export interface UpdateApplicationStatusDTO {
  status: 'pending' | 'pre_approved' | 'approved' | 'rejected' | 'withdraw';
  reason?: string;
}

export interface UpdateApplicationStatusResponse {
  success: boolean;
  data?: Application;
  message: string;
  statusCode?: number;
}

// Interfaces para crear una nueva aplicación
export interface CreateApplicationDTO {
  id_property: string;
  description: string;
}

export interface CreateApplicationResponse {
  success: boolean;
  data?: Application;
  message: string;
  statusCode?: number;
}
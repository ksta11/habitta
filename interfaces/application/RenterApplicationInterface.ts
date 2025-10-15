// Interfaces para el sistema de aplicaciones desde la perspectiva del renter

export interface PropertyOwner {
  id: string;
  name: string;
  phone: string;
}

export interface RenterApplicationProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  id_owner: string;
  images: Array<{
    url_image: string;
  }>;
  owner: PropertyOwner;
}

export interface RenterApplication {
  id: string;
  id_renter: string;
  id_property: string;
  status: 'pending' | 'documents_required' | 'pre_approved' | 'approved' | 'signed' | 'rejected' | 'withdrawn' | 'terminated';
  description: string;
  application_date: string;
  property: RenterApplicationProperty;
}

export interface GetRenterApplicationsResponse {
  success: boolean;
  data: RenterApplication[];
  message?: string;
}
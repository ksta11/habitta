export interface PropertyImage {
  url_image: string;
}

export interface CreatePropertyDTO {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  type: 'house' | 'apartament' | 'store' | 'office' | 'werehouse';
  rooms: number;
  bathrooms: number;
  area: number;
  services: string;
  images: string[];
}

export interface EditPropertyDTO {
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  type: 'house' | 'apartament' | 'store' | 'office' | 'werehouse';
  rooms: number;
  bathrooms: number;
  area: number;
  services: string;
  publication_status: 'published' | 'rented' | 'disabled';
  images: string[];
}

// DTO para actualizar propiedad (incluye id_owner para el backend)
export interface UpdatePropertyDTO extends EditPropertyDTO {
  id_owner: string;
}

// Interfaces para obtener propiedades del owner
export interface PropertyImageResponse {
  id: string;
  id_property: string;
  url_image: string;
}

export interface Property {
  id: string;
  id_owner: string;
  title: string;
  description: string;
  address: string;
  city: string;
  price: number;
  type: string;
  rooms: number;
  bathrooms: number;
  area: number;
  services: string;
  publication_status: string;
  publication_date: string;
  images: PropertyImageResponse[];
}

export interface GetOwnerPropertiesResponse {
  success: boolean;
  data: Property[];
  message?: string;
}
// Interfaz extendida para gestión administrativa
export interface AdminProperty extends Property {
  owner_name: string;
  owner_email: string;
  status: 'available' | 'occupied' | 'maintenance' | 'pending';
  rental_price: number;
  created_at: string;
  updated_at: string;
  views: number;
  favorites: number;
  rental_history?: RentalRecord[];
}

export interface RentalRecord {
  id: string;
  tenant_name: string;
  tenant_email: string;
  start_date: string;
  end_date?: string;
  monthly_rent: number;
  status: 'active' | 'completed' | 'cancelled';
}

// Filtros para propiedades en admin
export interface PropertyFilters {
  search: string;
  type: string;
  status: string;
  city: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'title' | 'price' | 'created_at' | 'views';
  sortOrder: 'asc' | 'desc';
}
export interface GetPropertyByIdResponse {
  success: boolean;
  data: Property | null;
  message?: string;
}

export interface UpdatePropertyResponse {
  success: boolean;
  data?: Property;
  message?: string;
  statusCode?: number;
}

// Aquí puedes agregar más interfaces relacionadas a propiedades

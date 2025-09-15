export interface PropertyImage {
  url_image: string;
}

export interface CreatePropertyDTO {
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
  images: string[];
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

export interface GetPropertyByIdResponse {
  success: boolean;
  data: Property | null;
  message?: string;
}

// Aquí puedes agregar más interfaces relacionadas a propiedades

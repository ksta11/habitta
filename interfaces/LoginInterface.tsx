export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  statusCode?: number;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}


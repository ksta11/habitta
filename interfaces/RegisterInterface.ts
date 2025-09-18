export interface RegisterDTO {
    name: string;
    phone: string;
    email: string;
    password: string;
    role: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

// Tipo para el formulario (sin role, se asigna automáticamente)
export interface RegisterFormDTO {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}
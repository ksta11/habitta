import { RegisterDTO } from '../../../interfaces/RegisterInterface';

// Configuración para Expo Go (dispositivo físico):
const API_BASE_URL = 'http://192.168.1.22:3000'; // Tu IP local actual

// Nota: Cuando usas Expo Go escaneando QR, necesitas:
// 1. Tu IP local (ya configurada arriba)
// 2. Que tu backend acepte conexiones desde cualquier IP (0.0.0.0)
// 3. Que ambos dispositivos estén en la misma red WiFi 

// Interface para lo que espera el backend
export interface BackendRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const registerUser = async (userData: RegisterDTO): Promise<RegisterResponse> => {
  try {
    // Crear objeto solo con los campos que espera el backend
    const apiPayload: BackendRegisterPayload = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      role: 'user' // Siempre 'user' por defecto
    };
    
    console.log('Enviando al backend:', apiPayload);
    
    // Primero, testear conectividad
    const endpoint = `${API_BASE_URL}/api/auth/register`;
    console.log('🔗 Intentando conectar a:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiPayload),
    });

    console.log('✅ Conexión exitosa! Status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: data.message || `Error ${response.status}: ${data.error || 'Error al registrar usuario'}`
      };
    }

    return {
      success: true,
      statusCode: 201,
      message: data.message || 'Usuario registrado exitosamente',
      user: data.user
    };
    
  } catch (error) {
    console.error('❌ Register error:', error);
    
    // Información más detallada del error
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        success: false,
        statusCode: 0,
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. 

🔧 Soluciones:
• Si usas Android Emulator: usar 10.0.2.2:3000
• Si usas iOS Simulator: usar localhost:3000  
• Si usas dispositivo físico: usar tu IP local (ej: 192.168.1.100:3000)

💡 Para obtener tu IP: ejecuta 'ipconfig' en la terminal`
      };
    }
    
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Error de conexión'
    };
  }
};
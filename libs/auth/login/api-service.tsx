import { LoginDTO, LoginResponse } from '../../../interfaces/LoginInterface';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.1.12:3000';

export const authenticationUser = async (credentials: LoginDTO): Promise<LoginResponse> => {
  try {
    console.log('🔐 Enviando credenciales al backend:', { email: credentials.email });
    console.log('🔗 Intentando conectar a:', `${API_BASE_URL}/api/auth/login`);

    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('✅ Conexión exitosa! Status:', response.status);

    const data = await response.json();
    console.log('📦 Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: data.message || 'Error al iniciar sesión'
      };
    }

    // Extraer datos de la estructura que envía tu backend
    const responseData = data.data || data; // data.data si viene anidado, o data directo
    
    return {
      success: true,
      statusCode: 200,
      token: responseData.token,
      user: responseData.user,
      message: data.message || 'Login exitoso'
    };

  } catch (error) {
    console.error('❌ Login error:', error);
    
    // Información más detallada del error
    if (error instanceof TypeError && error.message === 'Network request failed') {
      return {
        success: false,
        statusCode: 0,
        message: `❌ No se pudo conectar con el servidor en ${API_BASE_URL}. 

🔧 Verifica que el backend esté corriendo y accesible desde tu dispositivo.`
      };
    }
    
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Error de conexión'
    };
  }
};

// Mantener compatibilidad con función anterior
export const loginService = authenticationUser;

// Función para validar token existente
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    console.log('🔍 Validando token...');
    
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Token validation status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    return false;
  }
};

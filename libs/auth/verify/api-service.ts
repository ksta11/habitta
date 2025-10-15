const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface ResendConfirmationResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
}

export const resendConfirmation = async (userId: string): Promise<ResendConfirmationResponse> => {
  try {
    console.log('🔄 Reenviando código de verificación para usuario:', userId);

    const url = `${API_BASE_URL}/api/auth/resend-confirmation/${userId}`;
    console.log('🌐 URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Status de respuesta:', response.status);

    const data = await response.json();
    console.log('📦 Respuesta del servidor:', data);

    if (!response.ok) {
      console.log('❌ Error en reenvío:', data.message);
      return {
        success: false,
        statusCode: response.status,
        message: data.message || 'Error al reenviar el código de verificación',
      };
    }

    return {
      success: true,
      statusCode: response.status,
      message: data.message || 'Código reenviado exitosamente',
    };
  } catch (error) {
    console.error('💥 Error crítico al reenviar código:', error);
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Error de conexión',
    };
  }
};

export interface ConfirmVerificationResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  token?: string;
  user?: any;
}

export const confirmVerificationCode = async (userId: string, verificationCode: string): Promise<ConfirmVerificationResponse> => {
  try {
    console.log('🔐 Confirmando código para usuario:', userId);

    const url = `${API_BASE_URL}/api/auth/confirm/${userId}`;
    console.log('🌐 URL confirm:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verificationCode }),
    });

    console.log('📡 Status de respuesta confirm:', response.status);

    const data = await response.json();
    console.log('📦 Respuesta del servidor (confirm):', data);

    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: data.message || 'Error al confirmar la cuenta',
      };
    }

    const payload = data?.data || data;

    return {
      success: true,
      statusCode: response.status,
      message: data.message || 'Cuenta confirmada',
      token: payload?.token,
      user: payload?.user,
    };
  } catch (error) {
    console.error('💥 Error crítico al confirmar código:', error);
    return {
      success: false,
      statusCode: 500,
      message: error instanceof Error ? error.message : 'Error de conexión',
    };
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreatePaymentIntentResponse, GetPaymentsResponse } from "../../interfaces/PaymentInterface";

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

// Obtener pagos del usuario actual
export const getUserPayments = async (): Promise<GetPaymentsResponse> => {
  try {
    console.log('💳 Iniciando obtención de pagos del usuario...');
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
        console.log('❌ No se encontró token de autenticación');
        return { success: false, message: 'No se encontró token de autenticación', data: [] };
    }

    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
    const url = `${API_BASE_URL}/api/payments/my`;
    console.log('🌐 URL de consulta:', url);

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    console.log('📡 Status de respuesta:', response.status);
    const body = await response.json();
    console.log('📨 Respuesta:', body);

    if (!response.ok) {
        console.error('🚨 Error al obtener pagos:', body);
        return { success: false, message: body.message || 'Error desconocido', data: [] };
    }

    return { success: true, data: body.data };
  } catch (error) {
    console.error('🚨 Error inesperado:', error);
    return { success: false, data: [] };
  }
};

export const createPaymentIntent = async (id_pay: string): Promise<CreatePaymentIntentResponse> => {
  try {
    console.log('💳 Iniciando creación de Payment Intent...');
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return { success: false, message: 'No se encontró token de autenticación', data: { client_secret: '', payment: null } };
    }

    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
    const url = `${API_BASE_URL}/api/payments/createPaymentIntent/${id_pay}`;
    console.log('🌐 URL de creación de Payment Intent:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📡 Status de respuesta:', response.status);
    const body = await response.json();
    console.log('📨 Respuesta:', body);

    if (!response.ok) {
      console.error('🚨 Error al crear Payment Intent:', body);
      return { success: false, message: body.message || 'Error desconocido', data: { client_secret: '', payment: null } };
    }

    // Esperamos que el backend retorne { success: true, data: { client_secret, payment } }
    return { success: true, data: body.data };
  } catch (error) {
    console.error('🚨 Error inesperado:', error);
    return { success: false, data: { client_secret: '', payment: null } };
  }
};

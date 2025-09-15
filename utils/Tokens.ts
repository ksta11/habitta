/**
 * Utilidades para manejo de JWT tokens
 */

// Interfaz para el payload del JWT
interface JWTPayload {
  exp: number; // Timestamp de expiración
  iat: number; // Timestamp de emisión
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

/**
 * Decodifica un JWT token sin verificar la firma
 * Solo para leer el payload y verificar expiración
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // Separar las partes del JWT (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('❌ Token JWT inválido: formato incorrecto');
      return null;
    }

    // Decodificar el payload (segunda parte)
    const payload = parts[1];
    
    // Agregar padding si es necesario para base64
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decodificar de base64
    const decodedPayload = atob(paddedPayload);
    
    // Parsear como JSON
    const parsedPayload: JWTPayload = JSON.parse(decodedPayload);
    
    return parsedPayload;
  } catch (error) {
    console.error('❌ Error al decodificar JWT:', error);
    return null;
  }
};

/**
 * Verifica si un JWT token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    
    if (!payload || !payload.exp) {
      console.error('❌ Token inválido o sin fecha de expiración');
      return true; // Considerar expirado si no se puede decodificar
    }
    
    // Convertir timestamp de segundos a milisegundos y comparar con tiempo actual
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    
    const isExpired = currentTime >= expirationTime;
    
    if (isExpired) {
      console.log('🕐 Token expirado:', {
        expiration: new Date(expirationTime).toISOString(),
        current: new Date(currentTime).toISOString()
      });
    }
    
    return isExpired;
  } catch (error) {
    console.error('❌ Error al verificar expiración del token:', error);
    return true; // Considerar expirado en caso de error
  }
};

/**
 * Obtiene el tiempo restante antes de que expire el token (en milisegundos)
 */
export const getTokenTimeToExpiry = (token: string): number => {
  try {
    const payload = decodeJWT(token);
    
    if (!payload || !payload.exp) {
      return 0;
    }
    
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    
    return Math.max(0, timeRemaining);
  } catch (error) {
    console.error('❌ Error al calcular tiempo restante del token:', error);
    return 0;
  }
};

/**
 * Obtiene información detallada del token
 */
export const getTokenInfo = (token: string) => {
  const payload = decodeJWT(token);
  
  if (!payload) {
    return null;
  }
  
  const expirationTime = payload.exp * 1000;
  const issuedTime = payload.iat * 1000;
  const currentTime = Date.now();
  const timeToExpiry = getTokenTimeToExpiry(token);
  const isExpired = isTokenExpired(token);
  
  return {
    payload,
    expirationDate: new Date(expirationTime),
    issuedDate: new Date(issuedTime),
    timeToExpiry,
    isExpired,
    timeToExpiryFormatted: formatTimeRemaining(timeToExpiry)
  };
};

/**
 * Formatea el tiempo restante en formato legible
 */
export const formatTimeRemaining = (milliseconds: number): string => {
  if (milliseconds <= 0) {
    return 'Expirado';
  }
  
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Configuración del WebSocket según el entorno
export const WEBSOCKET_CONFIG = {
  // URL del servidor WebSocket
  SOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://tu-api.com' // Cambiar por tu URL de producción
      : 'http://localhost:3001'),
  
  // Configuración de reconexión
  RECONNECTION: {
    enabled: true,
    attempts: 5,
    delay: 1000,
    maxDelay: 5000,
  },
  
  // Timeout de conexión
  TIMEOUT: 20000,
  
  // Transports disponibles
  TRANSPORTS: ['websocket', 'polling'],
  
  // Configuración de autenticación
  AUTH: {
    withCredentials: true,
    tokenKey: 'access_token', // Clave del token en las cookies
  }
}

// Función para obtener la URL del WebSocket
export const getWebSocketUrl = (): string => {
  return WEBSOCKET_CONFIG.SOCKET_URL
}

// Función para obtener la configuración completa
export const getWebSocketConfig = () => {
  return {
    url: getWebSocketUrl(),
    options: {
      transports: WEBSOCKET_CONFIG.TRANSPORTS,
      timeout: WEBSOCKET_CONFIG.TIMEOUT,
      reconnection: WEBSOCKET_CONFIG.RECONNECTION.enabled,
      reconnectionAttempts: WEBSOCKET_CONFIG.RECONNECTION.attempts,
      reconnectionDelay: WEBSOCKET_CONFIG.RECONNECTION.delay,
      maxReconnectionDelay: WEBSOCKET_CONFIG.RECONNECTION.maxDelay,
      withCredentials: WEBSOCKET_CONFIG.AUTH.withCredentials,
      forceNew: true,
      autoConnect: false,
    }
  }
} 
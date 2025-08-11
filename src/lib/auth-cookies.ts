// Constantes para las cookies
export const AUTH_COOKIE_NAME = 'access_token'
export const REFRESH_COOKIE_NAME = 'refresh_token'

// Opciones de seguridad para las cookies
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as 'strict' | 'lax', // Lax en desarrollo para cross-origin
  maxAge: 15 * 60, // 15 minutos para access_token
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost', // Dominio en desarrollo
}

export const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60, // 7 días para refresh_token
}

// Función para verificar si hay cookies de autenticación (lado cliente)
// Como las cookies son httpOnly, no podemos leerlas directamente
// En su lugar, haremos una petición al servidor para verificar
export async function hasAuthCookies(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  try {
    const response = await fetch('/api/auth/perfil', {
      method: 'GET',
      credentials: 'include',
    })
    
    return response.ok
  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return false
  }
}

// Función síncrona para verificar cookies (deprecated - usar la async)
export function hasAuthCookiesSync(): boolean {
  if (typeof document === 'undefined') return false
  
  // Esta función no puede detectar cookies httpOnly
  // Solo devuelve false para evitar falsos positivos
  return false
}

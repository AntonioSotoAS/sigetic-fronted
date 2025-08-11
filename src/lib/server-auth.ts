import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from './auth-cookies'

// Función para establecer cookies (lado servidor)
export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies()
  
  cookieStore.set(AUTH_COOKIE_NAME, accessToken, COOKIE_OPTIONS)
  
  if (refreshToken) {
    cookieStore.set(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS)
  }
}

// Función para obtener cookies (lado servidor)
export async function getAuthCookies() {
  const cookieStore = await cookies()
  
  return {
    accessToken: cookieStore.get(AUTH_COOKIE_NAME)?.value,
    refreshToken: cookieStore.get(REFRESH_COOKIE_NAME)?.value,
  }
}

// Función para limpiar cookies (lado servidor)
export async function clearAuthCookies() {
  const cookieStore = await cookies()
  
  cookieStore.delete(AUTH_COOKIE_NAME)
  cookieStore.delete(REFRESH_COOKIE_NAME)
}

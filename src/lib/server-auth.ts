import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from './auth-cookies'

// Función para verificar token JWT
export async function verifyToken(token: string) {
  try {
    // En un entorno real, aquí verificarías el token con tu backend
    // Por ahora, simplemente validamos que el token existe
    if (!token) {
      return null
    }
    
    // Opcional: puedes hacer una llamada al backend para verificar el token
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const response = await fetch(`${backendUrl}/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.user || { id: 'user', role: 'user' }
    }
    
    return null
  } catch (error) {
    console.error("Error verificando token:", error)
    return null
  }
}

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

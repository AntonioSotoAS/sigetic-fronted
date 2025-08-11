import { NextResponse } from 'next/server'
import { getAuthCookies, setAuthCookies } from '@/lib/server-auth'

export async function POST() {
  try {
    
    // Obtener cookies de autenticación
    const { refreshToken } = await getAuthCookies()
    
      if (!refreshToken) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })
    
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Token de refresco inválido' }, { status: response.status })
    }
    
    const data = await response.json()
    
    // Actualizar cookies con el nuevo access token
    if (data.access_token) {
      await setAuthCookies(data.access_token, refreshToken) // Mantener el mismo refresh token
    }
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error("❌ Refresh API: Error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { getAuthCookies } from '@/lib/server-auth'

export async function GET() {
  try {
    
    // Obtener cookies de autenticación
    const { accessToken } = await getAuthCookies()
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
    const response = await fetch(`${apiUrl}/auth/perfil`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    
    
    if (!response.ok) {
      return NextResponse.json({ error: 'No autorizado' }, { status: response.status })
    }
    
    const data = await response.json()
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error("❌ Perfil API: Error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

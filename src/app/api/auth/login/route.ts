import { NextRequest, NextResponse } from 'next/server'
import { setAuthCookies } from '@/lib/server-auth'

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 })
  
  // Configurar headers CORS para desarrollo
  if (process.env.NODE_ENV !== 'production') {
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  
  return response
}

export async function POST(request: NextRequest) {
  try {
    
    const body = await request.json()
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
    
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Login failed' }, { status: response.status })
    }
    
    const data = await response.json()
    
    // Configurar cookies
    if (data.access_token) {
      await setAuthCookies(data.access_token, data.refresh_token)
    }
    
    // Crear respuesta con headers CORS
    const nextResponse = NextResponse.json(data)
    
    // Configurar headers CORS para desarrollo
    if (process.env.NODE_ENV !== 'production') {
      nextResponse.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000')
      nextResponse.headers.set('Access-Control-Allow-Credentials', 'true')
      nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }
    
    return nextResponse
    
  } catch (error) {
    console.error("❌ Login API: Error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

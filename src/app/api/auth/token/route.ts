import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL
    
    if (!backendUrl) {
      console.error('❌ NEXT_PUBLIC_API_URL no está configurado')
      return NextResponse.json(
        { 
          success: false, 
          message: 'Configuración del servidor incompleta'
        },
        { status: 500 }
      )
    }

    // Hacer petición al backend
    const response = await fetch(`${backendUrl}/auth/token`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // Pasar las cookies del frontend al backend
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    if (!response.ok) {
      console.error('❌ Error del backend:', response.status, response.statusText)
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error obteniendo token del servidor',
          error: response.statusText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('🚨 Error en API route /api/auth/token:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
} 
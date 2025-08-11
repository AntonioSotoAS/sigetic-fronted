import { NextResponse } from 'next/server'
import { clearAuthCookies } from '@/lib/server-auth'

export async function POST() {
  try {
    
    // Limpiar cookies de autenticación
    await clearAuthCookies()
    
    return NextResponse.json({ 
      message: 'Sesión cerrada exitosamente',
      success: true 
    })
    
  } catch (error) {
    console.error("❌ Logout API: Error:", error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

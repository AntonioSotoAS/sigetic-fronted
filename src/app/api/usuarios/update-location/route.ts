import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/server-auth"

export async function PATCH(request: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies()
    const token = cookieStore.get("access_token")?.value
    if (!token) {
      return NextResponse.json(
        { message: "No autorizado" },
        { status: 401 }
      )
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { message: "Token inválido" },
        { status: 401 }
      )
    }

    // Obtener datos del body
    const body = await request.json()
    const { sede_id, dependencia_id } = body

    // Validaciones básicas
    if (!sede_id || !dependencia_id) {
      return NextResponse.json(
        { message: "La sede_id y dependencia_id son requeridas" },
        { status: 400 }
      )
    }

    // Validar que sean números
    if (typeof sede_id !== 'number' || typeof dependencia_id !== 'number') {
      return NextResponse.json(
        { message: "sede_id y dependencia_id deben ser números" },
        { status: 400 }
      )
    }

    // Llamar al backend para actualizar la ubicación
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    
    const response = await fetch(`${backendUrl}/usuarios/update-location`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        sede_id,
        dependencia_id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("❌ Error del backend:", data)
      return NextResponse.json(
        { message: data.message || "Error al actualizar ubicación" },
        { status: response.status }
      )
    }

    console.log("✅ API ROUTE - Respuesta del backend:", data)

    return NextResponse.json({
      message: "Ubicación actualizada exitosamente",
      success: true,
      user: data.user // Incluir los datos actualizados del usuario
    })

  } catch (error) {
    console.error("❌ Error al actualizar ubicación:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 
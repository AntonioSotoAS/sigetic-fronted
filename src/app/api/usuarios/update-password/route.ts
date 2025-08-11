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
    const { password_actual, password_nuevo } = body

    // Validaciones básicas
    if (!password_actual || !password_nuevo) {
      return NextResponse.json(
        { message: "La contraseña actual y nueva son requeridas" },
        { status: 400 }
      )
    }

    if (password_nuevo.length < 6) {
      return NextResponse.json(
        { message: "La nueva contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      )
    }

    if (password_nuevo.length > 50) {
      return NextResponse.json(
        { message: "La nueva contraseña no puede exceder 50 caracteres" },
        { status: 400 }
      )
    }

    // Llamar al backend para actualizar la contraseña
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    
    const response = await fetch(`${backendUrl}/usuarios/update-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        password_actual,
        password_nuevo,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Error al actualizar contraseña" },
        { status: response.status }
      )
    }

    return NextResponse.json({
      message: "Contraseña actualizada exitosamente",
      success: true,
    })

  } catch (error) {
    console.error("Error al actualizar contraseña:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 
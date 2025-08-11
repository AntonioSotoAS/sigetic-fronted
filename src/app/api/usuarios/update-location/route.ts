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
    const { sede, dependencia } = body

    // Validaciones básicas
    if (!sede || !dependencia) {
      return NextResponse.json(
        { message: "La sede y dependencia son requeridas" },
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
        sede,
        dependencia,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Error al actualizar ubicación" },
        { status: response.status }
      )
    }

    return NextResponse.json({
      message: "Ubicación actualizada exitosamente",
      success: true,
    })

  } catch (error) {
    console.error("Error al actualizar ubicación:", error)
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
} 
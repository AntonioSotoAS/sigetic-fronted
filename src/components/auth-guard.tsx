"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function AuthGuard({ children, requireAuth = true, redirectTo }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Solo ejecutar redirección si no hemos redirigido ya y no está cargando
    if (!isLoading && isAuthenticated !== null && !hasRedirected) {
      if (requireAuth && !isAuthenticated) {
        // Si requiere autenticación pero no está autenticado, redirigir a login
        setHasRedirected(true)
        router.push("/login")
      } else if (!requireAuth && isAuthenticated) {
        // Si no requiere autenticación pero está autenticado, redirigir a dashboard
        setHasRedirected(true)
        router.push("/dashboard")
      } else if (redirectTo && !isAuthenticated) {
        // Si se especifica un redirectTo y no está autenticado, redirigir
        setHasRedirected(true)
        router.push(redirectTo)
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, hasRedirected, redirectTo, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si requiere autenticación y no está autenticado, mostrar mensaje de redirección
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  // Si no requiere autenticación y está autenticado, mostrar mensaje de redirección
  if (!requireAuth && isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al dashboard...</p>
        </div>
      </div>
    )
  }

  // Si hay redirectTo y no está autenticado, mostrar mensaje de redirección
  if (redirectTo && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  // Mostrar el contenido si las condiciones se cumplen
  return <>{children}</>
}

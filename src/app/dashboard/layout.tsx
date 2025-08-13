"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { AuthGuard } from "@/components/auth-guard"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { PasswordResetModal } from "@/components/password-reset-modal"
import { useAuth } from "@/hooks/use-auth"
import { useWebSocketNotifications } from "@/hooks/use-websocket-notifications"
import { useTicketsAutoRefresh } from "@/hooks/use-tickets-auto-refresh"
import { useEffect } from "react"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { showPasswordResetModal, handlePasswordResetSuccess, user, isLoading } = useAuth()
  
  // Inicializar notificaciones de WebSocket
  useWebSocketNotifications()
  
  // Inicializar actualización automática de tickets
  useTicketsAutoRefresh()

  // Verificación adicional para asegurar que el modal se muestre si es necesario
  useEffect(() => {
    if (!isLoading && user && user.password_resetada) {
      // Forzar la verificación de autenticación si el usuario tiene password_resetada
      
      // Verificación adicional con localStorage
      const passwordResetRequired = localStorage.getItem('passwordResetRequired')
      if (passwordResetRequired === 'true') {
        // Modal debe estar activo según localStorage
      }
    }
  }, [user, isLoading])

  // Verificación adicional cada 2 segundos para asegurar que el modal esté activo
  useEffect(() => {
    if (!isLoading && user && user.password_resetada) {
      const interval = setInterval(() => {
        const passwordResetRequired = localStorage.getItem('passwordResetRequired')
        if (passwordResetRequired === 'true' && !showPasswordResetModal) {
          // Forzar la verificación
          window.location.reload()
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [user, isLoading, showPasswordResetModal])

  return (
    <AuthGuard requireAuth={true}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-1 flex-col pb-24 md:pb-0">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
        <MobileBottomNav />
        
        {/* Modal de cambio de contraseña obligatorio */}
        <PasswordResetModal 
          isOpen={showPasswordResetModal} 
          onSuccess={handlePasswordResetSuccess} 
        />
      </SidebarProvider>
    </AuthGuard>
  )
}

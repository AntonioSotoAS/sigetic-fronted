"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import {
  IconDashboard,
  IconTicket,
  IconUsers,
  IconPlus,
  IconUser,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react"

// Definir los elementos del menú móvil con roles permitidos
const mobileMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"]
  },
  {
    title: "Mis Tickets",
    url: "/dashboard/tickets/mis-tickets",
    icon: IconTicket,
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"]
  },
  {
    title: "Crear Ticket",
    url: "/dashboard/crear-ticket",
    icon: IconPlus,
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"],
    isPrimary: true
  },
  {
    title: "Asignados",
    url: "/dashboard/tickets/mis-asignados",
    icon: IconUsers,
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte"]
  },
  {
    title: "Mi Configuración",
    url: "/dashboard/mi-configuracion",
    icon: IconSettings,
    roles: ["superadmin"]
  },
  {
    title: "Perfil",
    url: "/dashboard/perfil",
    icon: IconUser,
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"]
  },
  {
    title: "Cerrar Sesión",
    url: "/logout",
    icon: IconLogout,
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"],
    isLogout: true
  },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Función para filtrar elementos del menú según el rol del usuario
  const filterMenuItems = () => {
    if (!user) return []
    
    return mobileMenuItems.filter(item => {
      if (!item.roles || item.roles.length === 0) return true
      return item.roles.includes(user.rol)
    })
  }

  const filteredItems = filterMenuItems()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around px-2 py-3">
                 {filteredItems.map((item) => {
           const isActive = pathname === item.url
           const Icon = item.icon
           
           // Manejar logout
           if (item.isLogout) {
             return (
               <button
                 key={item.url}
                 onClick={async () => {
                   try {
                     await fetch('/api/auth/logout', {
                       method: 'POST',
                       credentials: 'include',
                     })
                     logout()
                     window.location.href = '/login'
                   } catch (error) {
                     console.error('Error al cerrar sesión:', error)
                   }
                 }}
                 className={cn(
                   "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                   "min-w-0 flex-1 relative",
                   "text-gray-600 hover:text-gray-900"
                 )}
               >
                 <div className="flex flex-col items-center">
                   <div className="flex items-center justify-center w-8 h-8 rounded-full transition-all bg-transparent">
                     <Icon className="w-5 h-5" />
                   </div>
                   <span className="text-xs mt-1 font-medium text-gray-600">
                     {item.title}
                   </span>
                 </div>
               </button>
             )
           }
           
           return (
             <Link
               key={item.url}
               href={item.url}
                              className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                  "min-w-0 flex-1 relative",
                  isActive
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                )}
             >
              {item.isPrimary ? (
                                 // Botón central prominente para crear ticket
                 <div className="flex flex-col items-center">
                   <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all">
                     <Icon className="w-6 h-6" />
                   </div>
                   <span className="text-xs mt-1 font-semibold text-gray-900">
                     {item.title}
                   </span>
                 </div>
              ) : (
                                 // Botones normales
                 <div className="flex flex-col items-center">
                   <div className={cn(
                     "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                     isActive 
                       ? "bg-primary/10" 
                       : "bg-transparent"
                   )}>
                     <Icon className="w-5 h-5" />
                   </div>
                   <span className={cn(
                     "text-xs mt-1 font-medium",
                     isActive ? "text-primary" : "text-gray-600"
                   )}>
                     {item.title}
                   </span>
                 </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
} 
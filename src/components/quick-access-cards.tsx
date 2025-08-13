"use client"

import * as React from "react"
import {
  IconDashboard,
  IconTicket,
  IconUsers,
  IconSettings,
} from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { hasRole } from "@/lib/utils/role-utils"

// Definir los elementos del menú con roles permitidos (igual que en sidebar)
const menuItems = [
  {
    title: "Dashboard",
    description: "Vista general del sistema",
    url: "/dashboard",
    icon: IconDashboard,
    color: "bg-blue-500",
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"]
  },
  {
    title: "Crear Ticket",
    description: "Crear un nuevo ticket de soporte",
    url: "/dashboard/crear-ticket",
    icon: IconTicket,
    color: "bg-green-500",
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"]
  },
  {
    title: "Mis Tickets",
    description: "Ver tickets que he creado",
    url: "/dashboard/tickets/mis-tickets",
    icon: IconTicket,
    color: "bg-orange-500",
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"]
  },
  {
    title: "Tickets sin Asignar",
    description: "Tickets pendientes de asignación",
    url: "/dashboard/tickets/usuarios",
    icon: IconUsers,
    color: "bg-red-500",
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte"]
  },
  {
    title: "Mis Tickets Asignados",
    description: "Tickets asignados a mí para resolver",
    url: "/dashboard/tickets/mis-asignados",
    icon: IconUsers,
    color: "bg-purple-500",
    roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte"]
  },
  {
    title: "Configuración",
    description: "Configuración del sistema",
    url: "/dashboard/configuracion",
    icon: IconDashboard,
    color: "bg-gray-500",
    roles: ["superadmin"]
  },
  {
    title: "Mi Configuración",
    description: "Configuración personal de usuario",
    url: "/dashboard/mi-configuracion",
    icon: IconSettings,
    color: "bg-indigo-500",
    roles: ["superadmin"]
  },
]

export function QuickAccessCards() {
  const { user, isLoading } = useAuth()

  // Mostrar skeleton mientras carga
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-6 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Función para filtrar elementos según el rol del usuario
  const filterMenuItems = () => {
    if (!user || !user.rol) return []
    
    return menuItems.filter(item => {
      // Si no hay roles definidos, permitir acceso a todos
      if (!item.roles || item.roles.length === 0) return true
      
      // Verificar si el rol del usuario está en la lista de roles permitidos
      return hasRole(user.rol, item.roles)
    })
  }

  const filteredItems = filterMenuItems()

  // Si no hay usuario autenticado, mostrar mensaje
  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se pudo cargar la información del usuario</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => {
        const IconComponent = item.icon
        return (
          <Card key={item.url} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${item.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {item.description}
              </p>
              <Button asChild className="w-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <Link href={item.url} className="flex items-center justify-center gap-2">
                  <span>Acceder</span>
                  <IconComponent className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

"use client"

import * as React from "react"
import {
  IconDashboard,
  IconTicket,
  IconUsers,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

// Definir los elementos del menú con roles permitidos
const menuItems = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
      roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"] // Todos los roles pueden ver Dashboard
    },
    {
      title: "Crear Ticket",
      url: "/dashboard/crear-ticket",
      icon: IconTicket,
      roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"] // Todos pueden crear tickets
    },
    {
      title: "Mis Tickets",
      url: "/dashboard/tickets/mis-tickets",
      icon: IconTicket,
      roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte", "usuario"] // Todos pueden ver sus tickets creados
    },
    {
      title: "Tickets sin Asignar",
      url: "/dashboard/tickets/usuarios",
      icon: IconUsers,
      roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte"] // Solo personal técnico puede ver tickets sin asignar
    },
    {
      title: "Mis Tickets Asignados",
      url: "/dashboard/tickets/mis-asignados",
      icon: IconUsers,
      roles: ["superadmin", "admin", "jefe_soporte", "ingeniero_soporte"] // Solo personal técnico puede ver sus tickets asignados
    },
  ],
  navSecondary: [
    {
      title: "Configuración",
      url: "/dashboard/configuracion",
      icon: IconDashboard,
      roles: ["superadmin"] // Solo superadmin puede ver configuración
    },
    {
      title: "Mi Configuración",
      url: "/dashboard/mi-configuracion",
      icon: IconSettings,
      roles: ["superadmin"] // Solo superadmin puede ver su configuración
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  // Función para filtrar elementos del menú según el rol del usuario
  const filterMenuItems = (items: typeof menuItems.navMain | typeof menuItems.navSecondary) => {
    if (!user) return []
    
    return items.filter(item => {
      // Si no hay roles definidos, permitir acceso a todos
      if (!item.roles || item.roles.length === 0) return true
      
      // Verificar si el rol del usuario está en la lista de roles permitidos
      return item.roles.includes(user.rol)
    })
  }

  // Filtrar elementos del menú según el rol del usuario
  const filteredNavMain = filterMenuItems(menuItems.navMain)
  const filteredNavSecondary = filterMenuItems(menuItems.navSecondary)

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SIGETIC</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={filteredNavSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

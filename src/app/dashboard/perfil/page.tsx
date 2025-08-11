"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import UpdatePasswordCard from "@/components/update-password-card"
import UpdateLocationCard from "@/components/update-location-card"

export default function PerfilPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil no disponible</h2>
            <p className="text-gray-600">No se pudo cargar la información del perfil</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mi Perfil</h2>
          <p className="text-gray-600">Información de tu cuenta y configuración</p>
        </div>

        {/* Primera fila: Información Personal y Editar Sede y Dependencia */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información del Usuario */}
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {user.nombres?.charAt(0) || user.correo?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">
                    {user.nombres} {user.apellidos_paterno} {user.apellidos_materno}
                  </h3>
                  <p className="text-sm text-gray-600">{user.correo}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">
                      {user.rol}
                    </Badge>
                    <Badge variant={user.activo ? "default" : "destructive"}>
                      {user.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Nombres:</span>
                  <span className="text-sm">{user.nombres || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Apellido Paterno:</span>
                  <span className="text-sm">{user.apellidos_paterno || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Apellido Materno:</span>
                  <span className="text-sm">{user.apellidos_materno || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">DNI:</span>
                  <span className="text-sm">{user.dni || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Teléfono:</span>
                  <span className="text-sm">{user.telefono || "No especificado"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Correo:</span>
                  <span className="text-sm">{user.correo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Rol:</span>
                  <span className="text-sm capitalize">{user.rol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Estado:</span>
                  <span className="text-sm">{user.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Editar Sede y Dependencia */}
          <UpdateLocationCard />
        </div>

        {/* Segunda fila: Actualizar Contraseña */}
        <div className="mt-6">
          <UpdatePasswordCard />
        </div>
      </div>
    </div>
  )
} 
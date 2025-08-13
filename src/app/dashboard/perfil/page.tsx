"use client"

import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"
import UpdateLocationCard from "@/components/update-location-card"
import ProfileCard from "@/components/profile/profile-card"

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
          {/* Tarjeta de Perfil */}
          <ProfileCard user={user} />

          {/* Editar Sede y Dependencia */}
          <UpdateLocationCard />
        </div>
      </div>
    </div>
  )
} 
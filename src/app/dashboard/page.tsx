"use client"

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { QuickAccessCards } from "@/components/quick-access-cards"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { isLoading } = useAuth()

  // Mostrar skeleton mientras carga la autenticación
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      
    
      {/* Sección de Accesos Rápidos */}
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesos Rápidos</h2>
          <p className="text-gray-600">Navega rápidamente a las funciones principales del sistema</p>
        </div>
        <QuickAccessCards />
      </div>
      
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      {/* DataTable removido temporalmente para evitar el error */}
    </div>
  )
}

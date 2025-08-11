"use client"

import { useState } from "react"
import { TicketCard } from "./ticket-card"
import { useGetMisTicketsCreadosQuery, useCerrarTicketMutation } from "@/store/api/ticketApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"

export function MisTicketsView() {
  const { data: ticketsData, isLoading, refetch } = useGetMisTicketsCreadosQuery()
  const [cerrarTicket] = useCerrarTicketMutation()
  const [cerrandoTicket, setCerrandoTicket] = useState<number | null>(null)
  // const { user } = useAuth()

  // Verificar si ticketsData es un array directo o tiene estructura anidada
  const tickets = Array.isArray(ticketsData) ? ticketsData : ticketsData?.data || []

  const handleCerrarTicket = async (ticketId: number) => {
    try {
      setCerrandoTicket(ticketId)
      await cerrarTicket(ticketId).unwrap()
      refetch()
    } catch (error) {
      console.error("Error al cerrar el ticket:", error)
    } finally {
      setCerrandoTicket(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mis tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-lg lg:text-xl">
                Mis Tickets
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Estos son todos los tickets que he creado para solicitar soporte.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {tickets.length} tickets creados
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de tickets */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 lg:py-12">
            <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No has creado tickets</h3>
            <p className="text-sm lg:text-base text-gray-600 mb-4">Aún no has creado ningún ticket de soporte.</p>
            <Button 
              onClick={() => window.location.href = '/dashboard/crear-ticket'}
              className="bg-red-600 hover:bg-red-700"
            >
              Crear mi primer ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6">
          {tickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket}
              onAsignar={undefined}
              isAsignando={false}
              onCerrar={() => handleCerrarTicket(ticket.id)}
              isCerrando={cerrandoTicket === ticket.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

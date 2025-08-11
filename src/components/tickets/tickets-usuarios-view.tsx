"use client"

import { useState } from "react"
import { TicketCard } from "./ticket-card"
import { useGetTicketsSinAsignarMiSedeQuery } from "@/store/api/ticketApi"
import { useUpdateTicketMutation } from "@/store/api/ticketApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-hot-toast"
import { EstadoTicket } from "@/types/ticket"
import { useAuth } from "@/hooks/use-auth"


export function TicketsUsuariosView() {
  const { data: ticketsData, isLoading, refetch } = useGetTicketsSinAsignarMiSedeQuery()
  const [updateTicket] = useUpdateTicketMutation()
  const [asignandoTicket, setAsignandoTicket] = useState<number | null>(null)
  const { user } = useAuth()

  // Verificar si ticketsData es un array directo o tiene estructura anidada
  const tickets = Array.isArray(ticketsData) ? ticketsData : ticketsData?.data || []

  const handleAsignarTicket = async (ticketId: number) => {
    try {
      setAsignandoTicket(ticketId)
      
      // Usar el usuario autenticado como técnico
      const tecnicoId = user?.id || 0
      
      await updateTicket({
        id: ticketId,
        data: {
          estado: EstadoTicket.ASIGNADO,
          tecnico_id: tecnicoId
        }
      }).unwrap()

      toast.success("Ticket asignado exitosamente")
      refetch() // Recargar la lista
      } catch {
    toast.error("Error al asignar el ticket")
  } finally {
      setAsignandoTicket(null)
    }
  }

  const handleAsignarTodos = async () => {
    try {
      const ticketsPendientes = tickets.filter(t => t.estado === EstadoTicket.PENDIENTE)
      
             for (const ticket of ticketsPendientes) {
         await updateTicket({
           id: ticket.id,
           data: {
             estado: EstadoTicket.ASIGNADO,
             tecnico_id: user?.id || 0
           }
         }).unwrap()
       }

      toast.success(`${ticketsPendientes.length} tickets asignados exitosamente`)
      refetch()
      } catch {
    toast.error("Error al asignar tickets")
  }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Tickets sin asignar</CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Estos son todos los tickets enviados por los usuarios que solicitan soporte.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {tickets.length} tickets pendientes
              </Badge>
              {tickets.length > 0 && (
                <Button
                  onClick={handleAsignarTodos}
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Asignar todos
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {tickets.filter(t => t.prioridad === 'urgente').length}
              </div>
              <div className="text-sm text-blue-800">Urgentes</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {tickets.filter(t => t.prioridad === 'alta').length}
              </div>
              <div className="text-sm text-yellow-800">Alta prioridad</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.prioridad === 'media').length}
              </div>
              <div className="text-sm text-green-800">Media prioridad</div>
            </div>
          </div>
        </CardContent>
      </Card>

      

      {/* Lista de tickets */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tickets pendientes</h3>
            <p className="text-gray-600 mb-4">Todos los tickets han sido asignados o no hay solicitudes nuevas.</p>
            
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {tickets.map((ticket) => (
            <TicketCard 
              key={ticket.id} 
              ticket={ticket}
              onAsignar={() => handleAsignarTicket(ticket.id)}
              isAsignando={asignandoTicket === ticket.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

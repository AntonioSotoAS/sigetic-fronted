"use client"

import { useState, useMemo } from "react"
import { TicketCard } from "./ticket-card"
import { useGetMisTicketsAsignadosQuery } from "@/store/api/ticketApi"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Ticket } from "@/types/ticket"


export function MisTicketsAsignadosView() {
  const { data: ticketsData, isLoading } = useGetMisTicketsAsignadosQuery()
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")

  // Verificar si ticketsData es un array directo o tiene estructura anidada
  const tickets = useMemo(() => {
    return Array.isArray(ticketsData) ? ticketsData : ticketsData?.data || []
  }, [ticketsData])

  // Filtrar tickets según el estado seleccionado
  const ticketsFiltrados = useMemo(() => {
    if (filtroEstado === "todos") return tickets
    
    return tickets.filter((ticket: Ticket) => {
      switch (filtroEstado) {
        case "cerrados":
          return ticket.estado === "cerrado"
        case "pendientes":
          return ticket.estado === "pendiente"
        default:
          return true
      }
    })
  }, [tickets, filtroEstado])

  // Contar tickets por estado
  const estadisticas = useMemo(() => {
    return {
      todos: tickets.length,
      cerrados: tickets.filter((t: Ticket) => t.estado === "cerrado").length,
      pendientes: tickets.filter((t: Ticket) => t.estado === "pendiente").length,
    }
  }, [tickets])



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando mis tickets asignados...</p>
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
                Mis Tickets Asignados
              </CardTitle>
              <p className="text-gray-600 text-sm mt-1">
                Estos son todos los tickets que me han sido asignados para atender.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {ticketsFiltrados.length} de {tickets.length} tickets
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

             {/* Filtros */}
       <Card>
         <CardContent className="p-4">
           <div className="flex flex-wrap gap-2 lg:gap-3">
             <Button
               variant={filtroEstado === "todos" ? "default" : "outline"}
               size="sm"
               onClick={() => setFiltroEstado("todos")}
               className="text-xs lg:text-sm"
             >
               Todos ({estadisticas.todos})
             </Button>
             <Button
               variant={filtroEstado === "cerrados" ? "default" : "outline"}
               size="sm"
               onClick={() => setFiltroEstado("cerrados")}
               className="text-xs lg:text-sm bg-gray-600 hover:bg-gray-700"
             >
               Cerrados ({estadisticas.cerrados})
             </Button>
             <Button
               variant={filtroEstado === "pendientes" ? "default" : "outline"}
               size="sm"
               onClick={() => setFiltroEstado("pendientes")}
               className="text-xs lg:text-sm bg-yellow-600 hover:bg-yellow-700"
             >
               Pendientes ({estadisticas.pendientes})
             </Button>
           </div>
         </CardContent>
       </Card>

      {/* Lista de tickets */}
      {ticketsFiltrados.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 lg:py-12">
            <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">
              {tickets.length === 0 ? "No tienes tickets asignados" : "No hay tickets con el filtro seleccionado"}
            </h3>
            <p className="text-sm lg:text-base text-gray-600 mb-4">
              {tickets.length === 0 
                ? "No se te han asignado tickets para atender en este momento." 
                : "Intenta cambiar el filtro para ver otros tickets."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 xl:gap-6">
           {ticketsFiltrados.map((ticket) => (
             <TicketCard 
               key={ticket.id} 
               ticket={ticket}
               onAsignar={undefined}
               isAsignando={false}
               onCerrar={undefined}
               isCerrando={false}
             />
           ))}
         </div>
      )}
    </div>
  )
}

"use client"

import { useGetTicketsSinAsignarMiSedeQuery } from "@/store/api/ticketApi"
import { useTicketsAutoRefresh } from "@/hooks/use-tickets-auto-refresh"
import { TicketCard } from "./ticket-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useUpdateTicketMutation } from "@/store/api/ticketApi"
import { EstadoTicket } from "@/types/ticket"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

export function TicketsWithAutoRefresh() {
  const router = useRouter()
  const { user } = useAuth()
  const { data: ticketsData, isLoading, refetch } = useGetTicketsSinAsignarMiSedeQuery()
  const [updateTicket] = useUpdateTicketMutation()
  const { isConnected } = useTicketsAutoRefresh()

  // Verificar si ticketsData es un array directo o tiene estructura anidada
  const tickets = Array.isArray(ticketsData) ? ticketsData : ticketsData?.data || []

  const handleAsignarTicket = async (ticketId: number) => {
    try {
      // Usar el usuario autenticado como técnico
      const tecnicoId = user?.id || 0
      
      const updateData = {
        id: ticketId,
        data: {
          estado: EstadoTicket.ASIGNADO,
          tecnico_id: tecnicoId
        }
      }
      
      await updateTicket(updateData).unwrap()
      toast.success("Ticket asignado exitosamente")
      
      // Redirigir a "Mis Tickets Asignados" después de asignar exitosamente
      setTimeout(() => {
        router.push('/dashboard/tickets/mis-asignados')
      }, 1000)
      
    } catch {
      toast.error("Error al asignar el ticket")
    }
  }

  const handleActualizarManual = () => {
    refetch()
    toast.success("Lista actualizada manualmente")
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando tickets...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estado de conexión y controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Tickets Sin Asignar - Mi Sede
                <Badge variant="outline" className="ml-2">
                  {tickets.length} tickets
                </Badge>
              </CardTitle>
              <CardDescription>
                Tickets de {user?.sede?.nombre || 'tu sede'} esperando asignación
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Estado de WebSocket */}
              <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
                {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                <span className="hidden sm:inline">
                  {isConnected ? "Conectado" : "Desconectado"}
                </span>
              </Badge>
              
              {/* Botón de actualización manual */}
              <Button 
                onClick={handleActualizarManual}
                variant="outline" 
                size="sm"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Lista de tickets */}
      {tickets.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-muted-foreground">
                No hay tickets sin asignar en tu sede
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Los tickets aparecerán automáticamente cuando se creen nuevos
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onAsignar={() => handleAsignarTicket(ticket.id)}
              isAsignando={false}
              onCerrar={() => {}}
              isCerrando={false}
            />
          ))}
        </div>
      )}

      {/* Información sobre actualización automática */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <RefreshCw className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Actualización Automática</h4>
              <p className="text-sm text-blue-700 mt-1">
                Esta lista se actualiza automáticamente cuando:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Se crea un nuevo ticket en tu sede</li>
                <li>• Se asigna un ticket a un técnico</li>
                <li>• Cambia el estado de un ticket</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                Estado WebSocket: {isConnected ? "Conectado" : "Desconectado"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
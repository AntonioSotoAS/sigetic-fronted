import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket } from "@/types/ticket"

interface TicketCardProps {
  ticket: Ticket
  onAsignar?: () => void
  isAsignando?: boolean
}

const getPrioridadColors = (prioridad: string) => {
  switch (prioridad) {
    case 'urgente':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        dot: 'bg-red-500'
      }
    case 'alta':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        dot: 'bg-orange-500'
      }
    case 'media':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        dot: 'bg-yellow-500'
      }
    case 'baja':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        dot: 'bg-green-500'
      }
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        dot: 'bg-gray-500'
      }
  }
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function TicketCard({ ticket, onAsignar, isAsignando }: TicketCardProps) {
  const colors = getPrioridadColors(ticket.prioridad)
  const nombreCompleto = `${ticket.user.nombres} ${ticket.user.apellidos_paterno} ${ticket.user.apellidos_materno}`
  const cargo = `${ticket.dependencia.nombre} | ${ticket.user.rol}`
  const fechaCreacion = formatDate(ticket.created_at)

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4 lg:p-6">
        {/* Header with priority, category and date */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div className="flex items-center space-x-3">
            <Badge className={`${colors.bg} ${colors.text} border-0 text-xs`}>
              <div className={`w-2 h-2 rounded-full ${colors.dot} mr-2`}></div>
              {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
            </Badge>
            <span className="text-sm text-gray-600 capitalize">{ticket.categoria?.nombre || 'Sin categoría'}</span>
          </div>
          <span className="text-sm text-gray-600">{fechaCreacion}</span>
        </div>

        {/* Title of the ticket */}
        <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base">{ticket.titulo}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{ticket.descripcion}</p>

        {/* User information */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-sm text-gray-900 truncate">{nombreCompleto}</p>
              <p className="text-xs text-gray-600 truncate">{cargo}</p>
            </div>
          </div>
          {onAsignar && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={onAsignar}
              disabled={isAsignando}
            >
              {isAsignando ? "Asignando..." : "Asignar ticket"}
            </Button>
          )}
        </div>

        {/* Additional info */}
        <div className="space-y-2 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Sede:</span>
            <span>{ticket.sede.nombre} - {ticket.sede.ciudad}</span>
          </div>
          <div className="flex justify-between">
            <span>Estado:</span>
            <Badge variant="outline" className="text-xs">
              {ticket.estado.charAt(0).toUpperCase() + ticket.estado.slice(1)}
            </Badge>
          </div>
          {ticket.comentarios_ticket && ticket.comentarios_ticket.length > 0 && (
            <div className="pt-2 border-t border-gray-100">
              <span className="font-medium">Comentarios:</span>
              <div className="mt-1 space-y-1">
                {ticket.comentarios_ticket.slice(0, 2).map((comentario) => (
                  <p key={comentario.id} className="text-gray-600 text-xs">
                    {comentario.comentario}
                  </p>
                ))}
                {ticket.comentarios_ticket.length > 2 && (
                  <p className="text-gray-500 text-xs">
                    +{ticket.comentarios_ticket.length - 2} comentarios más
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ticket number */}
        <div className="text-center mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">Ticket #{ticket.id}</span>
        </div>
      </CardContent>
    </Card>
  )
}

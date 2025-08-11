import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Ticket } from "@/types/ticket"

interface TicketCardProps {
  ticket: Ticket
  onAsignar?: () => void
  isAsignando?: boolean
  onCerrar?: () => void
  isCerrando?: boolean
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

export function TicketCard({ ticket, onAsignar, isAsignando, onCerrar, isCerrando }: TicketCardProps) {
  const colors = getPrioridadColors(ticket.prioridad)
  
  // Validar que ticket.user existe antes de acceder a sus propiedades
  const nombreCompleto = ticket.user 
    ? `${ticket.user.nombres} ${ticket.user.apellidos_paterno} ${ticket.user.apellidos_materno}`
    : 'Usuario no disponible'
  
  const cargo = ticket.user 
    ? `${ticket.dependencia?.nombre || 'Sin dependencia'} | ${ticket.user.cargo || 'Sin cargo'}`
    : `${ticket.dependencia?.nombre || 'Sin dependencia'} | Sin usuario`
  
  const fechaCreacion = formatDate(ticket.created_at)

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-3 lg:p-4 xl:p-6">
        {/* Header with priority, category and date */}
        <div className="flex flex-col gap-2 mb-3 lg:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Badge className={`${colors.bg} ${colors.text} border-0 text-xs`}>
                <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${colors.dot} mr-1 lg:mr-2`}></div>
                {ticket.prioridad.charAt(0).toUpperCase() + ticket.prioridad.slice(1)}
              </Badge>
              <span className="text-xs lg:text-sm text-gray-600 capitalize">
                {ticket.categoria ? ticket.categoria.nombre : 'Sin categoría'}
              </span>
            </div>
            <span className="text-xs lg:text-sm text-gray-600">{fechaCreacion}</span>
          </div>
        </div>

        {/* Title of the ticket */}
        <h3 className="font-bold text-gray-900 mb-2 text-sm lg:text-base line-clamp-2">{ticket.titulo}</h3>

        {/* Description */}
        <p className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4 line-clamp-3">{ticket.descripcion}</p>

        {/* User information and button */}
        <div className="flex flex-col gap-3 lg:gap-4 mb-3 lg:mb-4">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-xs lg:text-sm text-gray-900 truncate">{nombreCompleto}</p>
              <p className="text-xs text-gray-600 truncate">{cargo}</p>
            </div>
          </div>
          {onAsignar && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-red-600 hover:bg-red-700 text-white border-red-600 text-xs lg:text-sm"
              onClick={onAsignar}
              disabled={isAsignando}
            >
              {isAsignando ? "Asignando..." : "Asignar ticket"}
            </Button>
          )}
          {onCerrar && ticket.estado !== 'cerrado' && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-green-600 hover:bg-green-700 text-white border-green-600 text-xs lg:text-sm"
              onClick={onCerrar}
              disabled={isCerrando}
            >
              {isCerrando ? "Cerrando..." : "Cerrar ticket"}
            </Button>
          )}
          {ticket.estado === 'cerrado' && (
            <div className="w-full p-2 bg-gray-100 rounded text-center">
              <span className="text-xs text-gray-600 font-medium">
                Cerrado el {new Date(ticket.fecha_cierre || '').toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Location info - Prominent */}
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold text-sm text-blue-800">Ubicación de Atención:</span>
            </div>
            <div className="ml-6 space-y-1">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-700">Sede:</span>
                <span className="text-sm text-blue-800 font-semibold">
                  {ticket.sede ? `${ticket.sede.nombre} - ${ticket.sede.ciudad}` : 'Sede no disponible'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-blue-700">Dependencia:</span>
                <span className="text-sm text-blue-800 font-semibold">
                  {ticket.dependencia ? ticket.dependencia.nombre : 'Dependencia no disponible'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="space-y-1.5 lg:space-y-2 text-xs text-gray-500">
          <div className="flex justify-between items-center">
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
                  <p key={comentario.id} className="text-gray-600 text-xs line-clamp-2">
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
        <div className="text-center mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">Ticket #{ticket.id}</span>
        </div>
      </CardContent>
    </Card>
  )
}

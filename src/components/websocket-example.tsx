"use client"

import { useEffect, useState } from 'react'
import { useWebSocket, TicketEvent, TicketAssignmentEvent, TicketStatusChangeEvent } from '@/hooks/use-websocket'
import { useTicketsAutoRefresh } from '@/hooks/use-tickets-auto-refresh'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, Ticket, User, Building, Wifi, RefreshCw } from 'lucide-react'

export const WebSocketExample = () => {
  const { socket, isConnected, connectionError, emit } = useWebSocket()
  const { refreshAllTicketLists, refreshTicketsMiSede } = useTicketsAutoRefresh()
  const [recentEvents, setRecentEvents] = useState<Array<{
    type: string
    data: unknown
    timestamp: Date
  }>>([])

  // Función para agregar eventos recientes
  const addRecentEvent = (type: string, data: unknown) => {
    setRecentEvents(prev => [
      {
        type,
        data,
        timestamp: new Date()
      },
      ...prev.slice(0, 9) // Mantener solo los últimos 10 eventos
    ])
  }

  // Escuchar eventos de WebSocket
  useEffect(() => {
    if (!isConnected) return

    const handleTicketCreated = (event: CustomEvent<TicketEvent>) => {
      addRecentEvent('ticket.created', event.detail)
    }

    const handleTicketAssigned = (event: CustomEvent<TicketAssignmentEvent>) => {
      addRecentEvent('ticket.assigned', event.detail)
    }

    const handleTicketStatusChanged = (event: CustomEvent<TicketStatusChangeEvent>) => {
      addRecentEvent('ticket.status_changed', event.detail)
    }

    const handleSedeEvent = (event: CustomEvent<unknown>) => {
      addRecentEvent('sede.event', event.detail)
    }

    const handleTecnicoEvent = (event: CustomEvent<unknown>) => {
      addRecentEvent('tecnico.event', event.detail)
    }

    const handleUserEvent = (event: CustomEvent<unknown>) => {
      addRecentEvent('user.event', event.detail)
    }

    // Agregar event listeners
    window.addEventListener('ticket:created', handleTicketCreated as EventListener)
    window.addEventListener('ticket:assigned', handleTicketAssigned as EventListener)
    window.addEventListener('ticket:status_changed', handleTicketStatusChanged as EventListener)
    window.addEventListener('sede:event', handleSedeEvent as EventListener)
    window.addEventListener('tecnico:event', handleTecnicoEvent as EventListener)
    window.addEventListener('user:event', handleUserEvent as EventListener)

    // Limpiar event listeners
    return () => {
      window.removeEventListener('ticket:created', handleTicketCreated as EventListener)
      window.removeEventListener('ticket:assigned', handleTicketAssigned as EventListener)
      window.removeEventListener('ticket:status_changed', handleTicketStatusChanged as EventListener)
      window.removeEventListener('sede:event', handleSedeEvent as EventListener)
      window.removeEventListener('tecnico:event', handleTecnicoEvent as EventListener)
      window.removeEventListener('user:event', handleUserEvent as EventListener)
    }
  }, [isConnected])

  // Función para emitir un evento de prueba
  const emitTestEvent = () => {
    if (socket && isConnected) {
      emit('test.event', {
        message: 'Evento de prueba desde el frontend',
        timestamp: new Date().toISOString()
      })
    }
  }

  // Función para limpiar eventos recientes
  const clearRecentEvents = () => {
    setRecentEvents([])
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'ticket.created':
        return <Ticket className="h-4 w-4" />
      case 'ticket.assigned':
        return <User className="h-4 w-4" />
      case 'ticket.status_changed':
        return <Bell className="h-4 w-4" />
      case 'sede.event':
        return <Building className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ticket.created':
        return 'bg-green-100 text-green-800'
      case 'ticket.assigned':
        return 'bg-blue-100 text-blue-800'
      case 'ticket.status_changed':
        return 'bg-yellow-100 text-yellow-800'
      case 'sede.event':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Estado de conexión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Estado de WebSocket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Conectado" : "Desconectado"}
            </Badge>
            {connectionError && (
              <span className="text-sm text-red-600">
                Error: {connectionError}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={emitTestEvent} 
              disabled={!isConnected}
              size="sm"
            >
              Emitir evento de prueba
            </Button>
            
            <Button 
              onClick={refreshAllTicketLists} 
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Actualizar todos los tickets
            </Button>
            
            <Button 
              onClick={refreshTicketsMiSede} 
              disabled={!isConnected}
              size="sm"
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Tickets de mi sede
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Eventos recientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Eventos Recientes</span>
            <Button 
              onClick={clearRecentEvents} 
              variant="outline" 
              size="sm"
            >
              Limpiar
            </Button>
          </CardTitle>
          <CardDescription>
            Últimos eventos recibidos del WebSocket
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay eventos recientes
            </p>
          ) : (
            <div className="space-y-2">
              {recentEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  {getEventIcon(event.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getEventColor(event.type)}>
                        {event.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <pre className="text-xs mt-1 bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
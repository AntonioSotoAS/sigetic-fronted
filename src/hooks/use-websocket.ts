"use client"

import { useEffect, useRef, useCallback, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './use-auth'
import { getWebSocketConfig } from '@/lib/websocket-config'
import { getCargoNombre } from '@/lib/utils/role-utils'

export interface TicketEvent {
  id: number
  titulo: string
  descripcion: string
  estado: string
  prioridad: string
  sede_id: number
  dependencia_id: number
  tecnico_id?: number
  usuario_id: number
  created_at: string
  updated_at: string
}

export interface TicketStatusChangeEvent {
  ticket_id: number
  estado_anterior: string
  estado_nuevo: string
  tecnico_id?: number
  timestamp: string
}

export interface TicketAssignmentEvent {
  ticket_id: number
  tecnico_id: number
  tecnico_nombre: string
  timestamp: string
}

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null)
  const { user, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Función para obtener el token desde el servidor
  const getTokenFromServer = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.token
      }
      
      return null
    } catch (error) {
      console.error('Error obteniendo token:', error)
      return null
    }
  }, [])

  // Función para conectar al WebSocket
  const connect = useCallback(async () => {
    console.log('🔌 WebSocket: Iniciando conexión...', { isAuthenticated, user: user?.id })
    
    if (!isAuthenticated || !user) {
      console.log('❌ WebSocket: No autenticado o sin usuario, abortando conexión')
      return
    }

    // Obtener token desde el servidor
    console.log('🔑 WebSocket: Obteniendo token...')
    const token = await getTokenFromServer()
    
    if (!token) {
      console.log('❌ WebSocket: No se pudo obtener token')
      setConnectionError('No se encontró token de autenticación')
      return
    }

    console.log('✅ WebSocket: Token obtenido correctamente')

    // Desconectar si ya existe una conexión
    if (socketRef.current) {
      console.log('🔄 WebSocket: Desconectando conexión existente...')
      socketRef.current.disconnect()
    }

    const config = getWebSocketConfig()
    console.log('⚙️ WebSocket: Configuración:', { url: config.url, options: config.options })
    
    // Crear nueva conexión
    console.log('🔌 WebSocket: Creando nueva conexión...')
    socketRef.current = io(config.url, {
      auth: { token },
      ...config.options,
    })

    // Eventos de conexión
    socketRef.current.on('connect', () => {
      console.log('✅ WebSocket: Conectado exitosamente')
      setIsConnected(true)
      setConnectionError(null)
    })

    socketRef.current.on('disconnect', (reason) => {
      console.log('❌ WebSocket: Desconectado:', reason)
      setIsConnected(false)
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('🚨 WebSocket: Error de conexión:', error)
      setConnectionError(error.message)
      setIsConnected(false)
    })

    socketRef.current.on('reconnect', (attemptNumber) => {
      console.log('🔄 WebSocket: Reconectado en intento:', attemptNumber)
      setIsConnected(true)
      setConnectionError(null)
    })

    socketRef.current.on('reconnect_error', (error) => {
      console.error('🚨 WebSocket: Error de reconexión:', error)
      setConnectionError(error.message)
    })

    // Eventos de tickets
    socketRef.current.on('ticket.created', (data: TicketEvent) => {
      console.log('🎫 WebSocket: Evento ticket.created recibido:', data.id)
      window.dispatchEvent(new CustomEvent('ticket:created', { detail: data }))
    })

    socketRef.current.on('ticket.assigned', (data: TicketAssignmentEvent) => {
      console.log('👨‍💼 WebSocket: Evento ticket.assigned recibido:', data.ticket_id)
      window.dispatchEvent(new CustomEvent('ticket:assigned', { detail: data }))
    })

    socketRef.current.on('ticket.status_changed', (data: TicketStatusChangeEvent) => {
      console.log('🔄 WebSocket: Evento ticket.status_changed recibido:', data.ticket_id)
      window.dispatchEvent(new CustomEvent('ticket:status_changed', { detail: data }))
    })

    socketRef.current.on('tickets:unassigned', (data: TicketEvent[]) => {
      console.log('📋 WebSocket: Evento tickets:unassigned recibido:', data.length, 'tickets')
      window.dispatchEvent(new CustomEvent('tickets:unassigned', { detail: data }))
    })

    // Eventos específicos por sala
    if (user.sede?.id) {
      console.log('🏢 WebSocket: Suscribiendo a eventos de sede:', user.sede.id)
      socketRef.current.on(`sede:${user.sede.id}`, (data: unknown) => {
        console.log('🏢 WebSocket: Evento de sede recibido:', data)
        window.dispatchEvent(new CustomEvent('sede:event', { detail: data }))
      })
    }

    const cargoNombre = getCargoNombre(user.cargo)
    if (cargoNombre.toLowerCase().includes('tecnico')) {
      console.log('🔧 WebSocket: Suscribiendo a eventos de técnico:', user.id)
      socketRef.current.on(`tecnico:${user.id}`, (data: unknown) => {
        console.log('🔧 WebSocket: Evento de técnico recibido:', data)
        window.dispatchEvent(new CustomEvent('tecnico:event', { detail: data }))
      })
    }

    // Evento personal del usuario
    console.log('👤 WebSocket: Suscribiendo a eventos personales:', user.id)
    socketRef.current.on(`user:${user.id}`, (data: unknown) => {
      console.log('👤 WebSocket: Evento personal recibido:', data)
      window.dispatchEvent(new CustomEvent('user:event', { detail: data }))
    })

  }, [isAuthenticated, user, getTokenFromServer])

  // Función para desconectar
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 WebSocket: Desconectando...')
      socketRef.current.disconnect()
      socketRef.current = null
      setIsConnected(false)
    }
  }, [])

  // Función para emitir eventos
  const emit = useCallback((event: string, data: unknown) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data)
    } else {
      console.warn('⚠️ WebSocket no conectado, no se puede emitir evento:', event)
    }
  }, [isConnected])

  // Conectar cuando el usuario se autentica
  useEffect(() => {
    console.log('🔄 WebSocket: useEffect - Estado de autenticación cambiado:', { isAuthenticated, userId: user?.id })
    
    if (isAuthenticated && user) {
      console.log('✅ WebSocket: Usuario autenticado, conectando...')
      connect()
    } else {
      console.log('❌ WebSocket: Usuario no autenticado, desconectando...')
      disconnect()
    }

    // Limpiar al desmontar
    return () => {
      console.log('🧹 WebSocket: Limpiando al desmontar...')
      disconnect()
    }
  }, [isAuthenticated, user, connect, disconnect])

  // Reconectar cuando cambia el token
  useEffect(() => {
    const handleStorageChange = () => {
      if (isAuthenticated && user) {
        connect()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [isAuthenticated, user, connect])

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
    emit,
  }
} 
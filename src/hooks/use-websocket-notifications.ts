"use client"

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useWebSocket, TicketEvent, TicketAssignmentEvent, TicketStatusChangeEvent } from './use-websocket'
import { useAuth } from './use-auth'
import { useGetTicketsSinAsignarMiSedeQuery } from '@/store/api/ticketApi'

export const useWebSocketNotifications = () => {
  const { user } = useAuth()
  const { isConnected } = useWebSocket()
  
  // Query para obtener tickets sin asignar de mi sede
  const { refetch: refetchTicketsMiSede } = useGetTicketsSinAsignarMiSedeQuery()

  // Función para reproducir sonido de notificación
  const playNotificationSound = useCallback(() => {
    try {
      // Crear un audio context para reproducir un beep simple
      const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const audioContext = new AudioContextClass()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.2)
    } catch (error) {
      console.warn('No se pudo reproducir sonido de notificación:', error)
    }
  }, [])

  // Manejar nuevo ticket creado
  const handleTicketCreated = useCallback((event: CustomEvent<TicketEvent>) => {
    const ticket = event.detail
    
    // Verificar si el ticket es de la sede del usuario actual
    const isTicketFromMySede = ticket.sede_id === user?.sede?.id
    
    // Solo mostrar notificación si no es del usuario actual
    if (ticket.usuario_id !== user?.id) {
      playNotificationSound()
      
      toast.success('🎫 Nuevo ticket creado', {
        description: `${ticket.titulo} - ${ticket.descripcion.substring(0, 50)}...`,
        duration: 5000,
        action: {
          label: 'Ver',
          onClick: () => {
            // Aquí puedes navegar al ticket o abrir un modal
            console.log('Navegar al ticket:', ticket.id)
          }
        }
      })
    }
    
    // Si el ticket es de mi sede, actualizar la lista de tickets
    if (isTicketFromMySede) {
      console.log('🔄 Actualizando tickets de mi sede...')
      refetchTicketsMiSede()
    }
  }, [user?.id, user?.sede?.id, playNotificationSound, refetchTicketsMiSede])

  // Manejar ticket asignado
  const handleTicketAssigned = useCallback((event: CustomEvent<TicketAssignmentEvent>) => {
    const assignment = event.detail
    
    // Solo mostrar notificación si es asignado al usuario actual
    if (assignment.tecnico_id === user?.id) {
      playNotificationSound()
      
      toast.info('👨‍💼 Ticket asignado', {
        description: `Se te ha asignado el ticket #${assignment.ticket_id}`,
        duration: 5000,
        action: {
          label: 'Ver',
          onClick: () => {
            console.log('Navegar al ticket asignado:', assignment.ticket_id)
          }
        }
      })
    }
    
    // Actualizar la lista de tickets de mi sede cuando se asigne un ticket
    console.log('🔄 Actualizando tickets de mi sede después de asignación...')
    refetchTicketsMiSede()
  }, [user?.id, playNotificationSound, refetchTicketsMiSede])

  // Manejar cambio de estado de ticket
  const handleTicketStatusChanged = useCallback((event: CustomEvent<TicketStatusChangeEvent>) => {
    const statusChange = event.detail
    
    // Mostrar notificación para cambios de estado importantes
    const importantStates = ['en_proceso', 'resuelto', 'cerrado', 'cancelado']
    
    if (importantStates.includes(statusChange.estado_nuevo)) {
      playNotificationSound()
      
      const statusMessages = {
        'en_proceso': '🔄 Ticket en proceso',
        'resuelto': '✅ Ticket resuelto',
        'cerrado': '🔒 Ticket cerrado',
        'cancelado': '❌ Ticket cancelado'
      }
      
      toast.info(statusMessages[statusChange.estado_nuevo as keyof typeof statusMessages] || 'Estado cambiado', {
        description: `Ticket #${statusChange.ticket_id} cambió de "${statusChange.estado_anterior}" a "${statusChange.estado_nuevo}"`,
        duration: 4000
      })
    }
    
    // Actualizar la lista de tickets de mi sede cuando cambie el estado
    console.log('🔄 Actualizando tickets de mi sede después de cambio de estado...')
    refetchTicketsMiSede()
  }, [playNotificationSound, refetchTicketsMiSede])

  // Manejar tickets sin asignar (solo para técnicos y admins)
  const handleUnassignedTickets = useCallback((event: CustomEvent<TicketEvent[]>) => {
    const unassignedTickets = event.detail
    
    // Solo mostrar notificación para técnicos y admins
    if (user?.cargo?.nombre?.toLowerCase().includes('tecnico') || user?.cargo?.nombre?.toLowerCase().includes('admin')) {
      if (unassignedTickets.length > 0) {
        playNotificationSound()
        
        toast.warning('📋 Tickets sin asignar', {
          description: `Hay ${unassignedTickets.length} ticket(s) esperando asignación`,
          duration: 6000,
          action: {
            label: 'Ver',
            onClick: () => {
              console.log('Navegar a tickets sin asignar')
            }
          }
        })
      }
    }
  }, [user?.cargo, playNotificationSound])

  // Tipos para eventos
  interface SedeEvent {
    message?: string
    [key: string]: unknown
  }

  interface TecnicoEvent {
    message?: string
    [key: string]: unknown
  }

  interface UserEvent {
    message?: string
    [key: string]: unknown
  }

  // Manejar eventos de sede
  const handleSedeEvent = useCallback((event: CustomEvent<SedeEvent>) => {
    const sedeEvent = event.detail
    
    playNotificationSound()
    
    toast.info('🏢 Evento de sede', {
      description: sedeEvent.message || 'Nuevo evento en tu sede',
      duration: 4000
    })
  }, [playNotificationSound])

  // Manejar eventos de técnico
  const handleTecnicoEvent = useCallback((event: CustomEvent<TecnicoEvent>) => {
    const tecnicoEvent = event.detail
    
    playNotificationSound()
    
    toast.info('🔧 Evento de técnico', {
      description: tecnicoEvent.message || 'Nuevo evento para técnico',
      duration: 4000
    })
  }, [playNotificationSound])

  // Manejar eventos personales del usuario
  const handleUserEvent = useCallback((event: CustomEvent<UserEvent>) => {
    const userEvent = event.detail
    
    playNotificationSound()
    
    toast.info('👤 Notificación personal', {
      description: userEvent.message || 'Tienes una nueva notificación',
      duration: 4000
    })
  }, [playNotificationSound])

  // Configurar event listeners
  useEffect(() => {
    if (!isConnected) return

    // Agregar event listeners
    window.addEventListener('ticket:created', handleTicketCreated as EventListener)
    window.addEventListener('ticket:assigned', handleTicketAssigned as EventListener)
    window.addEventListener('ticket:status_changed', handleTicketStatusChanged as EventListener)
    window.addEventListener('tickets:unassigned', handleUnassignedTickets as EventListener)
    window.addEventListener('sede:event', handleSedeEvent as EventListener)
    window.addEventListener('tecnico:event', handleTecnicoEvent as EventListener)
    window.addEventListener('user:event', handleUserEvent as EventListener)

    // Limpiar event listeners
    return () => {
      window.removeEventListener('ticket:created', handleTicketCreated as EventListener)
      window.removeEventListener('ticket:assigned', handleTicketAssigned as EventListener)
      window.removeEventListener('ticket:status_changed', handleTicketStatusChanged as EventListener)
      window.removeEventListener('tickets:unassigned', handleUnassignedTickets as EventListener)
      window.removeEventListener('sede:event', handleSedeEvent as EventListener)
      window.removeEventListener('tecnico:event', handleTecnicoEvent as EventListener)
      window.removeEventListener('user:event', handleUserEvent as EventListener)
    }
  }, [
    isConnected,
    handleTicketCreated,
    handleTicketAssigned,
    handleTicketStatusChanged,
    handleUnassignedTickets,
    handleSedeEvent,
    handleTecnicoEvent,
    handleUserEvent
  ])

  return {
    isConnected
  }
} 
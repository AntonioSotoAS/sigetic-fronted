"use client"

import { useEffect, useCallback } from 'react'
import { useWebSocket, TicketEvent, TicketAssignmentEvent, TicketStatusChangeEvent } from './use-websocket'
import { useAuth } from './use-auth'
import { useGetTicketsSinAsignarMiSedeQuery } from '@/store/api/ticketApi'
import { useGetMisTicketsQuery } from '@/store/api/ticketApi'
import { useGetMisTicketsAsignadosQuery } from '@/store/api/ticketApi'

export const useTicketsAutoRefresh = () => {
  const { user } = useAuth()
  const { isConnected } = useWebSocket()
  
  // Queries para diferentes tipos de tickets
  const { refetch: refetchTicketsMiSede } = useGetTicketsSinAsignarMiSedeQuery()
  const { refetch: refetchMisTickets } = useGetMisTicketsQuery()
  const { refetch: refetchMisTicketsAsignados } = useGetMisTicketsAsignadosQuery()

  // Función para actualizar todas las listas de tickets
  const refreshAllTicketLists = useCallback(() => {
    refetchTicketsMiSede()
    refetchMisTickets()
    refetchMisTicketsAsignados()
  }, [refetchTicketsMiSede, refetchMisTickets, refetchMisTicketsAsignados])

  // Función para actualizar solo tickets de mi sede
  const refreshTicketsMiSede = useCallback(() => {
    refetchTicketsMiSede()
  }, [refetchTicketsMiSede])

  // Función para actualizar mis tickets
  const refreshMisTickets = useCallback(() => {
    refetchMisTickets()
  }, [refetchMisTickets])

  // Función para actualizar mis tickets asignados
  const refreshMisTicketsAsignados = useCallback(() => {
    refetchMisTicketsAsignados()
  }, [refetchMisTicketsAsignados])

  // Escuchar eventos de WebSocket para actualizar automáticamente
  useEffect(() => {
    if (!isConnected) return

    const handleTicketCreated = (event: CustomEvent<TicketEvent>) => {
      const ticket = event.detail
      
      // Verificar si el ticket es de la sede del usuario actual
      const isTicketFromMySede = ticket.sede_id === user?.sede?.id
      
      if (isTicketFromMySede) {
        refreshTicketsMiSede()
      }
      
      // Si el ticket es del usuario actual, actualizar sus tickets
      if (ticket.usuario_id === user?.id) {
        refreshMisTickets()
      }
    }

    const handleTicketAssigned = (event: CustomEvent<TicketAssignmentEvent>) => {
      const assignment = event.detail
      
      // Si el ticket fue asignado al usuario actual
      if (assignment.tecnico_id === user?.id) {
        refreshMisTicketsAsignados()
      }
      
      // Actualizar tickets de mi sede (el ticket ya no estará sin asignar)
      refreshTicketsMiSede()
    }

    const handleTicketStatusChanged = (event: CustomEvent<TicketStatusChangeEvent>) => {
      const statusChange = event.detail
      
      // Actualizar todas las listas cuando cambie el estado
      refreshAllTicketLists()
    }

    // Agregar event listeners
    window.addEventListener('ticket:created', handleTicketCreated as EventListener)
    window.addEventListener('ticket:assigned', handleTicketAssigned as EventListener)
    window.addEventListener('ticket:status_changed', handleTicketStatusChanged as EventListener)

    // Limpiar event listeners
    return () => {
      window.removeEventListener('ticket:created', handleTicketCreated as EventListener)
      window.removeEventListener('ticket:assigned', handleTicketAssigned as EventListener)
      window.removeEventListener('ticket:status_changed', handleTicketStatusChanged as EventListener)
    }
  }, [
    isConnected,
    user?.id,
    user?.sede?.id,
    refreshAllTicketLists,
    refreshTicketsMiSede,
    refreshMisTickets,
    refreshMisTicketsAsignados
  ])

  return {
    refreshAllTicketLists,
    refreshTicketsMiSede,
    refreshMisTickets,
    refreshMisTicketsAsignados,
    isConnected
  }
} 
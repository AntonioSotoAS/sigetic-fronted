// src/store/api/ticketApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"
import {
  CreateTicketDto,
  UpdateTicketDto,
  TicketResponse,
  TicketsResponse,
  FilterTicketDto,
  CreateComentarioDto,
  ComentarioResponse,
  ComentariosResponse,
  DebugResponse,
} from "@/types/ticket"

export const ticketApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Obtener lista de tickets
    getTickets: builder.query<TicketsResponse, FilterTicketDto | void>({
      query: (filters = {}) => ({
        url: "/tickets",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar tickets"
          toast.error(message || "Error al cargar tickets")
        }
      },
    }),

    // Obtener tickets sin asignar
    getTicketsSinAsignar: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/sin-asignar",
        method: "GET",
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar tickets sin asignar"
          toast.error(message || "Error al cargar tickets sin asignar")
        }
      },
    }),

    // Obtener tickets sin asignar de mi sede
    getTicketsSinAsignarMiSede: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/sin-asignar-mi-sede",
        method: "GET",
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar tickets sin asignar de mi sede"
          toast.error(message || "Error al cargar tickets sin asignar de mi sede")
        }
      },
    }),

    // Obtener mis tickets
    getMisTickets: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/mis-tickets",
        method: "GET",
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar mis tickets"
          toast.error(message || "Error al cargar mis tickets")
        }
      },
    }),

    // Obtener mis tickets asignados
    getMisTicketsAsignados: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/mis-tickets-asignados",
        method: "GET",
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar mis tickets asignados"
          toast.error(message || "Error al cargar mis tickets asignados")
        }
      },
    }),

    // Obtener mis tickets creados
    getMisTicketsCreados: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/mis-tickets-creados",
        method: "GET",
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar mis tickets creados"
          toast.error(message || "Error al cargar mis tickets creados")
        }
      },
    }),

    // Obtener tickets asignados a un técnico específico
    getTicketsAsignados: builder.query<TicketsResponse, number>({
      query: (tecnicoId) => ({
        url: `/tickets/asignados/${tecnicoId}`,
        method: "GET",
      }),
      providesTags: (result, error, tecnicoId) => [{ type: "Tickets", id: `tecnico-${tecnicoId}` }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar tickets asignados"
          toast.error(message || "Error al cargar tickets asignados")
        }
      },
    }),

    // Obtener ticket por ID
    getTicket: builder.query<TicketResponse, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar ticket"
          toast.error(message || "Error al cargar ticket")
        }
      },
    }),

    // Crear ticket
    createTicket: builder.mutation<TicketResponse, CreateTicketDto>({
      query: (data) => ({
        url: "/tickets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Ticket creado exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al crear ticket"
          toast.error(message || "Error al crear ticket")
        }
      },
    }),

    // Actualizar ticket
    updateTicket: builder.mutation<TicketResponse, { id: number; data: UpdateTicketDto }>({
      query: ({ id, data }) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Tickets", id },
        "Tickets"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Ticket actualizado exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar ticket"
          toast.error(message || "Error al actualizar ticket")
        }
      },
    }),

    // Cerrar ticket
    cerrarTicket: builder.mutation<TicketResponse, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "PATCH",
        body: {
          estado: "cerrado",
          fecha_cierre: new Date().toISOString()
        },
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Tickets", id },
        "Tickets"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Ticket cerrado exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cerrar ticket"
          toast.error(message || "Error al cerrar ticket")
        }
      },
    }),

    // Eliminar ticket
    deleteTicket: builder.mutation<TicketResponse, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Ticket eliminado exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar ticket"
          toast.error(message || "Error al eliminar ticket")
        }
      },
    }),

    // Debug tickets (para desarrollo)
    debugTickets: builder.query<DebugResponse, void>({
      query: () => ({
        url: "/tickets/debug/tickets",
        method: "GET",
      }),
      providesTags: ["Tickets"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar debug de tickets"
          toast.error(message || "Error al cargar debug de tickets")
        }
      },
    }),

    // Obtener comentarios de un ticket
    getComentarios: builder.query<ComentariosResponse, number>({
      query: (ticketId) => ({
        url: `/tickets/${ticketId}/comentarios`,
        method: "GET",
      }),
      providesTags: (result, error, ticketId) => [{ type: "Comentarios", id: ticketId }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar comentarios"
          toast.error(message || "Error al cargar comentarios")
        }
      },
    }),

    // Crear comentario en un ticket
    createComentario: builder.mutation<ComentarioResponse, { ticketId: number; data: CreateComentarioDto }>({
      query: ({ ticketId, data }) => ({
        url: `/tickets/${ticketId}/comentarios`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { ticketId }) => [
        { type: "Comentarios", id: ticketId },
        { type: "Tickets", id: ticketId }
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Comentario agregado exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al agregar comentario"
          toast.error(message || "Error al agregar comentario")
        }
      },
    }),
  }),
})

export const {
  useGetTicketsQuery,
  useGetTicketsSinAsignarQuery,
  useGetTicketsSinAsignarMiSedeQuery,
  useGetMisTicketsQuery,
  useGetMisTicketsAsignadosQuery,
  useGetMisTicketsCreadosQuery,
  useGetTicketsAsignadosQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useCerrarTicketMutation,
  useDeleteTicketMutation,
  useDebugTicketsQuery,
  useGetComentariosQuery,
  useCreateComentarioMutation,
} = ticketApi

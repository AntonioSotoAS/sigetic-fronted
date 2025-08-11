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
} from "@/types/ticket"

export const ticketApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Obtener lista de tickets
    getTickets: builder.query<TicketsResponse, FilterTicketDto>({
      query: (filters) => ({
        url: "/tickets",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Tickets"],
    }),

    // Obtener tickets sin asignar
    getTicketsSinAsignar: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/sin-asignar",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // Obtener tickets sin asignar de mi sede
    getTicketsSinAsignarMiSede: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/sin-asignar-mi-sede",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // Obtener mis tickets
    getMisTickets: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/mis-tickets",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // Obtener mis tickets asignados
    getMisTicketsAsignados: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/mis-tickets-asignados",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // Obtener mis tickets creados
    getMisTicketsCreados: builder.query<TicketsResponse, void>({
      query: () => ({
        url: "/tickets/mis-tickets-creados",
        method: "GET",
      }),
      providesTags: ["Tickets"],
    }),

    // Obtener ticket por ID
    getTicket: builder.query<TicketResponse, number>({
      query: (id) => ({
        url: `/tickets/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Tickets", id }],
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
          await queryFulfilled
          toast.success("Ticket creado exitosamente")
        } catch {
          toast.error("Error al crear el ticket")
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
          await queryFulfilled
          toast.success("Ticket actualizado exitosamente")
        } catch {
          toast.error("Error al actualizar el ticket")
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
          await queryFulfilled
          toast.success("Ticket cerrado exitosamente")
        } catch {
          toast.error("Error al cerrar el ticket")
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
          await queryFulfilled
          toast.success("Ticket eliminado exitosamente")
        } catch {
          toast.error("Error al eliminar el ticket")
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
          await queryFulfilled
          toast.success("Comentario agregado exitosamente")
        } catch {
          toast.error("Error al agregar el comentario")
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
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useCerrarTicketMutation,
  useDeleteTicketMutation,
  useGetComentariosQuery,
  useCreateComentarioMutation,
} = ticketApi

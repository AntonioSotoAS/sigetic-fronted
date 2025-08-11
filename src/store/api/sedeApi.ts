// src/store/api/sedeApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"
import { Sede } from "@/types/ticket"

export interface SedesResponse {
  success: boolean
  message?: string
  data: Sede[]
}

export interface SedeResponse {
  success: boolean
  message?: string
  data: Sede
}

export interface CreateSedeDto {
  nombre: string
  direccion: string
  activo?: boolean
}

export interface UpdateSedeDto {
  nombre?: string
  direccion?: string
  activo?: boolean
}

export interface FilterSedeDto {
  limit?: number
  offset?: number
  page?: number
  search?: string
  activo?: boolean
}

export const sedeApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Obtener lista de sedes
    getSedes: builder.query<
      SedesResponse,
      FilterSedeDto | void
    >({
      query: (filters = {}) => {
        // Filtros por defecto
        const defaultFilters = {
          limit: 50,
          activo: true,
          ...filters
        }
        
        return {
          url: "/sedes",
          method: "GET",
          params: defaultFilters,
        }
      },
      providesTags: ["Sedes"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar sedes"
          toast.error(message || "Error al cargar sedes")
        }
      },
    }),

    // Obtener una sede por ID
    getSede: builder.query<
      SedeResponse,
      number
    >({
      query: (id) => ({
        url: `/sedes/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Sedes", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar sede"
          toast.error(message || "Error al cargar sede")
        }
      },
    }),

    // Crear nueva sede
    createSede: builder.mutation<
      SedeResponse,
      CreateSedeDto
    >({
      query: (body) => ({
        url: "/sedes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Sedes"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Sede creada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al crear sede"
          toast.error(message || "Error al crear sede")
        }
      },
    }),

    // Actualizar sede (PUT)
    updateSede: builder.mutation<
      SedeResponse,
      { id: number; body: UpdateSedeDto }
    >({
      query: ({ id, body }) => ({
        url: `/sedes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Sedes", id },
        "Sedes"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Sede actualizada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar sede"
          toast.error(message || "Error al actualizar sede")
        }
      },
    }),

    // Actualizar sede parcialmente (PATCH)
    patchSede: builder.mutation<
      SedeResponse,
      { id: number; body: UpdateSedeDto }
    >({
      query: ({ id, body }) => ({
        url: `/sedes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Sedes", id },
        "Sedes"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Sede actualizada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar sede"
          toast.error(message || "Error al actualizar sede")
        }
      },
    }),

    // Eliminar sede (soft delete)
    deleteSede: builder.mutation<
      { success: boolean; message?: string },
      number
    >({
      query: (id) => ({
        url: `/sedes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sedes"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Sede eliminada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar sede"
          toast.error(message || "Error al eliminar sede")
        }
      },
    }),

    // Eliminar sede permanentemente
    hardDeleteSede: builder.mutation<
      { success: boolean; message?: string },
      number
    >({
      query: (id) => ({
        url: `/sedes/${id}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sedes"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Sede eliminada permanentemente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar sede permanentemente"
          toast.error(message || "Error al eliminar sede permanentemente")
        }
      },
    }),
  }),
})

export const {
  useGetSedesQuery,
  useGetSedeQuery,
  useCreateSedeMutation,
  useUpdateSedeMutation,
  usePatchSedeMutation,
  useDeleteSedeMutation,
  useHardDeleteSedeMutation,
} = sedeApi



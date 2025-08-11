// src/store/api/cargoApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"

// Tipos para Cargo
export interface Cargo {
  id: number
  nombre: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface CargoResponse {
  success: boolean
  message: string
  data: Cargo
}

export interface CargosResponse {
  success: boolean
  message: string
  data: Cargo[]
  total: number
  page: number
  limit: number
}

export interface CreateCargoDto {
  nombre: string
  activo?: boolean
}

export interface UpdateCargoDto {
  nombre?: string
  activo?: boolean
}

export interface CargoFilters {
  page?: number
  limit?: number
  search?: string
  activo?: boolean
}

export const cargoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener lista de cargos
    getCargos: builder.query<
      CargosResponse,
      CargoFilters
    >({
      query: (params) => {
        return {
          url: "/cargos",
          params,
        }
      },
      providesTags: ["Cargos"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar cargos"
          toast.error(message || "Error al cargar cargos")
        }
      },
    }),

    // Obtener cargo por ID
    getCargo: builder.query<
      CargoResponse,
      number
    >({
      query: (id) => `/cargos/${id}`,
      providesTags: (result, error, id) => [{ type: "Cargos", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar cargo"
          toast.error(message || "Error al cargar cargo")
        }
      },
    }),

    // Crear cargo
    createCargo: builder.mutation<
      CargoResponse,
      CreateCargoDto
    >({
      query: (body) => ({
        url: "/cargos",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cargos"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Cargo creado exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al crear cargo"
          toast.error(message || "Error al crear cargo")
        }
      },
    }),

    // Actualizar cargo
    updateCargo: builder.mutation<
      CargoResponse,
      { id: number; data: UpdateCargoDto }
    >({
      query: ({ id, data }) => ({
        url: `/cargos/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Cargos", id },
        "Cargos"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Cargo actualizado exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar cargo"
          toast.error(message || "Error al actualizar cargo")
        }
      },
    }),

    // Eliminar cargo
    deleteCargo: builder.mutation<
      CargoResponse,
      number
    >({
      query: (id) => ({
        url: `/cargos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cargos"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Cargo eliminado exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar cargo"
          toast.error(message || "Error al eliminar cargo")
        }
      },
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetCargosQuery,
  useGetCargoQuery,
  useCreateCargoMutation,
  useUpdateCargoMutation,
  useDeleteCargoMutation,
} = cargoApi

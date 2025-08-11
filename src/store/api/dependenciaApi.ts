// src/store/api/dependenciaApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"
import { Dependencia } from "@/types/ticket"

export interface DependenciasResponse {
  success: boolean
  message?: string
  data: Dependencia[]
}

export interface DependenciaResponse {
  success: boolean
  message?: string
  data: Dependencia
}

export interface CreateDependenciaDto {
  nombre: string
  descripcion?: string
  activo?: boolean
}

export interface UpdateDependenciaDto {
  nombre?: string
  descripcion?: string
  activo?: boolean
}

export interface FilterDependenciaDto {
  limit?: number
  offset?: number
  page?: number
  search?: string
  activo?: boolean
}

export const dependenciaApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Obtener lista de dependencias
    getDependencias: builder.query<
      DependenciasResponse,
      FilterDependenciaDto | void
    >({
      query: (filters = {}) => {
        // Filtros por defecto
        const defaultFilters = {
          limit: 50,
          activo: true,
          ...filters
        }
        
        return {
          url: "/dependencias",
          method: "GET",
          params: defaultFilters,
        }
      },
      providesTags: ["Dependencias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar dependencias"
          toast.error(message || "Error al cargar dependencias")
        }
      },
    }),

    // Obtener una dependencia por ID
    getDependencia: builder.query<
      DependenciaResponse,
      number
    >({
      query: (id) => ({
        url: `/dependencias/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Dependencias", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar dependencia"
          toast.error(message || "Error al cargar dependencia")
        }
      },
    }),

    // Crear nueva dependencia
    createDependencia: builder.mutation<
      DependenciaResponse,
      CreateDependenciaDto
    >({
      query: (body) => ({
        url: "/dependencias",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Dependencias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Dependencia creada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al crear dependencia"
          toast.error(message || "Error al crear dependencia")
        }
      },
    }),

    // Actualizar dependencia (PUT)
    updateDependencia: builder.mutation<
      DependenciaResponse,
      { id: number; body: UpdateDependenciaDto }
    >({
      query: ({ id, body }) => ({
        url: `/dependencias/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Dependencias", id },
        "Dependencias"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Dependencia actualizada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar dependencia"
          toast.error(message || "Error al actualizar dependencia")
        }
      },
    }),

    // Actualizar dependencia parcialmente (PATCH)
    patchDependencia: builder.mutation<
      DependenciaResponse,
      { id: number; body: UpdateDependenciaDto }
    >({
      query: ({ id, body }) => ({
        url: `/dependencias/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Dependencias", id },
        "Dependencias"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Dependencia actualizada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar dependencia"
          toast.error(message || "Error al actualizar dependencia")
        }
      },
    }),

    // Eliminar dependencia (soft delete)
    deleteDependencia: builder.mutation<
      { success: boolean; message?: string },
      number
    >({
      query: (id) => ({
        url: `/dependencias/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dependencias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Dependencia eliminada exitosamente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar dependencia"
          toast.error(message || "Error al eliminar dependencia")
        }
      },
    }),

    // Eliminar dependencia permanentemente
    hardDeleteDependencia: builder.mutation<
      { success: boolean; message?: string },
      number
    >({
      query: (id) => ({
        url: `/dependencias/${id}/permanent`,
        method: "DELETE",
      }),
      invalidatesTags: ["Dependencias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          toast.success(data.message || "Dependencia eliminada permanentemente")
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar dependencia permanentemente"
          toast.error(message || "Error al eliminar dependencia permanentemente")
        }
      },
    }),
  }),
})

export const {
  useGetDependenciasQuery,
  useGetDependenciaQuery,
  useCreateDependenciaMutation,
  useUpdateDependenciaMutation,
  usePatchDependenciaMutation,
  useDeleteDependenciaMutation,
  useHardDeleteDependenciaMutation,
} = dependenciaApi

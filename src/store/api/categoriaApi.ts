// src/store/api/categoriaApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"

export interface Categoria {
  id: number
  nombre: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface CategoriasResponse {
  data: Categoria[]
  total: number
  limit: number
  offset: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Para endpoints que devuelven solo el array
export type CategoriasArrayResponse = Categoria[]

export interface CategoriaResponse {
  data: Categoria
}

export interface CreateCategoriaDto {
  nombre: string
  activo?: boolean
}

export interface UpdateCategoriaDto {
  nombre?: string
  activo?: boolean
}

export interface FilterCategoriaDto {
  limit?: number
  offset?: number
  page?: number
  search?: string
  activo?: boolean
}

export const categoriaApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Obtener todas las categorías con filtros
    getCategorias: builder.query<CategoriasResponse, FilterCategoriaDto>({
      query: (filters) => ({
        url: "/categorias",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Categorias"],
    }),

    // Obtener todas las categorías activas
    getCategoriasActive: builder.query<CategoriasArrayResponse, void>({
      query: () => ({
        url: "/categorias/active",
        method: "GET",
      }),
      providesTags: ["Categorias"],
    }),

    // Obtener una categoría por ID
    getCategoria: builder.query<CategoriaResponse, number>({
      query: (id) => ({
        url: `/categorias/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Categorias", id }],
    }),

    // Crear una nueva categoría
    createCategoria: builder.mutation<CategoriaResponse, CreateCategoriaDto>({
      query: (data) => ({
        url: "/categorias",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categorias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Categoría creada exitosamente")
        } catch {
          toast.error("Error al crear la categoría")
        }
      },
    }),

    // Actualizar una categoría
    updateCategoria: builder.mutation<CategoriaResponse, { id: number; data: UpdateCategoriaDto }>({
      query: ({ id, data }) => ({
        url: `/categorias/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Categorias", id },
        "Categorias",
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Categoría actualizada exitosamente")
        } catch {
          toast.error("Error al actualizar la categoría")
        }
      },
    }),

    // Eliminar una categoría
    deleteCategoria: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/categorias/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categorias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Categoría eliminada exitosamente")
        } catch {
          toast.error("Error al eliminar la categoría")
        }
      },
    }),
  }),
})

export const {
  useGetCategoriasQuery,
  useGetCategoriasActiveQuery,
  useGetCategoriaQuery,
  useCreateCategoriaMutation,
  useUpdateCategoriaMutation,
  useDeleteCategoriaMutation,
} = categoriaApi

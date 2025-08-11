// src/store/api/subcategoriaApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"

export interface Subcategoria {
  id: number
  nombre: string
  activo: boolean
  categoria_id: number
  created_at: string
  updated_at: string
}

export interface SubcategoriasResponse {
  data: Subcategoria[]
  total: number
  limit: number
  offset: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Para endpoints que devuelven solo el array
export type SubcategoriasArrayResponse = Subcategoria[]

export interface SubcategoriaResponse {
  data: Subcategoria
}

export interface SubcategoriasGroupedResponse {
  data: {
    [categoria: string]: Subcategoria[]
  }
}

export interface CreateSubcategoriaDto {
  nombre: string
  activo?: boolean
  categoria_id: number
}

export interface UpdateSubcategoriaDto {
  nombre?: string
  activo?: boolean
  categoria_id?: number
}

export interface FilterSubcategoriaDto {
  limit?: number
  offset?: number
  page?: number
  search?: string
  activo?: boolean
  categoria_id?: number
}

export const subcategoriaApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Obtener todas las subcategorías con filtros
    getSubcategorias: builder.query<SubcategoriasResponse, FilterSubcategoriaDto>({
      query: (filters) => ({
        url: "/subcategorias",
        method: "GET",
        params: filters,
      }),
      providesTags: ["Subcategorias"],
    }),

    // Obtener todas las subcategorías activas
    getSubcategoriasActive: builder.query<SubcategoriasResponse, void>({
      query: () => ({
        url: "/subcategorias/active",
        method: "GET",
      }),
      providesTags: ["Subcategorias"],
    }),

    // Obtener subcategorías agrupadas por categoría
    getSubcategoriasGrouped: builder.query<SubcategoriasGroupedResponse, void>({
      query: () => ({
        url: "/subcategorias/grouped",
        method: "GET",
      }),
      providesTags: ["Subcategorias"],
    }),

    // Obtener subcategorías por categoría específica
    getSubcategoriasByCategoria: builder.query<SubcategoriasArrayResponse, number>({
      query: (categoria_id) => ({
        url: `/subcategorias/categoria/${categoria_id}`,
        method: "GET",
      }),
      providesTags: ["Subcategorias"],
    }),

    // Obtener una subcategoría por ID
    getSubcategoria: builder.query<SubcategoriaResponse, number>({
      query: (id) => ({
        url: `/subcategorias/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Subcategorias", id }],
    }),

    // Crear una nueva subcategoría
    createSubcategoria: builder.mutation<SubcategoriaResponse, CreateSubcategoriaDto>({
      query: (data) => ({
        url: "/subcategorias",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subcategorias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Subcategoría creada exitosamente")
        } catch {
          toast.error("Error al crear la subcategoría")
        }
      },
    }),

    // Actualizar una subcategoría
    updateSubcategoria: builder.mutation<SubcategoriaResponse, { id: number; data: UpdateSubcategoriaDto }>({
      query: ({ id, data }) => ({
        url: `/subcategorias/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Subcategorias", id },
        "Subcategorias",
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Subcategoría actualizada exitosamente")
        } catch {
          toast.error("Error al actualizar la subcategoría")
        }
      },
    }),

    // Eliminar una subcategoría
    deleteSubcategoria: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/subcategorias/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subcategorias"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          toast.success("Subcategoría eliminada exitosamente")
        } catch {
          toast.error("Error al eliminar la subcategoría")
        }
      },
    }),
  }),
})

export const {
  useGetSubcategoriasQuery,
  useGetSubcategoriasActiveQuery,
  useGetSubcategoriasGroupedQuery,
  useGetSubcategoriasByCategoriaQuery,
  useGetSubcategoriaQuery,
  useCreateSubcategoriaMutation,
  useUpdateSubcategoriaMutation,
  useDeleteSubcategoriaMutation,
} = subcategoriaApi

// src/store/api/usuarioApi.ts
import { baseApi } from "./baseApi"
import { toast } from "react-hot-toast"
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  UsuarioResponse,
  UsuariosResponse,
  UsuarioFilters,
  ToggleUsuarioEstadoDto,
  ChangePasswordDto,
} from "@/types/usuario"

export const usuarioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Obtener lista de usuarios
    getUsuarios: builder.query<
      UsuariosResponse,
      UsuarioFilters
    >({
      query: (params) => ({
        url: "/usuarios",
        params,
      }),
      providesTags: ["Usuarios"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar usuarios"
          toast.error(message || "Error al cargar usuarios")
        }
      },
    }),

    // Obtener usuario por ID
    getUsuario: builder.query<
      UsuarioResponse,
      number
    >({
      query: (id) => `/usuarios/${id}`,
      providesTags: (result, error, id) => [{ type: "Usuarios", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cargar usuario"
          toast.error(message || "Error al cargar usuario")
        }
      },
    }),

    // Crear usuario
    createUsuario: builder.mutation<
      UsuarioResponse,
      CreateUsuarioDto
    >({
      query: (body) => ({
        url: "/usuarios",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Usuarios"],
      // Removemos onQueryStarted para manejar toasts desde los componentes
    }),

    // Actualizar usuario
    updateUsuario: builder.mutation<
      UsuarioResponse,
      UpdateUsuarioDto
    >({
      query: ({ id, ...body }) => ({
        url: `/usuarios/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Usuarios", id },
        "Usuarios"
      ],
      // Removemos onQueryStarted para manejar toasts desde los componentes
    }),

    // Eliminar usuario
    deleteUsuario: builder.mutation<
      UsuarioResponse,
      number
    >({
      query: (id) => ({
        url: `/usuarios/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Usuarios"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Usuario eliminado exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al eliminar usuario"
          toast.error(message || "Error al eliminar usuario")
        }
      },
    }),

    // Cambiar estado de usuario (activar/desactivar)
    toggleUsuarioEstado: builder.mutation<
      UsuarioResponse,
      ToggleUsuarioEstadoDto
    >({
      query: ({ id, activo }) => ({
        url: `/usuarios/${id}/toggle-estado`,
        method: "PATCH",
        body: { activo },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Usuarios", id },
        "Usuarios"
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Estado del usuario actualizado")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cambiar estado del usuario"
          toast.error(message || "Error al cambiar estado del usuario")
        }
      },
    }),

    // Cambiar contraseña de usuario
    changePassword: builder.mutation<
      UsuarioResponse,
      ChangePasswordDto
    >({
      query: ({ id, password, confirmPassword }) => ({
        url: `/usuarios/${id}/change-password`,
        method: "PATCH",
        body: { password, confirmPassword },
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Contraseña actualizada exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cambiar contraseña"
          toast.error(message || "Error al cambiar contraseña")
        }
      },
    }),

    // Actualizar contraseña del usuario autenticado
    updatePassword: builder.mutation<
      UsuarioResponse,
      { password_actual: string; password_nuevo: string }
    >({
      query: (body) => ({
        url: "/usuarios/update-password",
        method: "PATCH",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Contraseña actualizada exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar contraseña"
          toast.error(message || "Error al actualizar contraseña")
        }
      },
    }),

    // Actualizar ubicación del usuario autenticado
    updateLocation: builder.mutation<
      UsuarioResponse,
      { sede: string; dependencia: string }
    >({
      query: (body) => ({
        url: "/usuarios/update-location",
        method: "PATCH",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          if (data.success) {
            toast.success(data.message || "Ubicación actualizada exitosamente")
          }
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al actualizar ubicación"
          toast.error(message || "Error al actualizar ubicación")
        }
      },
    }),
  }),
  overrideExisting: true,
})

export const {
  useGetUsuariosQuery,
  useGetUsuarioQuery,
  useCreateUsuarioMutation,
  useUpdateUsuarioMutation,
  useDeleteUsuarioMutation,
  useToggleUsuarioEstadoMutation,
  useChangePasswordMutation,
  useUpdatePasswordMutation,
  useUpdateLocationMutation,
} = usuarioApi 
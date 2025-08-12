// src/store/api/authApi.ts
import { baseApi } from "./baseApi"
import { PerfilResponse } from "@/types/auth"
import { toast } from "react-hot-toast"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { 
        message: string; 
        success: boolean; 
        access_token: string;
        refresh_token?: string;
        user: PerfilResponse 
      }, 
      { dni: string; password: string }  
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          // El toast de éxito se maneja en el componente para mejor control
        } catch (error: unknown) {
          console.error("Error en login:", error)
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al iniciar sesión"
          toast.error(message || "Error al iniciar sesión")
        }
      },
    }),

    logout: builder.mutation<
      { message: string; success: boolean },
      void
    >({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error: unknown) {
          const message = error && typeof error === 'object' && 'data' in error 
            ? (error.data as { message?: string })?.message 
            : "Error al cerrar sesión"
          toast.error(message || "Error al cerrar sesión")
        }
      },
    }),

    perfil: builder.query<
      { user: PerfilResponse; success: boolean },
      void
    >({
      query: () => ({
        url: "/auth/perfil",
      }),
      providesTags: ["Auth"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          // No mostrar toast para consultas de perfil exitosas
        } catch (error: unknown) {
          // Solo mostrar error si no es 401 (que se maneja en el refresh)
          if (error && typeof error === 'object' && 'status' in error && error.status !== 401) {
            const message = error && typeof error === 'object' && 'data' in error 
              ? (error.data as { message?: string })?.message 
              : "Error al cargar el perfil"
            toast.error(message || "Error al cargar el perfil")
          }
        }
      },
    }),

    refresh: builder.mutation<
      { 
        success: boolean; 
        access_token: string;
        user: PerfilResponse;
        message?: string;
      },
      void
    >({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled
          // No mostrar toast para refresh exitoso (es automático)
        } catch (error: unknown) {
          // No mostrar toast para errores de refresh (se maneja en el hook useAuth)
          console.error('Error refreshing token:', error)
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useLogoutMutation,
  usePerfilQuery,
  useRefreshMutation,
} = authApi

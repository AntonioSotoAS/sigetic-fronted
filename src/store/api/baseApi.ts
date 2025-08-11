// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery, FetchBaseQueryError, BaseQueryFn } from "@reduxjs/toolkit/query/react"
import { toast } from "react-hot-toast"

// Función para hacer refresh del token
async function refreshToken() {
  try {
    const url = `/api/auth/refresh`
    
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      const data = await response.json()
      return data.success ? data : null
    }
    return null
  } catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}

// Crear el baseQuery base
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1', 
  credentials: "include",
  prepareHeaders: (headers) => {
    headers.set("Accept", "application/json")
    headers.set("Content-Type", "application/json")
    return headers
  },
})

// Crear una versión personalizada del baseQuery con interceptor de refresh
export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // Si la petición falla con 401 (Unauthorized), intentar refresh
  if (result.error && (result.error as FetchBaseQueryError).status === 401) {
    // Intentar refresh del token
    const refreshResult = await refreshToken()
    
    if (refreshResult) {
      // Si el refresh fue exitoso, reintentar la petición original
      result = await baseQuery(args, api, extraOptions)
    } else {
      // Si el refresh falló, redirigir al login
      toast.error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Auth", "Usuarios", "Tickets", "Dependencias", "Sedes", "Comentarios", "Subcategorias", "Categorias", "Cargos"], 
})

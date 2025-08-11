"use client"

import { useEffect, useState, useCallback } from "react"
import { useRefreshMutation } from "@/store/api/authApi"

import { PerfilResponse } from "@/types/auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<PerfilResponse | null>(null)

  // Mutation para refresh token
  const [refresh] = useRefreshMutation()

  // Función para verificar autenticación una sola vez
  const checkAuth = useCallback(async () => {
    try {
      const fullUrl = `/api/auth/perfil`
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setIsAuthenticated(true)
          setUser(data.user)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error)
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para intentar refresh del token
  const attemptRefresh = useCallback(async () => {
    try {
      const result = await refresh().unwrap()
      if (result.success) {
        // Verificar autenticación después del refresh
        await checkAuth()
        return true
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      return false
    }
    return false
  }, [refresh, checkAuth])

  // Solo ejecutar una vez al cargar el componente
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const logout = () => {
    // El logout se maneja a través de la API route que limpia las cookies
    setIsAuthenticated(false)
    setUser(null)
  }

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    attemptRefresh,
    checkAuth, // Exponer para uso manual
  }
}

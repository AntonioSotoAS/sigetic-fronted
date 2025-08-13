"use client"

import { useEffect, useState, useCallback } from "react"
import { useRefreshMutation } from "@/store/api/authApi"

import { PerfilResponse } from "@/types/auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<PerfilResponse | null>(null)
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false)

  // Mutation para refresh token - con manejo de errores más robusto
  const [refresh] = useRefreshMutation()

  // Función para verificar autenticación una sola vez
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true)
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
        if (data.success && data.user) {
          setIsAuthenticated(true)
          setUser(data.user)
          
          // Verificar si necesita cambiar contraseña - SIEMPRE verificar
          if (data.user.password_resetada) {
            setShowPasswordResetModal(true)
            // Guardar en localStorage para persistencia
            localStorage.setItem('passwordResetRequired', 'true')
          } else {
            setShowPasswordResetModal(false)
            localStorage.removeItem('passwordResetRequired')
          }
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setShowPasswordResetModal(false)
          localStorage.removeItem('passwordResetRequired')
        }
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setShowPasswordResetModal(false)
        localStorage.removeItem('passwordResetRequired')
      }
    } catch (error) {
      console.error("Error verificando autenticación:", error)
      setIsAuthenticated(false)
      setUser(null)
      setShowPasswordResetModal(false)
      localStorage.removeItem('passwordResetRequired')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Función para intentar refresh del token
  const attemptRefresh = useCallback(async () => {
    if (!refresh || typeof refresh !== 'function') {
      console.warn("Refresh mutation no disponible")
      return false
    }

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

  // Verificación adicional cuando cambia el usuario
  useEffect(() => {
    if (user && user.password_resetada) {
      setShowPasswordResetModal(true)
      localStorage.setItem('passwordResetRequired', 'true')
    } else if (user && !user.password_resetada) {
      setShowPasswordResetModal(false)
      localStorage.removeItem('passwordResetRequired')
    }
  }, [user])

  // Verificación de localStorage al cargar
  useEffect(() => {
    const passwordResetRequired = localStorage.getItem('passwordResetRequired')
    if (passwordResetRequired === 'true' && user && user.password_resetada) {
      setShowPasswordResetModal(true)
    }
  }, [user])

  const logout = useCallback(() => {
    // El logout se maneja a través de la API route que limpia las cookies
    setIsAuthenticated(false)
    setUser(null)
    setShowPasswordResetModal(false)
    localStorage.removeItem('passwordResetRequired')
  }, [])

  // Función para manejar el éxito del cambio de contraseña
  const handlePasswordResetSuccess = useCallback(() => {
    setShowPasswordResetModal(false)
    localStorage.removeItem('passwordResetRequired')
    // No recargar el perfil porque el usuario será redirigido al login
  }, [])

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    attemptRefresh,
    checkAuth, // Exponer para uso manual
    showPasswordResetModal,
    handlePasswordResetSuccess,
  }
}

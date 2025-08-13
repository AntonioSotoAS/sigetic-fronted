"use client"

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Registrar inmediatamente
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          // Verificar si hay actualizaciones
          registration.addEventListener('updatefound', () => {
            // Nueva versión disponible
          })
        })
        .catch((registrationError) => {
          console.error('PWA Register: Error al registrar SW', registrationError)
        })

      // Escuchar eventos del service worker
      navigator.serviceWorker.addEventListener('message', () => {
        // Manejar mensajes del SW si es necesario
      })

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Nuevo SW activo
      })
    }
  }, [])

  return null
}

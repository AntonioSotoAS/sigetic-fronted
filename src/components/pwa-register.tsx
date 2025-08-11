"use client"

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      console.log('PWA Register: Inicializando service worker...')
      
      // Registrar inmediatamente
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('PWA Register: Service Worker registrado exitosamente', registration)
          
          // Verificar si hay actualizaciones
          registration.addEventListener('updatefound', () => {
            console.log('PWA Register: Nueva versión del SW disponible')
          })
        })
        .catch((registrationError) => {
          console.error('PWA Register: Error al registrar SW', registrationError)
        })

      // Escuchar eventos del service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('PWA Register: Mensaje del SW', event.data)
      })

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('PWA Register: Nuevo SW activo')
      })
    } else {
      console.log('PWA Register: Service Worker no soportado')
    }
  }, [])

  return null
}

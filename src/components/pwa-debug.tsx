"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PWADebug() {
  const [pwaInfo, setPwaInfo] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const checkPWAStatus = () => {
      const windowWithPWA = window as Window & { installPWA?: () => Promise<boolean>; isPWAInstallable?: () => boolean; deferredPrompt?: unknown };
      const userAgent = navigator.userAgent;
      
      const info = {
        serviceWorker: 'serviceWorker' in navigator,
        standalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        language: navigator.language,
        // Información del navegador
        browser: {
          isChrome: userAgent.includes('Chrome') && !userAgent.includes('Edg'),
          isBrave: userAgent.includes('Brave'),
          isFirefox: userAgent.includes('Firefox'),
          isEdge: userAgent.includes('Edg'),
          isSafari: userAgent.includes('Safari') && !userAgent.includes('Chrome')
        },
        // Información adicional de PWA
        hasInstallFunction: typeof windowWithPWA.installPWA === 'function',
        hasIsInstallableFunction: typeof windowWithPWA.isPWAInstallable === 'function',
        isInstallable: windowWithPWA.isPWAInstallable ? windowWithPWA.isPWAInstallable() : false,
        hasDeferredPrompt: !!windowWithPWA.deferredPrompt,
        // Verificar manifest
        manifestLink: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
        // Verificar si es HTTPS
        isSecure: window.location.protocol === 'https:',
        // Verificar engagement
        hasUserGesture: true, // Asumimos que el usuario ha interactuado
      }
      setPwaInfo(info)
    }

    checkPWAStatus()
    
    // Verificar cada 2 segundos
    const interval = setInterval(checkPWAStatus, 2000)
    
    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>PWA Debug Info</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs bg-gray-100 p-2 rounded">
          {JSON.stringify(pwaInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export function CookieDebug() {
  const [cookies, setCookies] = useState<string>("")
  const [cookieDetails, setCookieDetails] = useState<Record<string, string>>({})

  const updateCookieInfo = () => {
    const currentCookies = document.cookie
    setCookies(currentCookies)
    
    // Parsear cookies
    const parsed = currentCookies.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {} as Record<string, string>)
    
    setCookieDetails(parsed)
  }

  useEffect(() => {
    updateCookieInfo()
    // Actualizar cada segundo
    const interval = setInterval(updateCookieInfo, 1000)
    return () => clearInterval(interval)
  }, [])

  const checkAuthCookies = () => {
    const hasAccessToken = !!cookieDetails.access_token
    const hasRefreshToken = !!cookieDetails.refresh_token
    const hasToken = !!cookieDetails.token
    
    return { hasAccessToken, hasRefreshToken, hasToken }
  }

  const { hasAccessToken, hasRefreshToken, hasToken } = checkAuthCookies()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🍪 Cookie Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <div><strong>Estado de Cookies:</strong></div>
          <div className="flex items-center gap-2">
            <span>access_token:</span>
            <span className={hasAccessToken ? "text-green-600" : "text-red-600"}>
              {hasAccessToken ? "✅ Presente" : "❌ Ausente"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>refresh_token:</span>
            <span className={hasRefreshToken ? "text-green-600" : "text-red-600"}>
              {hasRefreshToken ? "✅ Presente" : "❌ Ausente"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>token:</span>
            <span className={hasToken ? "text-green-600" : "text-red-600"}>
              {hasToken ? "✅ Presente" : "❌ Ausente"}
            </span>
          </div>
        </div>
        
        <div className="text-xs bg-muted p-2 rounded">
          <strong>Cookies completas:</strong>
          <div className="mt-1 break-all">{cookies || "No hay cookies"}</div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          <strong>Instrucciones:</strong>
          <div className="mt-2 space-y-1">
            <div>1. Haz login primero</div>
            <div>2. Verifica que aparezcan las cookies</div>
            <div>3. Usa el botón para probar autenticación</div>
            <div>4. Revisa la consola para más detalles</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

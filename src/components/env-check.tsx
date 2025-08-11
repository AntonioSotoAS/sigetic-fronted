"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EnvCheck() {
  const [testResult, setTestResult] = useState<string>("")

  const testApiConnection = async () => {
    try {
      setTestResult("Probando conexión...")
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
      
      const token = localStorage.getItem('access_token')
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`${apiUrl}/auth/perfil`, {
        method: 'GET',
        headers,
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setTestResult(`✅ Conexión exitosa - Usuario: ${data.user?.nombre}`)
        } else {
          setTestResult(`❌ Error: Respuesta no exitosa`)
        }
      } else {
        setTestResult(`❌ Error: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.error("🧪 Test error:", error)
      setTestResult(`Error: ${error}`)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Verificación de API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || "❌ No configurada"}
        </div>
        
        <Button 
          onClick={testApiConnection}
          variant="outline"
          size="sm"
        >
          🧪 Probar Conexión API
        </Button>
        
        {testResult && (
          <div className="text-sm p-2 bg-muted rounded">
            <strong>Resultado:</strong> {testResult}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          <strong>Información:</strong>
          <div className="mt-2 space-y-1">
            <div>• 301 = Redirección permanente</div>
            <div>• 302 = Redirección temporal</div>
            <div>• 404 = No encontrado</div>
            <div>• 500 = Error del servidor</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

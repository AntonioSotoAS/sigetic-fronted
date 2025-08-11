"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function LoginDebug() {
  const [clickCount, setClickCount] = useState(0)
  const [lastClick, setLastClick] = useState<string>("")

  const handleTestClick = () => {
    setClickCount(prev => prev + 1)
    setLastClick(new Date().toLocaleTimeString())
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Debug del Formulario
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Clicks de prueba:</div>
          <Badge variant="default">
            {clickCount}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Último click:</div>
          <Badge variant="secondary">
            {lastClick || "Ninguno"}
          </Badge>
        </div>
        
        <Button 
          type="button"
          onClick={handleTestClick}
          variant="outline"
          size="sm"
        >
          🧪 Probar Click
        </Button>
        
        <div className="border-t pt-4">
          <div className="text-xs text-muted-foreground">
            <strong>Estado del navegador:</strong>
            <div className="mt-2 space-y-1">
              <div>• JavaScript habilitado: ✅</div>
              <div>• React funcionando: ✅</div>
              <div>• Eventos capturados: {clickCount > 0 ? "✅" : "❌"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

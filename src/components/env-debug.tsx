"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function EnvDebug() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚙️ Configuración del Entorno
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>API URL:</div>
          <Badge variant={process.env.NEXT_PUBLIC_API_URL ? "default" : "destructive"}>
            {process.env.NEXT_PUBLIC_API_URL || "❌ No configurada"}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>NODE_ENV:</div>
          <Badge variant="secondary">
            {process.env.NODE_ENV || "development"}
          </Badge>
        </div>
        
        <div className="border-t pt-4">
          <div className="text-xs text-muted-foreground">
            <strong>Variables de entorno disponibles:</strong>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify({
                NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
                NODE_ENV: process.env.NODE_ENV,
              }, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

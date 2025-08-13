"use client"

import { useWebSocket } from '@/hooks/use-websocket'
import { Badge } from '@/components/ui/badge'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const WebSocketStatus = () => {
  const { isConnected, connectionError } = useWebSocket()

  if (connectionError) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className="gap-1">
              <WifiOff className="h-3 w-3" />
              <span className="hidden sm:inline">Desconectado</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Error de conexión: {connectionError}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!isConnected) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className="gap-1">
              <AlertCircle className="h-3 w-3" />
              <span className="hidden sm:inline">Conectando...</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Conectando al servidor...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="default" className="gap-1 bg-green-600 hover:bg-green-700">
            <Wifi className="h-3 w-3" />
            <span className="hidden sm:inline">Conectado</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Conectado al servidor en tiempo real</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 
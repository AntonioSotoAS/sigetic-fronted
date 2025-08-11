"use client"

import { Button } from "@/components/ui/button"
import { Download, Check } from "lucide-react"
import { usePWAInstall } from "@/hooks/use-pwa-install"
import { useState } from "react"

export function PWAInstallButton() {
  const { isInstallable, isInstalled, installPWA } = usePWAInstall()
  const [isInstalling, setIsInstalling] = useState(false)

  console.log('PWA Install Button:', { isInstallable, isInstalled })

  const handleInstall = async () => {
    setIsInstalling(true)
    try {
      await installPWA()
    } catch (error) {
      console.error('Error al instalar:', error)
    } finally {
      setIsInstalling(false)
    }
  }

  // Mostrar el botón siempre para debug, pero deshabilitado si no es instalable
  if (isInstalled) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Check className="h-4 w-4" />
        Ya Instalada
      </Button>
    )
  }

  return (
    <Button
      onClick={handleInstall}
      disabled={isInstalling || !isInstallable}
      variant={isInstallable ? "default" : "outline"}
      size="sm"
      className="gap-2"
    >
      {isInstalling ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Instalando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {isInstallable ? "Instalar App" : "No Instalable"}
        </>
      )}
    </Button>
  )
}

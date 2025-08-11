"use client"

import { Button } from "@/components/ui/button"
import { useRefreshMutation } from "@/store/api/authApi"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "react-hot-toast"

export function RefreshTest() {
  const [refresh, { isLoading }] = useRefreshMutation()
  const { attemptRefresh } = useAuth()

  const handleManualRefresh = async () => {
    try {
      const result = await refresh().unwrap()
      if (result.success) {
        toast.success("Token refrescado manualmente")
      }
    } catch {
      toast.error("Error al refrescar el token")
    }
  }

  const handleAuthRefresh = async () => {
    const success = await attemptRefresh()
    if (success) {
      toast.success("Token refrescado a través del hook de auth")
    } else {
      toast.error("Error al refrescar el token")
    }
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Prueba de Refresh Token</h3>
      <div className="space-y-2">
        <Button 
          onClick={handleManualRefresh} 
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          {isLoading ? "Refrescando..." : "Refresh Manual"}
        </Button>
        <Button 
          onClick={handleAuthRefresh} 
          variant="outline"
          className="w-full"
        >
          Refresh desde Hook Auth
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Usa estos botones para probar el refresh de tokens manualmente.
      </p>
    </div>
  )
}

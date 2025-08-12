"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { IconSettings, IconUser, IconShield, IconBell, IconPalette } from "@tabler/icons-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function MiConfiguracionPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Solo permitir acceso a superadmin
  if (!user || user.rol !== "superadmin") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <IconShield className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
              <p className="text-gray-600">
                Solo los superadministradores pueden acceder a esta página.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSaveConfig = async () => {
    setIsLoading(true)
    try {
      // Aquí iría la lógica para guardar la configuración
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulación
      toast.success("Configuración guardada exitosamente")
    } catch {
      toast.error("Error al guardar la configuración")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconSettings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Configuración</h1>
          <p className="text-gray-600">Configuración personal del superadministrador</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUser className="w-5 h-5" />
              Configuración de Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombres">Nombres</Label>
                <Input 
                  id="nombres" 
                  defaultValue={user?.nombres || ""} 
                  placeholder="Tus nombres"
                />
              </div>
              <div>
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input 
                  id="apellidos" 
                  defaultValue={`${user?.apellidos_paterno || ""} ${user?.apellidos_materno || ""}`} 
                  placeholder="Tus apellidos"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue={user?.correo || ""} 
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input 
                id="telefono" 
                defaultValue={user?.telefono || ""} 
                placeholder="Tu teléfono"
              />
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconShield className="w-5 h-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                placeholder="Tu contraseña actual"
              />
            </div>
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input 
                id="newPassword" 
                type="password" 
                placeholder="Nueva contraseña"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Confirmar nueva contraseña"
              />
            </div>
            <Button variant="outline" className="w-full">
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>

        {/* Configuración de Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones por Email</p>
                  <p className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificaciones de Tickets</p>
                  <p className="text-sm text-gray-600">Alertas sobre nuevos tickets</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Reportes Semanales</p>
                  <p className="text-sm text-gray-600">Recibir reportes semanales del sistema</p>
                </div>
                <input type="checkbox" className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Apariencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPalette className="w-5 h-5" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Tema</Label>
              <select 
                id="theme" 
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="light"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language">Idioma</Label>
              <select 
                id="language" 
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="es"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <Label htmlFor="timezone">Zona Horaria</Label>
              <select 
                id="timezone" 
                className="w-full p-2 border border-gray-300 rounded-md"
                defaultValue="America/Lima"
              >
                <option value="America/Lima">Lima (GMT-5)</option>
                <option value="America/New_York">Nueva York (GMT-5)</option>
                <option value="Europe/Madrid">Madrid (GMT+1)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          Restablecer
        </Button>
        <Button 
          onClick={handleSaveConfig}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
} 
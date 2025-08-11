"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconEye, IconFileText, IconCalendar, IconUser, IconMail, IconPhone, IconId } from "@tabler/icons-react"
import { Usuario, RolUsuario } from "@/types/usuario"

interface UsuarioProfileModalProps {
  usuario: Usuario
  onClose: () => void
  trigger?: React.ReactNode
}

export function UsuarioProfileModal({ usuario, onClose, trigger }: UsuarioProfileModalProps) {
  const [open, setOpen] = useState(false)

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  const getRolDisplayName = (rol: RolUsuario) => {
    switch (rol) {
      case RolUsuario.ADMIN:
        return "Administrador"
      case RolUsuario.SUPERADMIN:
        return "Super Administrador"
      case RolUsuario.ESPECIALISTA_AUDIENCIA:
        return "Especialista de Audiencia"
      case RolUsuario.COORDINADOR_ESPECIALISTA:
        return "Coordinador Especialista"
      default:
        return "Usuario"
    }
  }

  const getRolColor = (rol: RolUsuario) => {
    switch (rol) {
      case RolUsuario.ADMIN:
        return "bg-blue-100 text-blue-800"
      case RolUsuario.SUPERADMIN:
        return "bg-purple-100 text-purple-800"
      case RolUsuario.ESPECIALISTA_AUDIENCIA:
        return "bg-green-100 text-green-800"
      case RolUsuario.COORDINADOR_ESPECIALISTA:
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Ver perfil">
            <IconEye className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil de Usuario</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tarjeta de Perfil Principal */}
          <Card className="relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 opacity-10"></div>
            
            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  {/* Foto de perfil */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {usuario.nombres?.charAt(0) || "U"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {usuario.nombres} {usuario.apellidos_paterno} {usuario.apellidos_materno}
                    </h2>
                    <p className="text-gray-600">{getRolDisplayName(usuario.rol)}</p>
                    <Badge className={getRolColor(usuario.rol)}>
                      {usuario.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <IconEye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="relative">
              {/* Información de contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <IconMail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    <p className="font-medium">{usuario.correo}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <IconPhone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{usuario.telefono}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <IconId className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">DNI</p>
                    <p className="font-medium">{usuario.dni}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <IconUser className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <p className="font-medium">{getRolDisplayName(usuario.rol)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Actas Generadas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IconFileText className="h-5 w-5" />
                <span>Actas Generadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-sm text-gray-600">Total de Actas</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">18</div>
                    <div className="text-sm text-gray-600">Este Mes</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">6</div>
                    <div className="text-sm text-gray-600">Esta Semana</div>
                  </div>
                </div>

                {/* Lista de actas recientes */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Actas Recientes</h4>
                  
                  {/* Acta 1 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconFileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Acta de Audiencia #2024-001</p>
                        <p className="text-sm text-gray-600">Audiencia Civil - Sala 1</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconCalendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">15 Mar 2024</span>
                    </div>
                  </div>

                  {/* Acta 2 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <IconFileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Acta de Audiencia #2024-002</p>
                        <p className="text-sm text-gray-600">Audiencia Penal - Sala 2</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconCalendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">12 Mar 2024</span>
                    </div>
                  </div>

                  {/* Acta 3 */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IconFileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Acta de Audiencia #2024-003</p>
                        <p className="text-sm text-gray-600">Audiencia Comercial - Sala 3</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <IconCalendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">10 Mar 2024</span>
                    </div>
                  </div>
                </div>

                {/* Botón para ver todas las actas */}
                <div className="pt-4">
                  <Button className="w-full" variant="outline">
                    <IconFileText className="h-4 w-4 mr-2" />
                    Ver Todas las Actas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
} 
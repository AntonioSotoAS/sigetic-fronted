"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconMail, IconPhone, IconId, IconUser, IconBuilding, IconCalendar, IconMapPin } from "@tabler/icons-react"
import { getRolNombre, getCargoNombre } from "@/lib/utils/role-utils"
import { PerfilResponse } from "@/types/auth"

interface ProfileCardProps {
  user: PerfilResponse
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const userName = user.nombres || user.correo || "Usuario"
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const fullName = `${user.nombres || ''} ${user.apellidos_paterno || ''} ${user.apellidos_materno || ''}`.trim()
 
  return (
    <Card className="overflow-hidden">
      
      {/* Avatar y información principal */}
      <div className="relative px-6 pb-6 pt-14">
        <div className="flex flex-col items-center -mt-16 mb-6">
          <Avatar className="h-40 w-40 border-4 border-white shadow-lg">
            {user.foto_perfil ? (
              <AvatarImage 
                src={user.foto_perfil} 
                alt={`Foto de perfil de ${user.nombres}`}
              />
            ) : null}
            <AvatarFallback className="text-2xl font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500 mb-1">@{user.correo?.split('@')[0] || 'usuario'}</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{fullName}</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <IconMapPin className="w-4 h-4" />
              <span>{user.sede?.nombre || 'Sede no asignada'}</span>
              <span className="text-gray-400">•</span>
              <IconCalendar className="w-4 h-4" />
              <span>Miembro desde 2024</span>
            </div>
          </div>

          {/* Badges de estado */}
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="px-3 py-1">
              {getRolNombre(user.rol)}
            </Badge>
            <Badge variant={user.activo ? "default" : "destructive"} className="px-3 py-1">
              {user.activo ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </div>

        {/* Información detallada */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IconUser className="w-5 h-5 text-blue-600" />
              Información Personal
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IconId className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">DNI</p>
                  <p className="text-sm font-medium">{user.dni || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconPhone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="text-sm font-medium">{user.telefono || "No especificado"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconMail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="text-sm font-medium">{user.correo}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IconBuilding className="w-5 h-5 text-green-600" />
              Información Laboral
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <IconMapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Sede</p>
                  <p className="text-sm font-medium">{user.sede?.nombre || "No asignada"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconBuilding className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Dependencia</p>
                  <p className="text-sm font-medium">{user.dependencia?.nombre || "No asignada"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IconUser className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500">Cargo</p>
                                     <p className="text-sm font-medium capitalize">{getCargoNombre(user.cargo) || getRolNombre(user.rol)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 
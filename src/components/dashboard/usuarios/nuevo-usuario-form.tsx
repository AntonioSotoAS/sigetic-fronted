"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { IconDeviceFloppy, IconPlus } from "@tabler/icons-react"
import { CreateUsuarioDto, RolUsuario } from "@/types/usuario"
import { useCreateUsuarioMutation } from "@/store/api/usuarioApi"
import { toast } from "react-hot-toast"

interface NuevoUsuarioFormProps {
  onCancel: () => void
  trigger?: React.ReactNode
}

export function NuevoUsuarioForm({ onCancel, trigger }: NuevoUsuarioFormProps) {
  const [open, setOpen] = useState(false)
  const [createUsuario, { isLoading }] = useCreateUsuarioMutation()
  
  const [formData, setFormData] = useState({
    correo: "",
    nombres: "",
    apellidos_paterno: "",
    apellidos_materno: "",
    dni: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    rol: RolUsuario.ADMIN,
    activo: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.correo) {
      newErrors.correo = "El correo es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "El correo no es válido"
    }

    if (!formData.nombres) {
      newErrors.nombres = "Los nombres son requeridos"
    }

    if (!formData.apellidos_paterno) {
      newErrors.apellidos_paterno = "El apellido paterno es requerido"
    }

    if (!formData.dni) {
      newErrors.dni = "El DNI es requerido"
    } else if (formData.dni.length !== 8) {
      newErrors.dni = "El DNI debe tener 8 caracteres"
    }

    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es requerido"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData: CreateUsuarioDto = {
      correo: formData.correo,
      nombres: formData.nombres,
      apellidos_paterno: formData.apellidos_paterno,
      apellidos_materno: formData.apellidos_materno,
      dni: formData.dni,
      telefono: formData.telefono,
      password: formData.password,
      rol: formData.rol,
      activo: formData.activo,
    }

    try {
      await createUsuario(submitData).unwrap()
      
      // Si llegamos aquí, la operación fue exitosa
      toast.success("Usuario creado exitosamente")
      setOpen(false)
      onCancel()
      // Reset form
      setFormData({
        correo: "",
        nombres: "",
        apellidos_paterno: "",
        apellidos_materno: "",
        dni: "",
        telefono: "",
        password: "",
        confirmPassword: "",
        rol: RolUsuario.ADMIN,
        activo: true,
      })
      setErrors({})
    } catch (error) {
      console.error("NUEVO - Error al crear usuario:", error)
      const message = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : "Error al crear usuario"
      toast.error(message || "Error al crear usuario")
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <IconPlus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Crea un nuevo usuario en el sistema
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="correo">Correo Electrónico *</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => handleInputChange("correo", e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className={errors.correo ? "border-red-500" : ""}
                />
                {errors.correo && <p className="text-sm text-red-500">{errors.correo}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rol">Rol *</Label>
                <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value)}>
                  <SelectTrigger className={errors.rol ? "border-red-500" : ""}>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={RolUsuario.ADMIN}>Administrador</SelectItem>
                    <SelectItem value={RolUsuario.SUPERADMIN}>Super Administrador</SelectItem>
                    <SelectItem value={RolUsuario.ESPECIALISTA_AUDIENCIA}>Especialista de Audiencia</SelectItem>
                    <SelectItem value={RolUsuario.COORDINADOR_ESPECIALISTA}>Coordinador Especialista</SelectItem>
                  </SelectContent>
                </Select>
                {errors.rol && <p className="text-sm text-red-500">{errors.rol}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                  placeholder="Juan Carlos"
                  className={errors.nombres ? "border-red-500" : ""}
                />
                {errors.nombres && <p className="text-sm text-red-500">{errors.nombres}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="apellidos_paterno">Apellido Paterno *</Label>
                <Input
                  id="apellidos_paterno"
                  value={formData.apellidos_paterno}
                  onChange={(e) => handleInputChange("apellidos_paterno", e.target.value)}
                  placeholder="García"
                  className={errors.apellidos_paterno ? "border-red-500" : ""}
                />
                {errors.apellidos_paterno && <p className="text-sm text-red-500">{errors.apellidos_paterno}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="apellidos_materno">Apellido Materno</Label>
                <Input
                  id="apellidos_materno"
                  value={formData.apellidos_materno}
                  onChange={(e) => handleInputChange("apellidos_materno", e.target.value)}
                  placeholder="López"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dni">DNI *</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => handleInputChange("dni", e.target.value)}
                  placeholder="12345678"
                  maxLength={8}
                  className={errors.dni ? "border-red-500" : ""}
                />
                {errors.dni && <p className="text-sm text-red-500">{errors.dni}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="999888777"
                  className={errors.telefono ? "border-red-500" : ""}
                />
                {errors.telefono && <p className="text-sm text-red-500">{errors.telefono}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="activo"
                checked={formData.activo}
                onChange={(e) => handleInputChange("activo", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="activo">Usuario activo</Label>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              <IconDeviceFloppy className="h-4 w-4 mr-2" />
              {isLoading ? "Guardando..." : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
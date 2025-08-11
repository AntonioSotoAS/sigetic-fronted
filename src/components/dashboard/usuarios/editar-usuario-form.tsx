"use client"

import { useState, useEffect } from "react"
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
import { IconDeviceFloppy, IconEdit } from "@tabler/icons-react"
import { Usuario, UpdateUsuarioDto, RolUsuario } from "@/types/usuario"
import { z } from "zod"
import { useUpdateUsuarioMutation } from "@/store/api/usuarioApi"
import { toast } from "react-hot-toast"

// Schema de validación con Zod
const editarUsuarioSchema = z.object({
  correo: z.string().email("El correo no es válido").min(1, "El correo es requerido"),
  nombres: z.string().min(1, "Los nombres son requeridos"),
  apellidos_paterno: z.string().min(1, "El apellido paterno es requerido"),
  apellidos_materno: z.string().optional(),
  dni: z.string().length(8, "El DNI debe tener 8 caracteres").min(1, "El DNI es requerido"),
  telefono: z.string().min(1, "El teléfono es requerido"),
  rol: z.nativeEnum(RolUsuario),
  activo: z.boolean(),
})

type EditarUsuarioFormData = z.infer<typeof editarUsuarioSchema>

interface EditarUsuarioFormProps {
  usuario: Usuario
  onCancel?: () => void
  trigger?: React.ReactNode
}

export function EditarUsuarioForm({ usuario, onCancel, trigger }: EditarUsuarioFormProps) {
  const [open, setOpen] = useState(false)
  const [updateUsuario, { isLoading }] = useUpdateUsuarioMutation()
  
  const [formData, setFormData] = useState<EditarUsuarioFormData>({
    correo: "",
    nombres: "",
    apellidos_paterno: "",
    apellidos_materno: "",
    dni: "",
    telefono: "",
    rol: RolUsuario.ADMIN,
    activo: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when usuario changes
  useEffect(() => {
    if (usuario) {
      setFormData({
        correo: usuario.correo || "",
        nombres: usuario.nombres || "",
        apellidos_paterno: usuario.apellidos_paterno || "",
        apellidos_materno: usuario.apellidos_materno || "",
        dni: usuario.dni || "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || RolUsuario.ESPECIALISTA_AUDIENCIA,
        activo: usuario.activo ?? true,
      })
    }
    setErrors({})
  }, [usuario])

  const validateForm = (): boolean => {
    try {
      editarUsuarioSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData: UpdateUsuarioDto = {
      id: usuario.id,
      correo: formData.correo,
      nombres: formData.nombres,
      apellidos_paterno: formData.apellidos_paterno,
      apellidos_materno: formData.apellidos_materno,
      dni: formData.dni,
      telefono: formData.telefono,
      rol: formData.rol,
      activo: formData.activo,
    }

    try {
      await updateUsuario(submitData).unwrap()
      
      // Si llegamos aquí, la operación fue exitosa
      toast.success("Usuario actualizado exitosamente")
      setOpen(false)
      onCancel?.()
    } catch (error) {
      console.error("EDITAR - Error al actualizar usuario:", error)
      const message = error && typeof error === 'object' && 'data' in error 
        ? (error.data as { message?: string })?.message 
        : "Error al actualizar usuario"
      toast.error(message || "Error al actualizar usuario")
    }
  }

  const handleInputChange = (field: keyof EditarUsuarioFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Editar usuario">
            <IconEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario
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
                <Select value={formData.rol} onValueChange={(value) => handleInputChange("rol", value as RolUsuario)}>
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
              {isLoading ? "Guardando..." : "Actualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
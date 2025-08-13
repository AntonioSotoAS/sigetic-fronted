"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdatePasswordMutation } from "@/store/api/authApi"
import { toast } from "react-hot-toast"
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react"

interface UpdatePasswordCardProps {
  isModal?: boolean
  onSuccess?: () => void
}

export function UpdatePasswordCard({ isModal = false, onSuccess }: UpdatePasswordCardProps) {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation()
  
  // Test de toast al cargar el componente
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    password_actual: "",
    password_nuevo: "",
    confirmPassword: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.password_actual) {
      newErrors.password_actual = "La contraseña actual es requerida"
    }

    if (!formData.password_nuevo) {
      newErrors.password_nuevo = "La nueva contraseña es requerida"
    } else if (formData.password_nuevo.length < 6) {
      newErrors.password_nuevo = "La nueva contraseña debe tener al menos 6 caracteres"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma la nueva contraseña"
    } else if (formData.password_nuevo !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (formData.password_actual === formData.password_nuevo) {
      newErrors.password_nuevo = "La nueva contraseña debe ser diferente a la actual"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) {
      return
    }

    try {
      const result = await updatePassword({
        password_actual: formData.password_actual,
        password_nuevo: formData.password_nuevo
      }).unwrap()

      if (result.success) {
        toast.success("Contraseña actualizada exitosamente. Serás redirigido al login...")
        
        // Si es modal, llamar al callback de éxito
        if (onSuccess) {
          onSuccess()
        }
        
        // Hacer logout automáticamente después de 2 segundos
        setTimeout(async () => {
          try {
            // Limpiar localStorage
            localStorage.removeItem('passwordResetRequired')
            
            // Hacer logout en el backend
            const logoutResponse = await fetch('/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            
            if (logoutResponse.ok) {
              // Logout exitoso
            } else {
              console.warn("⚠️ Logout no exitoso, pero redirigiendo de todas formas...")
            }
            
            // Redirigir al login
            window.location.href = '/login'
          } catch (error) {
            console.error('❌ Error al hacer logout:', error)
            // Redirigir de todas formas
            window.location.href = '/login'
          }
        }, 2000)
      } else {
        toast.error("Error al actualizar la contraseña")
      }
    } catch (error) {
      console.error("❌ Error al actualizar contraseña:", error)
      
      // Manejo específico de errores para mejor feedback
      let errorMessage = "Error al actualizar contraseña"
      
      if (error && typeof error === 'object') {
        // Error de RTK Query
        if ('data' in error && error.data && typeof error.data === 'object') {
          const errorData = error.data as { message?: string; error?: string }
          errorMessage = errorData.message || errorData.error || errorMessage
        }
        // Error con mensaje directo
        else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message
        }
      }
      
      // Mostrar error específico y limpiar solo la contraseña actual
      toast.error(errorMessage)
      setFormData(prev => ({
        ...prev,
        password_actual: ""
      }))
      setErrors(prev => ({
        ...prev,
        password_actual: "Verifica tu contraseña actual"
      }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword)
        break
      case 'new':
        setShowNewPassword(!showNewPassword)
        break
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword)
        break
    }
  }

  return (
    <Card className={isModal ? "w-full max-w-md mx-auto" : ""}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-blue-100 rounded-full">
            <IconLock className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl">
          {isModal ? "Cambio de Contraseña Obligatorio" : "Cambiar Contraseña"}
        </CardTitle>
        {isModal && (
          <p className="text-sm text-gray-600">
            Por seguridad, debes cambiar tu contraseña antes de continuar
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password_actual">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="password_actual"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.password_actual}
                onChange={(e) => handleInputChange("password_actual", e.target.value)}
                placeholder="Ingresa tu contraseña actual"
                className={errors.password_actual ? "border-red-500" : ""}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
                disabled={isLoading}
              >
                {showCurrentPassword ? (
                  <IconEyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <IconEye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.password_actual && (
              <p className="text-sm text-red-500">{errors.password_actual}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_nuevo">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="password_nuevo"
                type={showNewPassword ? "text" : "password"}
                value={formData.password_nuevo}
                onChange={(e) => handleInputChange("password_nuevo", e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                className={errors.password_nuevo ? "border-red-500" : ""}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
                disabled={isLoading}
              >
                {showNewPassword ? (
                  <IconEyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <IconEye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.password_nuevo && (
              <p className="text-sm text-red-500">{errors.password_nuevo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                className={errors.confirmPassword ? "border-red-500" : ""}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <IconEyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <IconEye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Actualizando..." : "Actualizar Contraseña"}
          </Button>
          
          
          {isModal && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2"
              onClick={async () => {
                try {
                  // Limpiar localStorage
                  localStorage.removeItem('passwordResetRequired')
                  
                  // Hacer logout en el backend
                  const logoutResponse = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  })
                  
                  if (logoutResponse.ok) {
                    // Logout exitoso
                  } else {
                    console.warn("⚠️ Logout manual no exitoso, pero redirigiendo de todas formas...")
                  }
                  
                  window.location.href = '/login'
                } catch (error) {
                  console.error('❌ Error al cerrar sesión manualmente:', error)
                  window.location.href = '/login'
                }
              }}
            >
              Cerrar Sesión
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
} 
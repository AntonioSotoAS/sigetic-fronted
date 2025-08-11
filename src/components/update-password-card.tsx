"use client"

import { useState, useEffect } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdatePasswordMutation } from "@/store/api/usuarioApi"
import { updatePasswordSchema, type UpdatePasswordFormData } from "@/lib/validations/password"
import * as yup from "yup"

export default function UpdatePasswordCard() {
  const [updatePassword, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation()

  // Estados para el formulario de contraseña
  const [passwordData, setPasswordData] = useState<UpdatePasswordFormData>({
    password_actual: "",
    password_nuevo: "",
    confirmPassword: ""
  })

  // Estados para errores de validación
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})

  // Estados para mostrar/ocultar contraseñas
  const [showPasswords, setShowPasswords] = useState({
    password_actual: false,
    password_nuevo: false,
    confirmPassword: false
  })

  // Función para validar en tiempo real
  const validatePasswordForm = async () => {
    try {
      await updatePasswordSchema.validate(passwordData, { abortEarly: false })
      setPasswordErrors({})
      return true
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const fieldErrors: Record<string, string> = {}
        
        error.inner.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path] = err.message
          }
        })
        
        setPasswordErrors(fieldErrors)
        return false
      }
      return false
    }
  }

  // Validar cuando cambian los datos
  useEffect(() => {
    // Solo validar si al menos uno de los campos tiene contenido
    const hasAnyContent = passwordData.password_actual || passwordData.password_nuevo || passwordData.confirmPassword
    
    if (hasAnyContent) {
      validatePasswordForm()
    } else {
      // Si todos están vacíos, limpiar errores
      setPasswordErrors({})
    }
  }, [passwordData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actualizar Contraseña</CardTitle>
        <CardDescription>Cambia tu contraseña de acceso</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password_actual">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="password_actual"
                type={showPasswords.password_actual ? "text" : "password"}
                placeholder="Ingresa tu contraseña actual"
                value={passwordData.password_actual}
                onChange={(e) => setPasswordData(prev => ({ ...prev, password_actual: e.target.value }))}
                className={passwordErrors.password_actual ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, password_actual: !prev.password_actual }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.password_actual ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.password_actual && (
              <p className="text-sm text-red-500">{passwordErrors.password_actual}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_nuevo">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="password_nuevo"
                type={showPasswords.password_nuevo ? "text" : "password"}
                placeholder="Ingresa tu nueva contraseña"
                value={passwordData.password_nuevo}
                onChange={(e) => setPasswordData(prev => ({ ...prev, password_nuevo: e.target.value }))}
                className={passwordErrors.password_nuevo ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, password_nuevo: !prev.password_nuevo }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.password_nuevo ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.password_nuevo && (
              <p className="text-sm text-red-500">{passwordErrors.password_nuevo}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirmPassword ? "text" : "password"}
                placeholder="Confirma tu nueva contraseña"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={passwordErrors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirmPassword ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
            )}
          </div>
        </div>
        <Button
          className="w-full md:w-auto"
          disabled={isUpdatingPassword || Object.keys(passwordErrors).length > 0}
          onClick={async () => {
            // Prevenir múltiples clicks
            if (isUpdatingPassword) return
            
            // Validar antes de enviar
            const isValid = await validatePasswordForm()
            if (!isValid) {
              return
            }

            try {
              // Verificar que los campos requeridos estén presentes
              if (!passwordData.password_actual || !passwordData.password_nuevo) {
                toast.error("Todos los campos son requeridos")
                return
              }

              // Actualizar contraseña
              await updatePassword({
                password_actual: passwordData.password_actual,
                password_nuevo: passwordData.password_nuevo
              }).unwrap()
              
              // Mostrar toast de éxito
              toast.success("Contraseña actualizada exitosamente")
              
              // Limpiar formulario
              setPasswordData({
                password_actual: "",
                password_nuevo: "",
                confirmPassword: ""
              })
              
              // Resetear estados de mostrar/ocultar contraseñas
              setShowPasswords({
                password_actual: false,
                password_nuevo: false,
                confirmPassword: false
              })
            } catch (error) {
              console.log("Error completo:", error)
              
              if (error && typeof error === 'object' && 'data' in error) {
                // Error de RTK Query
                const errorData = error.data as { message?: string }
                toast.error(errorData?.message || "Error al actualizar contraseña")
              } else if (error instanceof Error) {
                toast.error(error.message)
              } else {
                toast.error("Error inesperado")
              }
            }
          }}
        >
          {isUpdatingPassword ? "Actualizando contraseña..." : "Actualizar Contraseña"}
        </Button>
      </CardContent>
    </Card>
  )
} 
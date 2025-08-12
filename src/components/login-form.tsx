"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLoginMutation } from "@/store/api/authApi"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"

// Ejemplos de uso de react-hot-toast:
// toast.success("Mensaje de éxito")
// toast.error("Mensaje de error")
// toast.loading("Cargando...")
// toast("Mensaje neutral")
// toast.promise(promise, {
//   loading: 'Guardando...',
//   success: 'Guardado exitosamente',
//   error: 'Error al guardar'
// })

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [login, { isLoading }] = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    dni: "",
    password: ""
  })

  // Verificar si ya está autenticado al cargar el componente
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      toast.success("Ya tienes una sesión activa. Redirigiendo al dashboard...")
      router.push("/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validar que los campos no estén vacíos
    if (!formData.dni || !formData.password) {
      toast.error("Por favor, completa todos los campos")
      return
    }
    
    // Validar formato del DNI
    if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
      toast.error("El DNI debe tener 8 dígitos numéricos")
      return
    }
    
    try {
      const result = await login(formData).unwrap()
      
      if (result.success) {
        toast.success("¡Inicio de sesión exitoso! Redirigiendo al dashboard...")
        
        // Usar setTimeout para asegurar que el toast se muestre antes de la redirección
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        toast.error("Error en el inicio de sesión")
      }
    } catch (error) {
      console.error("Error en login:", error)
      // El error ya se maneja en el onQueryStarted del authApi
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    
    if (id === 'dni') {
      // Solo permitir números y limitar a 8 dígitos
      const numericValue = value.replace(/\D/g, '').slice(0, 8)
      setFormData({
        ...formData,
        [id]: numericValue
      })
    } else {
      setFormData({
        ...formData,
        [id]: value
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground text-sm">Verificando sesión...</p>
      </div>
    )
  }

  // Si ya está autenticado, no mostrar el formulario
  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground text-sm">Redirigiendo al dashboard...</p>
      </div>
    )
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Inicia sesión en tu cuenta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Ingresa tu DNI para acceder a tu cuenta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="dni">DNI</Label>
          <Input 
            id="dni" 
            type="text" 
            placeholder="Ingresa tu DNI (8 dígitos)" 
            value={formData.dni}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            maxLength={8}
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="pr-10"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={togglePasswordVisibility}
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        <Button 
          type="button" 
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </div>
    </form>
  )
}

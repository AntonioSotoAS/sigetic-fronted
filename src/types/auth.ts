export interface LoginDto {
  dni: string
  password: string
}
  
  export interface LoginResponse {
    message: string
  }
  
  export interface PerfilResponse {
    id: number
    correo: string
    password: string
    nombres: string
    apellidos_paterno: string
    apellidos_materno: string
    dni: string
    telefono: string
    rol: "admin" | "juez" | "superadmin" | "jefe_soporte" | "ingeniero_soporte" | "usuario"
    cargo?: {
      id: number
      nombre: string
      activo: boolean
    }
    sede: {
      id: number
      nombre: string
      direccion?: string
      telefono?: string
      email?: string
      activo: boolean
      created_at?: string
      updated_at?: string
    }
    dependencia: {
      id: number
      nombre: string
      descripcion?: string
      activo: boolean
      sede?: {
        id: number
        nombre: string
        direccion?: string
        telefono?: string
        email?: string
        activo: boolean
        created_at?: string
        updated_at?: string
      }
    }
    foto_perfil?: string
    activo: boolean
    password_resetada: boolean
    sede_soporte?: number[] | null
    created_at?: string
    updated_at?: string
    sedeId?: number
  }
  
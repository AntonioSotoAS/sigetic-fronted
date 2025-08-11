export interface LoginDto {
    correo: string
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
    cargo?: string
    sede: {
      id: number
      nombre: string
      direccion: string
      activo: boolean
    }
    dependencia: {
      id: number
      nombre: string
      descripcion?: string
      activo: boolean
      sede_id: number
    }
    foto_perfil?: string
    activo: boolean
  }
  
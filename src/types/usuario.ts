// src/types/usuario.ts

export enum RolUsuario {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  ESPECIALISTA_AUDIENCIA = 'especialista_audiencia',
  COORDINADOR_ESPECIALISTA = 'coordinador_especialista',
}

export interface Usuario {
  id: number
  correo: string
  nombres: string
  apellidos_paterno: string
  apellidos_materno: string
  dni: string
  telefono: string
  password: string
  rol: RolUsuario
  sede?: {
    id: number
    nombre: string
  }
  activo: boolean
}

export interface CreateUsuarioDto {
  correo: string
  nombres: string
  apellidos_paterno: string
  apellidos_materno: string
  dni: string
  telefono: string
  password: string
  rol: RolUsuario
  activo?: boolean
  sede_id?: number
}

export interface UpdateUsuarioDto extends Partial<CreateUsuarioDto> {
  id: number
}

export interface UsuarioResponse {
  message: string
  success: boolean
  data?: Usuario
}

export interface UsuariosResponse {
  message: string
  success: boolean
  data: Usuario[]
  total: number
  page: number
  limit: number
}

// Tipos para filtros y paginación
export interface UsuarioFilters {
  page?: number
  limit?: number
}

// Tipos para operaciones específicas
export interface ToggleUsuarioEstadoDto {
  id: number
  activo: boolean
}

export interface ChangePasswordDto {
  id: number
  password: string
  confirmPassword: string
} 
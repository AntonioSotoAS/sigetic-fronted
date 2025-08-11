// src/types/ticket.ts



export enum PrioridadTicket {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
  URGENTE = 'urgente',
}

export enum EstadoTicket {
  PENDIENTE = 'pendiente',
  ASIGNADO = 'asignado',
  EN_PROCESO = 'en_proceso',
  RESUELTO = 'resuelto',
  CERRADO = 'cerrado',
}

export enum TipoComentario {
  INTERNO = 'interno',
  PUBLICO = 'publico',
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
  rol: string
  cargo?: string
  sede: Sede
  dependencia: Dependencia
  foto_perfil?: string
  activo: boolean
}

export interface Dependencia {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
  sede_id: number
  sede?: Sede
}

export interface Sede {
  id: number
  nombre: string
  direccion: string
  activo: boolean
}

export interface Categoria {
  id: number
  nombre: string
  descripcion?: string
  activo: boolean
}

export interface Subcategoria {
  id: number
  nombre: string
  descripcion?: string
  categoria_id: number
  activo: boolean
}

export interface ComentarioTicket {
  id: number
  ticket_id: number
  user: Usuario
  comentario: string
  tipo: TipoComentario
  created_at: string
}

export interface Ticket {
  id: number
  titulo: string | null
  descripcion: string | null
  prioridad: PrioridadTicket
  estado: EstadoTicket
  user?: Usuario
  dependencia?: Dependencia
  sede?: Sede
  categoria?: Categoria | null
  subcategoria?: Subcategoria | null
  tecnico?: Usuario | null
  fecha_asignacion: string | null
  fecha_resolucion: string | null
  fecha_cierre: string | null
  comentarios_ticket: ComentarioTicket[]
  created_at: string
  updated_at: string
}

// DTOs para crear y actualizar tickets
export interface CreateTicketDto {
  user_id: number
  titulo?: string
  descripcion?: string
  prioridad: PrioridadTicket
  dependencia_id: number
  sede_id: number
  categoria_id?: number
  subcategoria_id?: number
  tecnico_id?: number
}

export interface UpdateTicketDto {
  estado?: EstadoTicket
  tecnico_id?: number
  fecha_cierre?: string
}

// Filtros para listar tickets
export interface FilterTicketDto {
  limit?: number
  offset?: number
  page?: number
  estado?: EstadoTicket
  categoria_id?: number
  prioridad?: PrioridadTicket
}

// Respuestas de la API
export interface TicketResponse {
  success: boolean
  message?: string
  data: Ticket
}

export interface TicketsResponse {
  success: boolean
  message?: string
  data: Ticket[]
  total: number
  limit: number
  offset: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Interfaz para debug
export interface DebugResponse {
  success: boolean
  message?: string
  data: any
}

// DTOs para comentarios
export interface CreateComentarioDto {
  comentario: string
  tipo?: TipoComentario
}

export interface ComentarioResponse {
  success: boolean
  message?: string
  data: ComentarioTicket
}

export interface ComentariosResponse {
  success: boolean
  message?: string
  data: ComentarioTicket[]
}

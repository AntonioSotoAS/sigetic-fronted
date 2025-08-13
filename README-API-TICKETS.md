# 🎫 API Sistema de Tickets - SIGETIC (NestJS)

## 📋 Descripción General

Este documento describe las entidades, controladores y endpoints necesarios para el sistema de tickets de soporte técnico de SIGETIC usando NestJS y TypeORM.

## 🗂️ Entidades (Entities)

### 1. **Usuario**
```typescript
// src/usuario/entities/usuario.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Sede } from '../../sede/entities/sede.entity'
import { Dependencia } from '../../dependencia/entities/dependencia.entity'
import { RolUsuario } from '../roles.enum'
import { Ticket } from '../../ticket/entities/ticket.entity'

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  correo: string

  @Column()
  nombres: string

  @Column()
  apellidos_paterno: string

  @Column()
  apellidos_materno: string

  @Column()
  dni: string

  @Column({ unique: true })
  telefono: string

  @Column()
  password: string

  @Column({
    type: 'enum',
    enum: RolUsuario,
  })
  rol: RolUsuario

  @ManyToOne(() => Sede, (sede) => sede.usuarios, { eager: true })
  @JoinColumn({ name: 'sede_id' })
  sede: Sede

  @ManyToOne(() => Dependencia, (dependencia) => dependencia.usuarios, { eager: true })
  @JoinColumn({ name: 'dependencia_id' })
  dependencia: Dependencia

  @Column({ nullable: true })
  foto_perfil: string

  @Column({ default: true })
  activo: boolean

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[]

  @OneToMany(() => Ticket, (ticket) => ticket.tecnico)
  tickets_asignados: Ticket[]
}
```

### 2. **Dependencia**
```typescript
// src/dependencia/entities/dependencia.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { Usuario } from '../../usuario/entities/usuario.entity'
import { Ticket } from '../../ticket/entities/ticket.entity'

@Entity()
export class Dependencia {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column({ nullable: true })
  descripcion: string

  @Column({ default: true })
  activo: boolean

  @OneToMany(() => Usuario, (usuario) => usuario.dependencia)
  usuarios: Usuario[]

  @OneToMany(() => Ticket, (ticket) => ticket.dependencia)
  tickets: Ticket[]
}
```

### 3. **Sede**
```typescript
// src/sede/entities/sede.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'
import { Usuario } from '../../usuario/entities/usuario.entity'
import { Ticket } from '../../ticket/entities/ticket.entity'

@Entity()
export class Sede {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  nombre: string

  @Column({ nullable: true })
  direccion: string

  @Column()
  ciudad: string

  @Column({ default: true })
  activo: boolean

  @OneToMany(() => Usuario, (usuario) => usuario.sede)
  usuarios: Usuario[]

  @OneToMany(() => Ticket, (ticket) => ticket.sede)
  tickets: Ticket[]
}
```

### 4. **Ticket**
```typescript
// src/ticket/entities/ticket.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Usuario } from '../../usuario/entities/usuario.entity'
import { Dependencia } from '../../dependencia/entities/dependencia.entity'
import { Sede } from '../../sede/entities/sede.entity'
import { ComentarioTicket } from '../../comentario-ticket/entities/comentario-ticket.entity'

export enum CategoriaTicket {
  HARDWARE = 'hardware',
  SOFTWARE = 'software',
}

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

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  titulo: string

  @Column('text')
  descripcion: string

  @Column('text', { nullable: true })
  comentarios: string

  @Column({
    type: 'enum',
    enum: CategoriaTicket,
  })
  categoria: CategoriaTicket

  @Column({
    type: 'enum',
    enum: PrioridadTicket,
  })
  prioridad: PrioridadTicket

  @Column({
    type: 'enum',
    enum: EstadoTicket,
    default: EstadoTicket.PENDIENTE,
  })
  estado: EstadoTicket

  @ManyToOne(() => Usuario, (usuario) => usuario.tickets)
  @JoinColumn({ name: 'user_id' })
  user: Usuario

  @ManyToOne(() => Dependencia, (dependencia) => dependencia.tickets)
  @JoinColumn({ name: 'dependencia_id' })
  dependencia: Dependencia

  @ManyToOne(() => Sede, (sede) => sede.tickets)
  @JoinColumn({ name: 'sede_id' })
  sede: Sede

  @ManyToOne(() => Usuario, (usuario) => usuario.tickets_asignados, { nullable: true })
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: Usuario

  @Column({ nullable: true })
  fecha_asignacion: Date

  @Column({ nullable: true })
  fecha_resolucion: Date

  @Column({ nullable: true })
  fecha_cierre: Date

  @OneToMany(() => ComentarioTicket, (comentario) => comentario.ticket)
  comentarios_ticket: ComentarioTicket[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
```

### 5. **ComentarioTicket**
```typescript
// src/comentario-ticket/entities/comentario-ticket.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm'
import { Ticket } from '../../ticket/entities/ticket.entity'
import { Usuario } from '../../usuario/entities/usuario.entity'

export enum TipoComentario {
  INTERNO = 'interno',
  PUBLICO = 'publico',
}

@Entity()
export class ComentarioTicket {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Ticket, (ticket) => ticket.comentarios_ticket, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'user_id' })
  user: Usuario

  @Column('text')
  comentario: string

  @Column({
    type: 'enum',
    enum: TipoComentario,
    default: TipoComentario.PUBLICO,
  })
  tipo: TipoComentario

  @CreateDateColumn()
  created_at: Date
}
```

## 🎮 Controladores (Controllers)

### 1. **TicketController**
```typescript
// src/ticket/ticket.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common'
import { TicketService } from './ticket.service'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { FilterTicketDto } from './dto/filter-ticket.dto'
import { JwtAuthGuard } from 'src/auth/jwt.guard'
import { GetUser } from '../common/decorators/get-user.decorator'
import { Usuario } from '../usuario/entities/usuario.entity'
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger'

@ApiTags('Tickets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'prioridad', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  findAll(
    @Query() filterDto: FilterTicketDto,
    @GetUser() user: Usuario,
  ) {
    return this.ticketService.findAll(filterDto, user)
  }

  @Get('sin-asignar')
  findSinAsignar(@GetUser() user: Usuario) {
    return this.ticketService.findSinAsignar(user)
  }

  @Get('mis-tickets')
  findMisTickets(@GetUser() user: Usuario) {
    return this.ticketService.findMisTickets(user)
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuario,
  ) {
    return this.ticketService.findOne(id, user)
  }

  @Post()
  create(
    @Body() dto: CreateTicketDto,
    @GetUser() user: Usuario,
  ) {
    return this.ticketService.create(dto, user)
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTicketDto,
    @GetUser() user: Usuario,
  ) {
    return this.ticketService.update(id, dto, user)
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: Usuario,
  ) {
    return this.ticketService.delete(id, user)
  }
}
```

### 2. **DependenciaController**
```typescript
// src/dependencia/dependencia.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common'
import { DependenciaService } from './dependencia.service'
import { JwtAuthGuard } from 'src/auth/jwt.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Dependencias')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dependencias')
export class DependenciaController {
  constructor(private readonly dependenciaService: DependenciaService) {}

  @Get()
  findAll() {
    return this.dependenciaService.findAll()
  }
}
```

### 3. **SedeController**
```typescript
// src/sede/sede.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common'
import { SedeService } from './sede.service'
import { JwtAuthGuard } from 'src/auth/jwt.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('Sedes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sedes')
export class SedeController {
  constructor(private readonly sedeService: SedeService) {}

  @Get()
  findAll() {
    return this.sedeService.findAll()
  }
}
```

## 📝 DTOs (Data Transfer Objects)

### **CreateTicketDto**
```typescript
// src/ticket/dto/create-ticket.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator'
import { CategoriaTicket, PrioridadTicket } from '../entities/ticket.entity'

export class CreateTicketDto {
  @IsString()
  titulo: string

  @IsString()
  descripcion: string

  @IsOptional()
  @IsString()
  comentarios?: string

  @IsEnum(CategoriaTicket)
  categoria: CategoriaTicket

  @IsEnum(PrioridadTicket)
  prioridad: PrioridadTicket

  @IsNumber()
  dependencia_id: number

  @IsNumber()
  sede_id: number
}
```

### **UpdateTicketDto**
```typescript
// src/ticket/dto/update-ticket.dto.ts
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator'
import { EstadoTicket } from '../entities/ticket.entity'

export class UpdateTicketDto {
  @IsOptional()
  @IsEnum(EstadoTicket)
  estado?: EstadoTicket

  @IsOptional()
  @IsNumber()
  tecnico_id?: number

  @IsOptional()
  @IsString()
  comentario_interno?: string
}
```

### **FilterTicketDto**
```typescript
// src/ticket/dto/filter-ticket.dto.ts
import { IsOptional, IsEnum, IsNumber } from 'class-validator'
import { EstadoTicket, CategoriaTicket, PrioridadTicket } from '../entities/ticket.entity'

export class FilterTicketDto {
  @IsOptional()
  @IsNumber()
  limit?: number

  @IsOptional()
  @IsNumber()
  offset?: number

  @IsOptional()
  @IsNumber()
  page?: number

  @IsOptional()
  @IsEnum(EstadoTicket)
  estado?: EstadoTicket

  @IsOptional()
  @IsEnum(CategoriaTicket)
  categoria?: CategoriaTicket

  @IsOptional()
  @IsEnum(PrioridadTicket)
  prioridad?: PrioridadTicket
}
```

### **UpdateLocationDto**
```typescript
// src/usuario/dto/update-location.dto.ts
import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateLocationDto {
  @ApiProperty({ 
    description: 'ID de la sede',
    example: 1,
    type: Number
  })
  @IsNumber()
  sede_id: number

  @ApiProperty({ 
    description: 'ID de la dependencia',
    example: 1,
    type: Number
  })
  @IsNumber()
  dependencia_id: number
}
```

### **Endpoint UpdateLocation actualizado**
```typescript
// src/usuario/usuario.controller.ts
@Patch('update-location')
@ApiOperation({ summary: 'Actualizar sede y dependencia del usuario autenticado' })
@ApiResponse({ 
  status: 200, 
  description: 'Ubicación actualizada exitosamente',
  schema: {
    type: 'object',
    properties: {
      message: { type: 'string', example: 'Ubicación actualizada exitosamente' },
      success: { type: 'boolean', example: true },
      user: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          sede_id: { type: 'number', example: 1 },
          dependencia_id: { type: 'number', example: 1 }
        }
      }
    }
  }
})
@ApiResponse({ status: 400, description: 'Datos inválidos o no se proporcionaron campos para actualizar' })
@ApiResponse({ status: 404, description: 'Usuario no encontrado' })
updateLocation(
  @Body() dto: UpdateLocationDto,
  @GetUser() user: Usuario,
) {
  console.log('📍 CONTROLLER - updateLocation llamado')
  console.log('📍 CONTROLLER - User:', {
    id: user.id,
    nombres: user.nombres,
    correo: user.correo
  })
  console.log('📍 CONTROLLER - DTO recibido:', {
    sede_id: dto.sede_id,
    dependencia_id: dto.dependencia_id
  })
  
  return this.usuarioService.updateLocation(user.id, dto)
}
```

### **Servicio UpdateLocation actualizado**
```typescript
// src/usuario/usuario.service.ts
async updateLocation(userId: number, dto: UpdateLocationDto) {
  console.log('🔧 SERVICE - updateLocation:', {
    userId,
    sede_id: dto.sede_id,
    dependencia_id: dto.dependencia_id
  })

  // Verificar que la sede existe
  const sede = await this.sedeService.findOne(dto.sede_id)
  if (!sede) {
    throw new NotFoundException('Sede no encontrada')
  }

  // Verificar que la dependencia existe y pertenece a la sede
  const dependencia = await this.dependenciaService.findOne(dto.dependencia_id)
  if (!dependencia) {
    throw new NotFoundException('Dependencia no encontrada')
  }

  if (dependencia.sede_id !== dto.sede_id) {
    throw new BadRequestException('La dependencia no pertenece a la sede seleccionada')
  }

  // Actualizar el usuario
  const updatedUser = await this.usuarioRepository.update(userId, {
    sede_id: dto.sede_id,
    dependencia_id: dto.dependencia_id
  })

  if (!updatedUser.affected) {
    throw new NotFoundException('Usuario no encontrado')
  }

  // Obtener el usuario actualizado
  const user = await this.usuarioRepository.findOne({
    where: { id: userId },
    relations: ['sede', 'dependencia']
  })

  console.log('✅ SERVICE - Usuario actualizado:', {
    id: user.id,
    sede_id: user.sede_id,
    dependencia_id: user.dependencia_id
  })

  return {
    message: 'Ubicación actualizada exitosamente',
    success: true,
    user: {
      id: user.id,
      sede_id: user.sede_id,
      dependencia_id: user.dependencia_id
    }
  }
}
```

## 🌐 Endpoints (Routes)

### **API Routes**
```typescript
// src/app.module.ts - Rutas automáticas de NestJS

// Autenticación
POST /auth/login
POST /auth/logout
GET /auth/perfil

// Tickets (protegidas)
GET /tickets
POST /tickets
GET /tickets/:id
PATCH /tickets/:id
DELETE /tickets/:id
GET /tickets/sin-asignar
GET /tickets/mis-tickets

// Comentarios
POST /tickets/:id/comentarios
GET /tickets/:id/comentarios

// Dependencias y Sedes
GET /dependencias
GET /sedes

// Usuarios (técnicos)
GET /usuarios?rol=ingeniero_soporte
```

## 📊 Migraciones (TypeORM)

### **Configuración TypeORM**
```typescript
// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres', // o mysql, sqlite, etc.
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // false en producción
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
}
```

## 🔧 Configuración Adicional

### **Roles de Usuario**
```typescript
// src/usuario/roles.enum.ts
export enum RolUsuario {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  JEFE_SOPORTE = 'jefe_soporte',
  INGENIERO_SOPORTE = 'ingeniero_soporte',
  USUARIO = 'usuario',
}
```

### **Seeders para datos iniciales**
```typescript
// src/database/seeds/dependencia.seed.ts
import { DataSource } from 'typeorm'
import { Dependencia } from '../../dependencia/entities/dependencia.entity'

export class DependenciaSeed {
  constructor(private dataSource: DataSource) {}

  async run() {
    const dependenciaRepository = this.dataSource.getRepository(Dependencia)

    const dependencias = [
      'Administración',
      'Contabilidad', 
      'Recursos Humanos',
      'Tecnología de la Información',
      'Marketing',
      'Ventas',
      'Atención al Cliente',
      'Logística',
      'Finanzas',
      'Legal',
      'Operaciones',
      'Desarrollo',
      'Soporte Técnico',
      'Calidad',
      'Investigación y Desarrollo'
    ]

    for (const nombre of dependencias) {
      const dependencia = dependenciaRepository.create({ nombre })
      await dependenciaRepository.save(dependencia)
    }
  }
}
```

## 📝 Ejemplos de Uso

### **Crear un ticket**
```javascript
// Frontend
const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        titulo: "Monitor no enciende",
        descripcion: "El monitor no muestra imagen",
        comentarios: "Problema desde ayer",
        categoria: "hardware",
        prioridad: "alta",
        dependencia_id: 1,
        sede_id: 1
    })
});
```

### **Obtener tickets sin asignar**
```javascript
const response = await fetch('/api/tickets/sin-asignar', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## 🚀 Próximos Pasos

1. **Implementar autenticación JWT**
2. **Crear los seeders para datos iniciales**
3. **Implementar notificaciones por email**
4. **Agregar validaciones más robustas**
5. **Implementar filtros avanzados**
6. **Agregar reportes y estadísticas**

---

**Nota:** Este README proporciona la estructura completa para implementar el sistema de tickets con NestJS y TypeORM. Ajusta según tus necesidades específicas.

# WebSocket Integration - SIGETIC Frontend

## 📋 Descripción

Este documento describe la implementación de WebSocket en el frontend de SIGETIC para recibir notificaciones en tiempo real sobre tickets, cambios de estado y eventos del sistema.

## 🏗️ Arquitectura

```
Frontend (React/Next.js) ←→ WebSocket Gateway ←→ Realtime Service ←→ Base de Datos
```

### Componentes principales:

1. **useWebSocket** - Hook principal para manejar la conexión WebSocket
2. **useWebSocketNotifications** - Hook para manejar notificaciones con toast
3. **WebSocketStatus** - Componente visual del estado de conexión
4. **WebSocketExample** - Componente de ejemplo para desarrollo

## 🚀 Instalación

El WebSocket ya está configurado en el proyecto. Las dependencias necesarias son:

```bash
npm install socket.io-client
```

## ⚙️ Configuración

### Variables de entorno

Crea o actualiza tu archivo `.env.local`:

```env
# URL del servidor WebSocket
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3001/realtime

# Para producción
# NEXT_PUBLIC_WEBSOCKET_URL=https://tu-api.com/realtime
```

### Configuración del servidor

El WebSocket se conecta automáticamente cuando el usuario está autenticado. La configuración se encuentra en:

- `src/lib/websocket-config.ts` - Configuración centralizada
- `src/hooks/use-websocket.ts` - Hook principal

## 📱 Uso

### 1. Uso básico en componentes

```tsx
import { useWebSocket } from '@/hooks/use-websocket'

export function MiComponente() {
  const { isConnected, socket, emit } = useWebSocket()

  // Emitir un evento
  const enviarEvento = () => {
    emit('mi.evento', { mensaje: 'Hola desde el frontend' })
  }

  return (
    <div>
      <p>Estado: {isConnected ? 'Conectado' : 'Desconectado'}</p>
      <button onClick={enviarEvento}>Enviar evento</button>
    </div>
  )
}
```

### 2. Escuchar eventos específicos

```tsx
import { useEffect } from 'react'
import { useWebSocket } from '@/hooks/use-websocket'

export function EscucharEventos() {
  const { isConnected } = useWebSocket()

  useEffect(() => {
    if (!isConnected) return

    const handleTicketCreated = (event: CustomEvent) => {
      console.log('Nuevo ticket:', event.detail)
      // Actualizar estado, mostrar notificación, etc.
    }

    window.addEventListener('ticket:created', handleTicketCreated as EventListener)

    return () => {
      window.removeEventListener('ticket:created', handleTicketCreated as EventListener)
    }
  }, [isConnected])

  return <div>Escuchando eventos...</div>
}
```

### 3. Notificaciones automáticas

Las notificaciones se manejan automáticamente en el layout del dashboard:

```tsx
// src/app/dashboard/layout.tsx
import { useWebSocketNotifications } from '@/hooks/use-websocket-notifications'
import { useTicketsAutoRefresh } from '@/hooks/use-tickets-auto-refresh'

export default function DashboardLayout({ children }) {
  // Inicializar notificaciones automáticamente
  useWebSocketNotifications()
  
  // Inicializar actualización automática de tickets
  useTicketsAutoRefresh()
  
  return <div>{children}</div>
}
```

### 4. Actualización automática de tickets

Cuando llega un evento de WebSocket, automáticamente se actualizan las listas de tickets:

- **Nuevo ticket creado en mi sede** → Actualiza `getTicketsSinAsignarMiSede`
- **Ticket asignado a mí** → Actualiza `getMisTicketsAsignados`
- **Mi ticket creado** → Actualiza `getMisTickets`
- **Cambio de estado de ticket** → Actualiza todas las listas

```tsx
// En cualquier componente que use tickets
import { useTicketsAutoRefresh } from '@/hooks/use-tickets-auto-refresh'

export function MiComponente() {
  const { refreshTicketsMiSede, refreshMisTickets } = useTicketsAutoRefresh()
  
  // Las listas se actualizan automáticamente cuando llegan eventos
  // También puedes actualizar manualmente si es necesario
  const actualizarManual = () => {
    refreshTicketsMiSede()
  }
  
  return <div>Mi componente con tickets</div>
}
```

## 🎯 Eventos disponibles

### Eventos de tickets

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `ticket.created` | Nuevo ticket creado | `TicketEvent` |
| `ticket.assigned` | Ticket asignado a técnico | `TicketAssignmentEvent` |
| `ticket.status_changed` | Cambio de estado de ticket | `TicketStatusChangeEvent` |
| `tickets:unassigned` | Lista de tickets sin asignar | `TicketEvent[]` |

### Eventos por sala

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `sede:event` | Eventos de la sede del usuario | `unknown` |
| `tecnico:event` | Eventos específicos del técnico | `unknown` |
| `user:event` | Eventos personales del usuario | `unknown` |

### Interfaces TypeScript

```typescript
interface TicketEvent {
  id: number
  titulo: string
  descripcion: string
  estado: string
  prioridad: string
  sede_id: number
  dependencia_id: number
  tecnico_id?: number
  usuario_id: number
  created_at: string
  updated_at: string
}

interface TicketAssignmentEvent {
  ticket_id: number
  tecnico_id: number
  tecnico_nombre: string
  timestamp: string
}

interface TicketStatusChangeEvent {
  ticket_id: number
  estado_anterior: string
  estado_nuevo: string
  tecnico_id?: number
  timestamp: string
}
```

## 🔧 Configuración avanzada

### Actualización automática de tickets

El sistema automáticamente actualiza las listas de tickets cuando llegan eventos de WebSocket:

#### Eventos que disparan actualizaciones:

1. **`ticket.created`** - Nuevo ticket creado
   - Si es de mi sede → Actualiza `getTicketsSinAsignarMiSede`
   - Si es mi ticket → Actualiza `getMisTickets`

2. **`ticket.assigned`** - Ticket asignado
   - Si me asignan a mí → Actualiza `getMisTicketsAsignados`
   - Siempre → Actualiza `getTicketsSinAsignarMiSede` (el ticket ya no está sin asignar)

3. **`ticket.status_changed`** - Cambio de estado
   - Actualiza todas las listas de tickets

#### Uso en componentes:

```tsx
// En componentes que muestran tickets
import { useTicketsAutoRefresh } from '@/hooks/use-tickets-auto-refresh'

export function TicketsView() {
  const { refreshTicketsMiSede } = useTicketsAutoRefresh()
  
  // La lista se actualiza automáticamente
  // También puedes actualizar manualmente
  const actualizarManual = () => {
    refreshTicketsMiSede()
  }
  
  return <div>Lista de tickets</div>
}
```

### Personalizar notificaciones

Puedes personalizar las notificaciones modificando `src/hooks/use-websocket-notifications.ts`:

```tsx
// Ejemplo: Agregar sonido personalizado
const playCustomSound = () => {
  const audio = new Audio('/sounds/notification.mp3')
  audio.play()
}

// Ejemplo: Mostrar notificación personalizada
const handleCustomEvent = (event: CustomEvent) => {
  toast.custom((t) => (
    <div className="bg-blue-500 text-white p-4 rounded">
      <h3>Evento personalizado</h3>
      <p>{JSON.stringify(event.detail)}</p>
    </div>
  ))
}
```

### Configurar reconexión

Modifica la configuración en `src/lib/websocket-config.ts`:

```typescript
export const WEBSOCKET_CONFIG = {
  RECONNECTION: {
    enabled: true,
    attempts: 10,        // Más intentos
    delay: 500,          // Menor delay
    maxDelay: 10000,     // Mayor delay máximo
  },
  // ... otras configuraciones
}
```

## 🧪 Testing

### Componente de ejemplo

Usa el componente `WebSocketExample` para probar la funcionalidad:

```tsx
import { WebSocketExample } from '@/components/websocket-example'

export function TestPage() {
  return (
    <div className="p-6">
      <h1>Test WebSocket</h1>
      <WebSocketExample />
    </div>
  )
}
```

### Debug en consola

Los eventos se loguean automáticamente en la consola del navegador:

```
✅ Conectado al WebSocket
🎫 Nuevo ticket creado: {id: 1, titulo: "Problema de red", ...}
👨‍💼 Ticket asignado: {ticket_id: 1, tecnico_id: 5, ...}
🔄 Estado de ticket cambiado: {ticket_id: 1, estado_anterior: "pendiente", ...}
```

## 🚨 Troubleshooting

### Problemas comunes

1. **No se conecta al WebSocket**
   - Verifica que el servidor esté corriendo en el puerto correcto
   - Revisa la URL en `NEXT_PUBLIC_WEBSOCKET_URL`
   - Verifica que el token de autenticación sea válido

2. **No recibe eventos**
   - Verifica que el usuario esté autenticado
   - Revisa la consola del navegador para errores
   - Verifica que el servidor esté emitiendo eventos

3. **Errores de CORS**
   - Asegúrate de que el servidor permita conexiones desde tu dominio
   - Verifica la configuración de `withCredentials`

### Debug avanzado

```typescript
// Habilitar logs detallados
const socket = io(url, {
  debug: true,
  logger: console
})

// Verificar estado de conexión
console.log('Socket ID:', socket.id)
console.log('Connected:', socket.connected)
console.log('Transport:', socket.io.engine.transport.name)
```

## 📚 Recursos adicionales

- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [Next.js WebSocket Integration](https://nextjs.org/docs/api-routes/api-routes)
- [React Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)

## 🤝 Contribución

Para agregar nuevos eventos o funcionalidades:

1. Actualiza las interfaces en `src/hooks/use-websocket.ts`
2. Agrega los event listeners correspondientes
3. Actualiza las notificaciones en `src/hooks/use-websocket-notifications.ts`
4. Documenta los cambios en este README

## 📄 Licencia

Este código es parte del proyecto SIGETIC y sigue las mismas políticas de licencia. 
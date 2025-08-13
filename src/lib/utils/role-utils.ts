// Función helper para obtener el nombre del rol
export const getRolNombre = (rol: string | undefined): string => {
  if (!rol) return ''
  return rol
}

// Función helper para obtener el nombre del cargo
export const getCargoNombre = (cargo: string | { id: number; nombre: string; activo: boolean } | undefined): string => {
  if (!cargo) return ''
  return typeof cargo === 'object' && cargo !== null ? cargo.nombre : cargo
}

// Función helper para verificar si un rol está en un array de roles permitidos
export const hasRole = (userRol: string | undefined, allowedRoles: string[]): boolean => {
  if (!userRol || !allowedRoles || allowedRoles.length === 0) return false
  return allowedRoles.includes(userRol)
} 
"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sede, Dependencia } from "@/types/ticket"
import { Search, MapPin, Building2, Check, X } from "lucide-react"
import { useGetSedesQuery } from "@/store/api/sedeApi"
import { useGetDependenciasBySedeQuery } from "@/store/api/dependenciaApi"
import { useUpdateLocationMutation } from "@/store/api/usuarioApi"
import { useAuth } from "@/hooks/use-auth"


export default function UpdateLocationCard() {
  const { user, checkAuth } = useAuth()
  const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationMutation()

  // Estados para sede
  const [sedeSearchTerm, setSedeSearchTerm] = useState("")
  const [sedeIsOpen, setSedeIsOpen] = useState(false)
  const [sedeFilteredSedes, setSedeFilteredSedes] = useState<Sede[]>([])
  const [selectedSedeId, setSelectedSedeId] = useState(0)
  const sedeDropdownRef = useRef<HTMLDivElement>(null)

  // Estados para dependencia
  const [depSearchTerm, setDepSearchTerm] = useState("")
  const [depIsOpen, setDepIsOpen] = useState(false)
  const [depFilteredDependencias, setDepFilteredDependencias] = useState<Dependencia[]>([])
  const [selectedDependenciaId, setSelectedDependenciaId] = useState(0)
  const depDropdownRef = useRef<HTMLDivElement>(null)

  // Estado para controlar si ya se inicializó
  const [isInitialized, setIsInitialized] = useState(false)

  // Queries
  const { data: sedesData } = useGetSedesQuery()
  
  // Query para dependencias por sede - solo se ejecuta cuando hay una sede seleccionada
  const { data: dependenciasData } = useGetDependenciasBySedeQuery(
    selectedSedeId > 0 ? selectedSedeId : 0,
    { skip: selectedSedeId <= 0 }
  )

  // Obtener las dependencias en el formato correcto
  const dependenciasArray = useMemo(() => {
    return Array.isArray(dependenciasData) ? dependenciasData : (dependenciasData?.data || [])
  }, [dependenciasData])

  // Filtrar sedes basado en el término de búsqueda
  useEffect(() => {
    
    if (sedesData?.data) {
      // Si el término de búsqueda está vacío, mostrar todas las sedes
      if (!sedeSearchTerm.trim()) {
        setSedeFilteredSedes(sedesData.data)
        return
      }

      const filtered = sedesData.data.filter(sede => {
        const searchTerm = sedeSearchTerm.toLowerCase()
        const sedeNombre = sede.nombre.toLowerCase()
        const sedeDireccion = sede.direccion || "Sin direccion"
        const sedeCompleto = `${sede.nombre} - ${sede.direccion}`
        
        return sedeNombre.includes(searchTerm) ||
               sedeDireccion.includes(searchTerm) ||
               sedeCompleto.includes(searchTerm)
      })
      
      setSedeFilteredSedes(filtered)
    }
  }, [sedeSearchTerm, sedesData, sedeFilteredSedes.length])

  // Filtrar dependencias basado en el término de búsqueda
  useEffect(() => {
    if (dependenciasArray) {
      // Si el término de búsqueda está vacío, mostrar todas las dependencias
      if (!depSearchTerm.trim()) {
        setDepFilteredDependencias(dependenciasArray)
        return
      }

      const filtered = dependenciasArray.filter(dep => {
        const searchTerm = depSearchTerm.toLowerCase()
        const depNombre = dep.nombre.toLowerCase()
        const depDescripcion = dep.descripcion?.toLowerCase() || ""
        
        return depNombre.includes(searchTerm) ||
               depDescripcion.includes(searchTerm)
      })
      
      setDepFilteredDependencias(filtered)
    }
  }, [depSearchTerm, dependenciasArray, depFilteredDependencias.length, selectedSedeId])

  // FLUJO PRINCIPAL: Inicializar con datos del usuario (solo una vez)
  useEffect(() => {
    // Solo inicializar una vez si tenemos datos del usuario y sedes cargadas
    if (user && sedesData?.data && selectedSedeId === 0 && !isInitialized) {
      const userSede = user.sede
      if (userSede) {
        setSelectedSedeId(userSede.id)
        // Establecer el término de búsqueda para mostrar la sede seleccionada
        setSedeSearchTerm(`${userSede.nombre} - ${userSede.direccion}`)
        setIsInitialized(true)
      }
    }
  }, [user, sedesData, selectedSedeId, selectedDependenciaId, isInitialized])

  // FLUJO SECUNDARIO: Inicializar dependencia cuando se carga la sede (solo una vez)
  useEffect(() => {
    // Solo inicializar dependencia una vez si tenemos sede seleccionada, dependencias cargadas y no hay dependencia seleccionada
    if (selectedSedeId > 0 && dependenciasArray.length > 0 && selectedDependenciaId === 0 && user?.dependencia && isInitialized) {
      const userDependencia = user.dependencia
      
      // Verificar si la dependencia del usuario está en las dependencias de la sede actual
      const userDepInSede = dependenciasArray.find(dep => dep.id === userDependencia.id)
      
      if (userDepInSede) {
        setSelectedDependenciaId(userDependencia.id)
        // Establecer el término de búsqueda para mostrar la dependencia seleccionada
        setDepSearchTerm(userDependencia.nombre)
      }
    }
  }, [selectedSedeId, dependenciasArray, selectedDependenciaId, user, isInitialized])

  // Inicializar dependencias filtradas cuando se cargan las dependencias
  useEffect(() => {
    if (dependenciasArray.length > 0) {
      setDepFilteredDependencias(dependenciasArray)
    }
  }, [dependenciasArray])

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sedeDropdownRef.current && !sedeDropdownRef.current.contains(event.target as Node)) {
        setSedeIsOpen(false)
      }
      if (depDropdownRef.current && !depDropdownRef.current.contains(event.target as Node)) {
        setDepIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handlers para sede
  const handleSedeSelect = (sede: Sede) => {
    setSedeSearchTerm(`${sede.nombre} - ${sede.direccion}`)
    setSedeIsOpen(false)
    setSelectedSedeId(sede.id)
    
    // Limpiar dependencia cuando cambia la sede
    setSelectedDependenciaId(0)
    setDepSearchTerm("")
  }

  const handleSedeClear = () => {
    setSedeSearchTerm("")
    setSelectedSedeId(0)
    setSedeIsOpen(false)
    
    // Limpiar dependencia cuando se limpia la sede
    setSelectedDependenciaId(0)
    setDepSearchTerm("")
  }

  // Handlers para dependencia
  const handleDepSelect = (dependencia: Dependencia) => {
    setDepSearchTerm(dependencia.nombre)
    setDepIsOpen(false)
    setSelectedDependenciaId(dependencia.id)
  }

  const handleDepClear = () => {
    setDepSearchTerm("")
    setSelectedDependenciaId(0)
    setDepIsOpen(false)
  }

  // Handler para actualizar ubicación
  const handleUpdateLocation = async () => {
    // Prevenir múltiples clicks
    if (isUpdatingLocation) return
    
    // Validaciones
    if (!selectedSedeId || !selectedDependenciaId) {
      toast.error("Debes seleccionar una sede y dependencia")
      return
    }

    try {
      // Actualizar ubicación con IDs
      await updateLocation({
        sede_id: selectedSedeId,
        dependencia_id: selectedDependenciaId
      }).unwrap()
      
      // Refrescar los datos del usuario para obtener la información actualizada
      await checkAuth()
      
    } catch (error) {
      // El error ya se maneja automáticamente en la mutación
      console.error("❌ Error al actualizar ubicación:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Sede y Dependencia</CardTitle>
        <CardDescription>Actualiza tu ubicación y departamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Campo Sede */}
          <div className="space-y-2">
            <Label htmlFor="sede" className="text-sm font-medium text-gray-700">
              Sede / Ubicación
            </Label>
            
            <div className="relative" ref={sedeDropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={sedeSearchTerm}
                  onChange={(e) => {
                    setSedeSearchTerm(e.target.value)
                    setSedeIsOpen(true)
                  }}
                  onFocus={() => {
                    setSedeIsOpen(true)
                    // Mostrar todas las sedes cuando se hace focus
                    setSedeFilteredSedes(sedesData?.data || [])
                  }}
                  placeholder="Buscar sede..."
                  className="pl-10 pr-10"
                />
                {sedeSearchTerm && (
                  <button
                    onClick={handleSedeClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {sedeIsOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {sedeFilteredSedes.length > 0 ? (
                    <>
                      {sedeFilteredSedes.map((sede) => (
                        <div
                          key={sede.id}
                          onClick={() => handleSedeSelect(sede)}
                          className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />
                          <div>
                            <div className="font-medium">{sede.nombre}</div>
                            <div className="text-sm text-gray-500">{sede.direccion}</div>
                          </div>
                          {selectedSedeId === sede.id && (
                            <Check className="h-4 w-4 ml-auto text-blue-600" />
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No se encontraron sedes
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Campo Dependencia */}
          <div className="space-y-2">
            <Label htmlFor="dependencia" className="text-sm font-medium text-gray-700">
              Dependencia / Departamento
            </Label>
            
            {!selectedSedeId || selectedSedeId === 0 ? (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-500">
                  Primero selecciona una sede para ver las dependencias disponibles
                </p>
              </div>
            ) : (
              <div className="relative" ref={depDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={depSearchTerm}
                    onChange={(e) => {
                      setDepSearchTerm(e.target.value)
                      setDepIsOpen(true)
                    }}
                    onFocus={() => {
                      setDepIsOpen(true)
                      // Mostrar todas las dependencias cuando se hace focus
                      setDepFilteredDependencias(dependenciasArray || [])
                    }}
                    placeholder="Buscar dependencia..."
                    className="pl-10 pr-10"
                  />
                  {depSearchTerm && (
                    <button
                      onClick={handleDepClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {depIsOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {depFilteredDependencias.length > 0 ? (
                      <>
                        {depFilteredDependencias.map((dependencia) => (
                          <div
                            key={dependencia.id}
                            onClick={() => handleDepSelect(dependencia)}
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <Building2 className="h-4 w-4 mr-3 flex-shrink-0 text-gray-400" />
                            <div>
                              <div className="font-medium">{dependencia.nombre}</div>
                              {dependencia.descripcion && (
                                <div className="text-sm text-gray-500">{dependencia.descripcion}</div>
                              )}
                            </div>
                            {selectedDependenciaId === dependencia.id && (
                              <Check className="h-4 w-4 ml-auto text-blue-600" />
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        No se encontraron dependencias para esta sede
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <Button
          className="w-full"
          disabled={isUpdatingLocation}
          onClick={handleUpdateLocation}
        >
          {isUpdatingLocation ? "Actualizando ubicación..." : "Actualizar Ubicación"}
        </Button>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Selección automática editable</p>
              <p className="text-xs">
                Tu sede y dependencia se preseleccionan automáticamente según tu perfil. Puedes hacer clic en los campos para buscar y cambiar las selecciones. Usa el botón X para limpiar la selección.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sede, Dependencia } from "@/types/ticket"
import { Search, MapPin, Building2, Check, X } from "lucide-react"
import { useGetSedesQuery } from "@/store/api/sedeApi"
import { useGetDependenciasBySedeQuery } from "@/store/api/dependenciaApi"
import { useAuth } from "@/hooks/use-auth"

interface StepSedeDependenciaProps {
  sede_id: number
  dependencia_id: number
  onSedeChange: (sede_id: number) => void
  onDependenciaChange: (dependencia_id: number) => void
}

export function StepSedeDependencia({ 
  sede_id, 
  dependencia_id,
  onSedeChange, 
  onDependenciaChange 
}: StepSedeDependenciaProps) {
  const { user } = useAuth()
  
  // Estados para sede
  const [sedeSearchTerm, setSedeSearchTerm] = useState("")
  const [sedeIsOpen, setSedeIsOpen] = useState(false)
  const [sedeFilteredSedes, setSedeFilteredSedes] = useState<Sede[]>([])
  const sedeDropdownRef = useRef<HTMLDivElement>(null)

  // Estados para dependencia
  const [depSearchTerm, setDepSearchTerm] = useState("")
  const [depIsOpen, setDepIsOpen] = useState(false)
  const [depFilteredDependencias, setDepFilteredDependencias] = useState<Dependencia[]>([])
  const depDropdownRef = useRef<HTMLDivElement>(null)

  // Estado para controlar si ya se inicializó
  const [isInitialized, setIsInitialized] = useState(false)

  // Queries
  const { data: sedesData } = useGetSedesQuery()
  
  // Query para dependencias por sede - solo se ejecuta cuando hay una sede seleccionada
  const { data: dependenciasData } = useGetDependenciasBySedeQuery(
    sede_id > 0 ? sede_id : 0,
    { skip: sede_id <= 0 }
  )

  // Debug logs
  console.log("🔍 DEBUG SEDES:", {
    sedesData,
    sede_id,
    sedeSearchTerm,
    sedeFilteredSedes: sedeFilteredSedes.length
  })

  console.log("🔍 DEBUG DEPENDENCIAS:", {
    dependenciasData,
    dependencia_id,
    depSearchTerm,
    depFilteredDependencias: depFilteredDependencias.length,
    sedeSeleccionada: sede_id
  })

  console.log("🔍 DEBUG USER:", {
    user: user ? {
      id: user.id,
      sede: user.sede,
      dependencia: user.dependencia
    } : null
  })

  // Obtener las dependencias en el formato correcto
  const dependenciasArray = Array.isArray(dependenciasData) ? dependenciasData : (dependenciasData?.data || [])

  // Filtrar sedes basado en el término de búsqueda
  useEffect(() => {
    console.log("🔄 useEffect - Filtrar sedes:", {
      sedesData: sedesData?.data?.length,
      sedeSearchTerm,
      filtradas: sedeFilteredSedes.length
    })
    
    if (sedesData?.data) {
      // Si el término de búsqueda está vacío, mostrar todas las sedes
      if (!sedeSearchTerm.trim()) {
        setSedeFilteredSedes(sedesData.data)
        console.log("✅ Mostrando todas las sedes:", sedesData.data.length)
        return
      }

      const filtered = sedesData.data.filter(sede => {
        const searchTerm = sedeSearchTerm.toLowerCase()
        const sedeNombre = sede.nombre.toLowerCase()
        const sedeDireccion = sede.direccion.toLowerCase()
        const sedeCompleto = `${sede.nombre} - ${sede.direccion}`.toLowerCase()
        
        return sedeNombre.includes(searchTerm) ||
               sedeDireccion.includes(searchTerm) ||
               sedeCompleto.includes(searchTerm)
      })
      
      setSedeFilteredSedes(filtered)
      console.log("✅ Sedes filtradas:", filtered.length, "de", sedesData.data.length)
    }
  }, [sedeSearchTerm, sedesData])

  // Filtrar dependencias basado en el término de búsqueda
  useEffect(() => {
    console.log("🔄 useEffect - Filtrar dependencias:", {
      dependenciasData: dependenciasArray.length,
      depSearchTerm,
      filtradas: depFilteredDependencias.length,
      sede_id
    })
    
    if (dependenciasArray) {
      // Si el término de búsqueda está vacío, mostrar todas las dependencias
      if (!depSearchTerm.trim()) {
        setDepFilteredDependencias(dependenciasArray)
        console.log("✅ Mostrando todas las dependencias:", dependenciasArray.length)
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
      console.log("✅ Dependencias filtradas:", filtered.length, "de", dependenciasArray.length)
    }
  }, [depSearchTerm, dependenciasArray])

  // FLUJO PRINCIPAL: Inicializar con datos del usuario (solo una vez)
  useEffect(() => {
    console.log("🚀 FLUJO PRINCIPAL - Inicializar con datos del usuario:", {
      user: user ? { id: user.id, sede: user.sede, dependencia: user.dependencia } : null,
      sedesData: sedesData?.data?.length,
      sede_id,
      dependencia_id,
      isInitialized
    })

    // Solo inicializar una vez si tenemos datos del usuario y sedes cargadas
    if (user && sedesData?.data && sede_id === 0 && !isInitialized) {
      const userSede = user.sede
      if (userSede) {
        console.log("✅ Inicializando sede del usuario:", userSede)
        onSedeChange(userSede.id)
        // Establecer el término de búsqueda para mostrar la sede seleccionada
        setSedeSearchTerm(`${userSede.nombre} - ${userSede.direccion}`)
        setIsInitialized(true)
      }
    }
  }, [user, sedesData, sede_id, isInitialized, onSedeChange])

  // FLUJO SECUNDARIO: Inicializar dependencia cuando se carga la sede (solo una vez)
  useEffect(() => {
    console.log("🔄 FLUJO SECUNDARIO - Inicializar dependencia:", {
      sede_id,
      dependenciasData: dependenciasArray.length,
      dependencia_id,
      userDependencia: user?.dependencia,
      isInitialized
    })

    // Solo inicializar dependencia una vez si tenemos sede seleccionada, dependencias cargadas y no hay dependencia seleccionada
    if (sede_id > 0 && dependenciasArray.length > 0 && dependencia_id === 0 && user?.dependencia && isInitialized) {
      const userDependencia = user.dependencia
      
      // Verificar si la dependencia del usuario está en las dependencias de la sede actual
      const userDepInSede = dependenciasArray.find(dep => dep.id === userDependencia.id)
      
      console.log("🔍 Verificando dependencia del usuario en sede:", {
        userDependencia,
        userDepInSede,
        dependenciasDisponibles: dependenciasArray.map(d => ({ id: d.id, nombre: d.nombre }))
      })
      
      if (userDepInSede) {
        console.log("✅ Inicializando dependencia del usuario:", userDepInSede)
        onDependenciaChange(userDependencia.id)
        // Establecer el término de búsqueda para mostrar la dependencia seleccionada
        setDepSearchTerm(userDependencia.nombre)
      }
    }
  }, [sede_id, dependenciasArray, dependencia_id, user, isInitialized, onDependenciaChange])

  // Inicializar dependencias filtradas cuando se cargan las dependencias
  useEffect(() => {
    console.log("🔄 useEffect - Inicializar dependencias filtradas:", {
      dependenciasArray: dependenciasArray.length,
      sede_id
    })
    
    if (dependenciasArray.length > 0) {
      setDepFilteredDependencias(dependenciasArray)
      console.log("✅ Inicializando dependencias filtradas:", dependenciasArray.length)
    }
  }, [dependenciasArray])

  // Actualizar términos de búsqueda cuando cambian las selecciones
  useEffect(() => {
    console.log("🔄 useEffect - Actualizar término de búsqueda sede:", {
      sedesData: sedesData?.data?.length,
      sede_id,
      sedeSearchTerm
    })
    
    if (sedesData?.data && sede_id > 0) {
      const selectedSede = sedesData.data.find(sede => sede.id === sede_id)
      if (selectedSede && sedeSearchTerm === "") {
        console.log("✅ Actualizando término de búsqueda sede:", selectedSede)
        setSedeSearchTerm(`${selectedSede.nombre} - ${selectedSede.direccion}`)
      }
    }
  }, [sedesData, sede_id, sedeSearchTerm])

  useEffect(() => {
    console.log("🔄 useEffect - Actualizar término de búsqueda dependencia:", {
      dependenciasData: dependenciasArray.length,
      dependencia_id,
      depSearchTerm
    })
    
    if (dependenciasArray && dependencia_id > 0) {
      const selectedDependencia = dependenciasArray.find(dep => dep.id === dependencia_id)
      if (selectedDependencia && depSearchTerm === "") {
        console.log("✅ Actualizando término de búsqueda dependencia:", selectedDependencia)
        setDepSearchTerm(selectedDependencia.nombre)
      }
    }
  }, [dependenciasArray, dependencia_id, depSearchTerm])

  // Handlers para sede
  const handleSedeSelect = (sede: Sede) => {
    console.log("🎯 Sede seleccionada:", sede)
    setSedeSearchTerm(`${sede.nombre} - ${sede.direccion}`)
    setSedeIsOpen(false)
    onSedeChange(sede.id)
    
    // Limpiar dependencia cuando cambia la sede
    console.log("🧹 Limpiando dependencia al cambiar sede")
    onDependenciaChange(0)
    setDepSearchTerm("")
  }

  const handleSedeClear = () => {
    console.log("🧹 Limpiando sede")
    setSedeSearchTerm("")
    onSedeChange(0)
    setSedeIsOpen(false)
    
    // Limpiar dependencia cuando se limpia la sede
    onDependenciaChange(0)
    setDepSearchTerm("")
  }

  // Handlers para dependencia
  const handleDepSelect = (dependencia: Dependencia) => {
    console.log("🎯 Dependencia seleccionada:", dependencia)
    setDepSearchTerm(dependencia.nombre)
    setDepIsOpen(false)
    onDependenciaChange(dependencia.id)
  }

  const handleDepClear = () => {
    console.log("🧹 Limpiando dependencia")
    setDepSearchTerm("")
    onDependenciaChange(0)
    setDepIsOpen(false)
  }

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ubicación y Departamento
        </h3>
        <p className="text-gray-600 text-sm">
          Selecciona tu sede y dependencia. Los valores se preseleccionan automáticamente según tu perfil, pero puedes cambiarlos.
        </p>
      </div>

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
                        {sede_id === sede.id && (
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
          
          {!sede_id || sede_id === 0 ? (
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
                          {dependencia_id === dependencia.id && (
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
    </div>
  )
}

import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sede, Dependencia } from "@/types/ticket"
import { Search, MapPin, Building2, Check, Plus } from "lucide-react"
import { useGetSedesQuery } from "@/store/api/sedeApi"
import { useGetDependenciasQuery } from "@/store/api/dependenciaApi"

interface StepSedeDependenciaProps {
  sede_id: number
  sede_personalizada?: string
  dependencia_id: number
  dependencia_personalizada?: string
  onSedeChange: (sede_id: number, sede_personalizada?: string) => void
  onDependenciaChange: (dependencia_id: number, dependencia_personalizada?: string) => void
}

export function StepSedeDependencia({ 
  sede_id, 
  sede_personalizada, 
  dependencia_id, 
  dependencia_personalizada,
  onSedeChange, 
  onDependenciaChange 
}: StepSedeDependenciaProps) {
  // Estados para sede
  const [sedeSearchTerm, setSedeSearchTerm] = useState("")
  const [sedeIsOpen, setSedeIsOpen] = useState(false)
  const [sedeFilteredSedes, setSedeFilteredSedes] = useState<Sede[]>([])
  const [sedeCustomSede, setSedeCustomSede] = useState<string>(sede_personalizada || "")
  const [sedeIsCustomMode, setSedeIsCustomMode] = useState(sede_id === -1)
  const sedeInputRef = useRef<HTMLInputElement>(null)
  const sedeDropdownRef = useRef<HTMLDivElement>(null)

  // Estados para dependencia
  const [depSearchTerm, setDepSearchTerm] = useState("")
  const [depIsOpen, setDepIsOpen] = useState(false)
  const [depFilteredDependencias, setDepFilteredDependencias] = useState<Dependencia[]>([])
  const [depCustomDependencia, setDepCustomDependencia] = useState<string>(dependencia_personalizada || "")
  const [depIsCustomMode, setDepIsCustomMode] = useState(dependencia_id === -1)
  const depInputRef = useRef<HTMLInputElement>(null)
  const depDropdownRef = useRef<HTMLDivElement>(null)

  // Queries
  const { data: sedesData } = useGetSedesQuery({ limit: 50, activo: true, search: sedeSearchTerm })
  const { data: dependenciasData } = useGetDependenciasQuery({ limit: 50, activo: true, search: depSearchTerm })

  // Filtrar sedes basado en el término de búsqueda
  useEffect(() => {
    if (sedesData?.data) {
      const filtered = sedesData.data.filter(sede =>
        sede.nombre.toLowerCase().includes(sedeSearchTerm.toLowerCase()) ||
        sede.direccion.toLowerCase().includes(sedeSearchTerm.toLowerCase())
      )
      setSedeFilteredSedes(filtered)
    }
  }, [sedeSearchTerm, sedesData])

  // Filtrar dependencias basado en el término de búsqueda
  useEffect(() => {
    if (dependenciasData?.data) {
      const filtered = dependenciasData.data.filter(dep =>
        dep.nombre.toLowerCase().includes(depSearchTerm.toLowerCase()) ||
        (dep.descripcion && dep.descripcion.toLowerCase().includes(depSearchTerm.toLowerCase()))
      )
      setDepFilteredDependencias(filtered)
    }
  }, [depSearchTerm, dependenciasData])

  // Handlers para sede
  const handleSedeSelect = (sede: Sede) => {
    setSedeSearchTerm(`${sede.nombre} - ${sede.direccion}`)
    setSedeIsOpen(false)
    setSedeIsCustomMode(false)
    setSedeCustomSede("")
    onSedeChange(sede.id)
  }

  const handleSedeCustomSelect = () => {
    setSedeIsCustomMode(true)
    setSedeIsOpen(false)
    setSedeSearchTerm("")
    onSedeChange(-1, sedeSearchTerm)
  }

  const handleSedeCustomChange = (value: string) => {
    setSedeCustomSede(value)
    onSedeChange(-1, value)
  }

  const resetSedeToSearch = () => {
    setSedeIsCustomMode(false)
    setSedeCustomSede("")
    setSedeSearchTerm("")
    onSedeChange(0, "")
  }

  // Handlers para dependencia
  const handleDepSelect = (dependencia: Dependencia) => {
    setDepSearchTerm(dependencia.nombre)
    setDepIsOpen(false)
    setDepIsCustomMode(false)
    setDepCustomDependencia("")
    onDependenciaChange(dependencia.id)
  }

  const handleDepCustomSelect = () => {
    setDepIsCustomMode(true)
    setDepIsOpen(false)
    setDepSearchTerm("")
    onDependenciaChange(-1, depSearchTerm)
  }

  const handleDepCustomChange = (value: string) => {
    setDepCustomDependencia(value)
    onDependenciaChange(-1, value)
  }

  const resetDepToSearch = () => {
    setDepIsCustomMode(false)
    setDepCustomDependencia("")
    setDepSearchTerm("")
    onDependenciaChange(0, "")
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
          Selecciona tu sede y dependencia, o escribe una ubicación personalizada si no encuentras la tuya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo Sede */}
        <div className="space-y-2">
          <Label htmlFor="sede" className="text-sm font-medium text-gray-700">
            Sede / Ubicación
          </Label>
          
          {sedeIsCustomMode ? (
            <div className="space-y-2">
              <Input
                ref={sedeInputRef}
                value={sedeCustomSede}
                onChange={(e) => handleSedeCustomChange(e.target.value)}
                placeholder="Escribe tu ubicación personalizada"
                className="w-full"
              />
              <button
                onClick={resetSedeToSearch}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Volver a buscar en la lista
              </button>
            </div>
          ) : (
            <div className="relative" ref={sedeDropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={sedeSearchTerm}
                  onChange={(e) => {
                    setSedeSearchTerm(e.target.value)
                    setSedeIsOpen(true)
                  }}
                  onFocus={() => setSedeIsOpen(true)}
                  placeholder="Buscar sede..."
                  className="pl-10"
                />
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

                  {/* Opción para usar texto libre - solo cuando no hay resultados */}
                  {sedeSearchTerm.trim() !== "" && sedeFilteredSedes.length === 0 && (
                    <div className="border-t border-gray-100">
                      <div
                        onClick={handleSedeCustomSelect}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-3 flex-shrink-0" />
                                                 <div className="font-medium">
                           Usar &quot;{sedeSearchTerm}&quot; como ubicación personalizada
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Campo Dependencia */}
        <div className="space-y-2">
          <Label htmlFor="dependencia" className="text-sm font-medium text-gray-700">
            Dependencia / Departamento
          </Label>
          
          {depIsCustomMode ? (
            <div className="space-y-2">
              <Input
                ref={depInputRef}
                value={depCustomDependencia}
                onChange={(e) => handleDepCustomChange(e.target.value)}
                placeholder="Escribe tu dependencia personalizada"
                className="w-full"
              />
              <button
                onClick={resetDepToSearch}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                ← Volver a buscar en la lista
              </button>
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
                  onFocus={() => setDepIsOpen(true)}
                  placeholder="Buscar dependencia..."
                  className="pl-10"
                />
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
                      No se encontraron dependencias
                    </div>
                  )}

                  {/* Opción para usar texto libre - solo cuando no hay resultados */}
                  {depSearchTerm.trim() !== "" && depFilteredDependencias.length === 0 && (
                    <div className="border-t border-gray-100">
                      <div
                        onClick={handleDepCustomSelect}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-blue-600"
                      >
                        <Plus className="h-4 w-4 mr-3 flex-shrink-0" />
                                                 <div className="font-medium">
                           Usar &quot;{depSearchTerm}&quot; como dependencia personalizada
                         </div>
                      </div>
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
            <p className="font-medium mb-1">¿No encuentras tu sede o dependencia?</p>
            <p className="text-xs">
              Puedes escribir una ubicación o dependencia personalizada si no está en la lista. Esto nos ayudará a atenderte mejor.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

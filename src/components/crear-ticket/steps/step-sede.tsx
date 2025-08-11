import { useState, useRef, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Sede } from "@/types/ticket"
import { Search, MapPin, Check, Plus } from "lucide-react"

interface StepSedeProps {
  sede_id: number
  sede_personalizada?: string
  onSedeChange: (sede_id: number, sede_personalizada?: string) => void
  sedes: Sede[]
}

export function StepSede({ sede_id, sede_personalizada, onSedeChange, sedes }: StepSedeProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSedes, setFilteredSedes] = useState<Sede[]>([])
  const [customSede, setCustomSede] = useState<string>(sede_personalizada || "")
  const [isCustomMode, setIsCustomMode] = useState(sede_id === -1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedSede = sedes.find(sede => sede.id === sede_id)

  // Filtrar sedes basado en el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSedes(sedes)
    } else {
      const filtered = sedes.filter(sede =>
        sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.direccion.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredSedes(filtered)
    }
  }, [searchTerm, sedes])

  // Cerrar dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Establecer el valor inicial del input cuando se selecciona una sede
  useEffect(() => {
    if (selectedSede) {
      setSearchTerm(`${selectedSede.nombre} - ${selectedSede.direccion}`)
      setIsCustomMode(false)
      setCustomSede("")
    }
  }, [selectedSede])

  const handleSedeSelect = (sede: Sede) => {
    onSedeChange(sede.id)
    setSearchTerm(`${sede.nombre} - ${sede.direccion}`)
    setIsOpen(false)
    setIsCustomMode(false)
    setCustomSede("")
  }

  const handleCustomSedeSelect = () => {
    setIsCustomMode(true)
    setIsOpen(false)
    setSearchTerm("")
    // Usar un ID negativo para indicar que es una sede personalizada
    onSedeChange(-1, searchTerm)
  }

  const handleCustomSedeChange = (value: string) => {
    setCustomSede(value)
    onSedeChange(-1, value)
  }

  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    setIsOpen(true)
    setIsCustomMode(false)
    setCustomSede("")
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const resetToSearch = () => {
    setIsCustomMode(false)
    setCustomSede("")
    setSearchTerm("")
    onSedeChange(0, "")
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Tu sede es...
        </h3>
        <p className="text-gray-600 text-sm">
          Busca y selecciona la sede o ubicación donde te encuentras, o escribe una ubicación personalizada.
        </p>
      </div>

      <div className="space-y-4">
        {!isCustomMode ? (
          <div className="relative">
            <Label htmlFor="sede-search">Buscar sede</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={inputRef}
                id="sede-search"
                type="text"
                placeholder="Busca por nombre o dirección..."
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                className="pl-10 pr-4"
              />
            </div>

            {/* Dropdown de sugerencias */}
            {isOpen && (
              <div
                ref={dropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                {filteredSedes.length > 0 && (
                  <>
                    {filteredSedes.map((sede) => (
                      <div
                        key={sede.id}
                        onClick={() => handleSedeSelect(sede)}
                        className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          sede_id === sede.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                      >
                        <MapPin className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {sede.nombre}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {sede.direccion}
                          </div>
                        </div>
                        {sede_id === sede.id && (
                          <Check className="h-4 w-4 text-blue-500 ml-2 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </>
                )}

                                {/* Opción para usar texto libre - solo cuando no hay resultados */}
                {searchTerm.trim() !== "" && filteredSedes.length === 0 && (
                  <div className="border-t border-gray-100">
                    <div
                      onClick={handleCustomSedeSelect}
                      className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors text-blue-600"
                    >
                      <Plus className="h-4 w-4 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          Usar &quot;{searchTerm}&quot; como ubicación personalizada
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mensaje cuando no hay resultados */}
                {searchTerm.trim() !== "" && filteredSedes.length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No se encontraron sedes que coincidan con &quot;{searchTerm}&quot;
                    <div className="mt-2">
                      <button
                        onClick={handleCustomSedeSelect}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        ¿Usar como ubicación personalizada?
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="custom-sede">Ubicación personalizada</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="custom-sede"
                  type="text"
                  placeholder="Escribe tu ubicación personalizada..."
                  value={customSede}
                  onChange={(e) => handleCustomSedeChange(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            <button
              onClick={resetToSearch}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              ← Volver a buscar en la lista de sedes
            </button>
          </div>
        )}

        {/* Mostrar sede seleccionada o personalizada */}
        {(selectedSede || (isCustomMode && customSede)) && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-green-800">
                  <span className="font-semibold">
                    {isCustomMode ? "Ubicación personalizada:" : "Sede seleccionada:"}
                  </span>
                </p>
                <p className="text-sm text-green-700">
                  {isCustomMode ? customSede : `${selectedSede?.nombre} - ${selectedSede?.direccion}`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

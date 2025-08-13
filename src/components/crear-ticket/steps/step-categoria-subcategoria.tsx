import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PrioridadTicket } from "@/types/ticket"
import { useGetCategoriasActiveQuery } from "@/store/api/categoriaApi"
import { useGetSubcategoriasByCategoriaQuery } from "@/store/api/subcategoriaApi"

interface StepCategoriaSubcategoriaProps {
  categoria: number | 0
  onCategoriaChange: (value: number) => void
  subcategoria_id: number | 0
  onSubcategoriaChange: (value: number) => void
  prioridad: PrioridadTicket | ""
  onPrioridadChange: (value: PrioridadTicket) => void
  descripcion: string
  onDescripcionChange: (value: string) => void
}

export function StepCategoriaSubcategoria({
  categoria,
  onCategoriaChange,
  subcategoria_id,
  onSubcategoriaChange,
  // prioridad,
  // onPrioridadChange,
  descripcion,
  onDescripcionChange
}: StepCategoriaSubcategoriaProps) {
  // Obtener categorías activas desde la API
  const { data: categoriasData, isLoading: isLoadingCategorias, error: errorCategorias } = useGetCategoriasActiveQuery()

  // Obtener subcategorías por categoría específica
  const { data: subcategoriasData, isLoading: isLoadingSubcategorias, error: errorSubcategorias } = useGetSubcategoriasByCategoriaQuery(
    categoria,
    { skip: !categoria || categoria === 0 }
  )

  // Usar solo datos de la API
  const categorias = categoriasData || []
  const subcategorias = subcategoriasData || []

  console.log('🔍 Categorías:', categorias)
  console.log('🔍 Subcategorías:', subcategorias)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ¿Qué tipo de ayuda necesitas?
        </h3>
        <p className="text-gray-600 text-sm">
          Selecciona la categoría, subcategoría y prioridad de tu problema.
        </p>
      </div>

      <div className="space-y-6">
        {/* Categoría */}
        <div>
          <Label className="text-sm font-medium">Tipo de soporte</Label>

          {isLoadingCategorias && (
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-200 h-4 w-4"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          )}

          {errorCategorias ? (
            <div className="mt-2 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">Error al cargar las categorías</p>
            </div>
          ) : null}

          {!isLoadingCategorias && !errorCategorias && (
            <RadioGroup
              value={categoria > 0 ? categoria.toString() : ""}
              onValueChange={(value) => {
                onCategoriaChange(parseInt(value))
                // Resetear subcategoría cuando cambia la categoría
                onSubcategoriaChange(0)
              }}
              className="mt-2"
            >
              <div className="grid grid-cols-1 gap-4">
                {categorias.map((cat) => (
                  <Card
                    key={cat.id}
                    className={`cursor-pointer transition-all ${categoria === cat.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem value={cat.id.toString()} id={`categoria-${cat.id}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`categoria-${cat.id}`} className="text-base font-medium cursor-pointer">
                            {cat.nombre}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Soporte técnico especializado para {cat.nombre.toLowerCase()}
                          </p>
                          <div className="mt-3 flex items-center space-x-2">
                            <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs text-gray-500">
                              Categoría de soporte
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>

        {/* Subcategoría - Solo mostrar si hay categoría seleccionada */}
        {categoria > 0 && (
          <div>
            <Label className="text-sm font-medium">Tipo de problema específico</Label>

            {isLoadingSubcategorias && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded bg-gray-200 h-10 w-full"></div>
                </div>
              </div>
            )}

            {errorSubcategorias ? (
              <div className="mt-2 p-4 bg-red-50 rounded-lg">
                <p className="text-red-600 text-sm">Error al cargar las subcategorías</p>
              </div>
            ) : null}

            {!isLoadingSubcategorias && !errorSubcategorias && (
              <Select
                value={subcategoria_id > 0 ? subcategoria_id.toString() : ""}
                onValueChange={(value) => onSubcategoriaChange(parseInt(value))}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Selecciona el tipo de problema" />
                </SelectTrigger>
                <SelectContent>
                  {subcategorias.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id.toString()}>
                      {subcat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}



        {/* Prioridad oculta - Siempre será "baja" por defecto */}

        {/* Descripción - Solo mostrar si hay subcategoría seleccionada */}
        {subcategoria_id > 0 && (
          <div>
            <Label htmlFor="descripcion">Descripción detallada</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => onDescripcionChange(e.target.value)}
              placeholder="Describe el problema con el mayor detalle posible..."
              className="mt-2 min-h-[120px]"
            />
          </div>
        )}

        {/* Feedback */}
        {(categoria > 0 || subcategoria_id > 0 || descripcion) && (
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-purple-800">
                {categoria > 0 && (
                  <p className="mb-1">
                    <span className="font-semibold">Categoría:</span> {
                      categorias.find(cat => cat.id === categoria)?.nombre || 'No seleccionada'
                    }
                  </p>
                )}
                {subcategoria_id > 0 && (
                  <p className="mb-1">
                    <span className="font-semibold">Subcategoría:</span> {
                      subcategorias.find(subcat => subcat.id === subcategoria_id)?.nombre || 'No seleccionada'
                    }
                  </p>
                )}

                {descripcion && (
                  <p>
                    <span className="font-semibold">Descripción:</span> {descripcion.length > 100 ? `${descripcion.substring(0, 100)}...` : descripcion}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TicketData } from "../crear-ticket-wizard"
import { Dependencia, Sede } from "@/types/ticket"
import { useGetCategoriasActiveQuery } from "@/store/api/categoriaApi"
import { useGetSubcategoriasByCategoriaQuery } from "@/store/api/subcategoriaApi"

interface StepResumenProps {
  ticketData: TicketData
  dependencias: Dependencia[]
  sedes: Sede[]
}

export function StepResumen({ ticketData, dependencias, sedes }: StepResumenProps) {
  const selectedDependencia = dependencias.find(dep => dep.id === ticketData.dependencia_id)
  const selectedSede = sedes.find(sede => sede.id === ticketData.sede_id)
  
  // Obtener datos de categorías y subcategorías desde la API
  const { data: categoriasData } = useGetCategoriasActiveQuery()
  const { data: subcategoriasData } = useGetSubcategoriasByCategoriaQuery(
    ticketData.categoria, 
    { skip: !ticketData.categoria || ticketData.categoria === 0 }
  )
  
  const categorias = categoriasData || []
  const subcategorias = subcategoriasData || []
  
  const selectedCategoria = categorias.find(cat => cat.id === ticketData.categoria)
  const selectedSubcategoria = subcategorias.find(subcat => subcat.id === ticketData.subcategoria_id)



  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Resumen de tu solicitud
        </h3>
        <p className="text-gray-600 text-sm">
          Revisa la información antes de enviar tu solicitud de soporte.
        </p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Información del ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Sede</label>
                <p className="text-sm text-gray-900 mt-1">
                  {ticketData.sede_id === -1 && ticketData.sede_personalizada 
                    ? ticketData.sede_personalizada 
                    : selectedSede 
                      ? `${selectedSede.nombre} - ${selectedSede.direccion}` 
                      : 'No seleccionada'
                  }
                </p>
              </div>
              <div>
              <label className="text-sm font-medium text-gray-500">Dependencia</label>
                <p className="text-sm text-gray-900 mt-1">
                  {ticketData.dependencia_id === -1 && ticketData.dependencia_personalizada 
                    ? ticketData.dependencia_personalizada 
                    : selectedDependencia?.nombre || 'No seleccionada'
                  }
                </p>
              </div>
            </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-medium text-gray-500">Categoría</label>
                 <div className="mt-1">
                   <Badge variant="default">
                     {selectedCategoria?.nombre || `ID: ${ticketData.categoria}`}
                   </Badge>
                 </div>
               </div>
             </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Subcategoría</label>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedSubcategoria?.nombre || `ID: ${ticketData.subcategoria_id}` || 'No seleccionada'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Descripción</label>
                <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">
                  {ticketData.descripcion || 'No especificada'}
                </p>
              </div>
            </div>


          </CardContent>
        </Card>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">¿Todo se ve correcto?</p>
              <p className="text-xs">
                Una vez que envíes esta solicitud, se creará un ticket y un técnico se pondrá en contacto contigo a la brevedad.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm text-green-800">
              <p className="font-medium">Ticket listo para enviar</p>
              <p className="text-xs">Todos los campos requeridos han sido completados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

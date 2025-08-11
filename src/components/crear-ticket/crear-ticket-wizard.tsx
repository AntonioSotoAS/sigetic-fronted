"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"
import { StepSedeDependencia } from "./steps/step-sede-dependencia"
import { StepCategoriaSubcategoria } from "./steps/step-categoria-subcategoria"
import { StepResumen } from "./steps/step-resumen"
import { CreateTicketDto, PrioridadTicket } from "@/types/ticket"
import { useCreateTicketMutation } from "@/store/api/ticketApi"
import { useGetDependenciasQuery } from "@/store/api/dependenciaApi"
import { useGetSedesQuery } from "@/store/api/sedeApi"
import { useGetCategoriasActiveQuery } from "@/store/api/categoriaApi"
import { useGetSubcategoriasByCategoriaQuery } from "@/store/api/subcategoriaApi"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

const steps = [
  { id: 1, title: "Ubicación y Departamento", description: "Selecciona tu sede y dependencia" },
  { id: 2, title: "Categoría y Subcategoría", description: "Selecciona el tipo de problema" },
  { id: 3, title: "Resumen", description: "Revisa y envía" },
]

export interface TicketData {
  dependencia_id: number
  dependencia_personalizada?: string
  sede_id: number
  sede_personalizada?: string
  categoria: number | 0
  prioridad: PrioridadTicket | ""
  subcategoria_id: number | 0
  descripcion: string
}

export function CrearTicketWizard() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [ticketData, setTicketData] = useState<TicketData>({
    dependencia_id: 0,
    dependencia_personalizada: "",
    sede_id: 0,
    sede_personalizada: "",
    categoria: 0,
    prioridad: "",
    subcategoria_id: 0,
    descripcion: "",
  })

  // Queries para obtener datos
  const { data: dependenciasData } = useGetDependenciasQuery()
  const { data: sedesData } = useGetSedesQuery({ limit: 50, activo: true, search: "" })
  const { data: categoriasData } = useGetCategoriasActiveQuery()
  const { data: subcategoriasData } = useGetSubcategoriasByCategoriaQuery(
    ticketData.categoria, 
    { skip: !ticketData.categoria || ticketData.categoria === 0 }
  )
  const [createTicket, { isLoading }] = useCreateTicketMutation()

  // Generar nombre completo del usuario
  const userName = user ? `${user.nombres || ''} ${user.apellidos_paterno || ''} ${user.apellidos_materno || ''}`.trim() : "Usuario"

  const updateTicketData = (field: keyof TicketData, value: string | number) => {
    setTicketData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Establecer prioridad "baja" por defecto cuando se selecciona una subcategoría
      if (field === "subcategoria_id" && value) {
        newData.prioridad = PrioridadTicket.BAJA
      }
      
      return newData
    })
  }

  const updateSedeData = (sede_id: number, sede_personalizada?: string) => {
    setTicketData(prev => ({ 
      ...prev, 
      sede_id, 
      sede_personalizada: sede_personalizada || "" 
    }))
  }

  const updateDependenciaData = (dependencia_id: number, dependencia_personalizada?: string) => {
    setTicketData(prev => ({ 
      ...prev, 
      dependencia_id, 
      dependencia_personalizada: dependencia_personalizada || "" 
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (ticketData.sede_id > 0 || (ticketData.sede_id === -1 && ticketData.sede_personalizada && ticketData.sede_personalizada.trim() !== "")) &&
               (ticketData.dependencia_id > 0 || (ticketData.dependencia_id === -1 && ticketData.dependencia_personalizada && ticketData.dependencia_personalizada.trim() !== ""))
      case 2:
        return ticketData.categoria > 0 && ticketData.subcategoria_id > 0 && ticketData.descripcion !== ""
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    try {
      // Obtener datos de categorías y subcategorías desde RTK Query
      const categorias = categoriasData || []
      const subcategorias = subcategoriasData || []
      
             const selectedCategoria = categorias.find((cat) => cat.id === ticketData.categoria)
       const selectedSubcategoria = subcategorias.find((subcat) => subcat.id === ticketData.subcategoria_id)

       const ticketDto: CreateTicketDto = {
         user_id: user?.id || 0,
         titulo: `Ticket - ${selectedCategoria?.nombre || 'Problema'} - ${selectedSubcategoria?.nombre || 'General'}`,
         descripcion: ticketData.descripcion,
         categoria_id: ticketData.categoria,
         subcategoria_id: ticketData.subcategoria_id,
         prioridad: ticketData.prioridad as PrioridadTicket,
         dependencia_id: ticketData.dependencia_id,
         sede_id: ticketData.sede_id,
       }



      await createTicket(ticketDto).unwrap()
      toast.success("Ticket creado exitosamente")
      router.push("/dashboard/tickets/mis-tickets")
    } catch (error) {
      console.error("Error al crear ticket:", error)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepSedeDependencia
            sede_id={ticketData.sede_id}
            sede_personalizada={ticketData.sede_personalizada}
            dependencia_id={ticketData.dependencia_id}
            dependencia_personalizada={ticketData.dependencia_personalizada}
            onSedeChange={updateSedeData}
            onDependenciaChange={updateDependenciaData}
          />
        )
      case 2:
        return (
          <StepCategoriaSubcategoria
            categoria={ticketData.categoria}
            onCategoriaChange={(value) => updateTicketData("categoria", value)}
            subcategoria_id={ticketData.subcategoria_id}
            onSubcategoriaChange={(value) => updateTicketData("subcategoria_id", value)}
            prioridad={ticketData.prioridad}
            onPrioridadChange={(value: PrioridadTicket) => updateTicketData("prioridad", value)}
            descripcion={ticketData.descripcion}
            onDescripcionChange={(value) => updateTicketData("descripcion", value)}
          />
        )
      case 3:
        return <StepResumen ticketData={ticketData} dependencias={dependenciasData?.data || []} sedes={sedesData?.data || []} />
      default:
        return null
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
      {/* Panel izquierdo con instrucciones */}
      <div className="xl:col-span-1 order-2 xl:order-1">
        <Card className="h-fit">
          <CardContent className="p-4 lg:p-6">
            <div className="text-center mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">
                Saludos, {userName}
              </h2>
              <h3 className="text-xl lg:text-2xl font-bold text-red-600 mb-4">
                ¡Indícanos tu problema!
              </h3>
              <p className="text-gray-600 text-sm">
                Rellena este formulario paso a paso y un técnico te atenderá muy pronto.
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Completa los campos del formulario.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Crearemos un ticket con tu solicitud.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Un técnico se pondrá en contacto contigo a la brevedad.</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">Si tu sede/departamento no corresponde, puedes modificarlo.</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel derecho con el wizard */}
      <div className="xl:col-span-2 order-1 xl:order-2">
        <Card>
          <CardContent className="p-4 lg:p-6">
            {/* Indicador de pasos */}
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center justify-between overflow-x-auto pb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-shrink-0">
                    <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-medium ${
                      currentStep >= step.id 
                        ? "bg-red-500 text-white" 
                        : "bg-gray-200 text-gray-500"
                    }`}>
                      {step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-6 lg:w-12 h-1 mx-1 lg:mx-2 ${
                        currentStep > step.id ? "bg-red-500" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900">
                  {steps[currentStep - 1].title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {steps[currentStep - 1].description}
                </p>
              </div>
            </div>

            {/* Contenido del paso actual */}
            <div className="min-h-[300px] lg:min-h-[400px]">
              {renderStep()}
            </div>

            {/* Botones de navegación */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 lg:pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="w-full sm:w-auto"
              >
                Anterior
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando..." : "Enviar solicitud de soporte"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { CrearTicketWizard } from "@/components/crear-ticket/crear-ticket-wizard"

export default function CrearTicketPage() {
  return (
    <div className="container mx-auto py-4 lg:py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            ¡Indícanos tu problema!
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Rellena este formulario paso a paso y un técnico te atenderá muy pronto.
          </p>
        </div>
        <CrearTicketWizard />
      </div>
    </div>
  )
}

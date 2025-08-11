import { MisTicketsView } from "@/components/tickets/mis-tickets-view"

export default function MisTicketsPage() {
  return (
    <div className="container mx-auto py-4 lg:py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Mis Tickets
          </h1>
          <p className="text-gray-600 text-sm lg:text-base">
            Aquí puedes ver todos los tickets que has creado para solicitar soporte técnico.
          </p>
        </div>
        <MisTicketsView />
      </div>
    </div>
  )
}

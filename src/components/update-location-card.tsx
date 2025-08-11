"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUpdateLocationMutation } from "@/store/api/usuarioApi"

export default function UpdateLocationCard() {
  const [updateLocation, { isLoading: isUpdatingLocation }] = useUpdateLocationMutation()

  // Estados para sede y dependencia
  const [sedeData, setSedeData] = useState({
    sede: "",
    dependencia: ""
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Sede y Dependencia</CardTitle>
        <CardDescription>Actualiza tu ubicación y departamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sede">Sede</Label>
          <Select value={sedeData.sede} onValueChange={(value) => setSedeData(prev => ({ ...prev, sede: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu sede" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sede1">Sede Principal</SelectItem>
              <SelectItem value="sede2">Sede Norte</SelectItem>
              <SelectItem value="sede3">Sede Sur</SelectItem>
              <SelectItem value="otra">Otra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="dependencia">Dependencia</Label>
          <Select value={sedeData.dependencia} onValueChange={(value) => setSedeData(prev => ({ ...prev, dependencia: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu dependencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dep1">Sistemas</SelectItem>
              <SelectItem value="dep2">Recursos Humanos</SelectItem>
              <SelectItem value="dep3">Contabilidad</SelectItem>
              <SelectItem value="dep4">Administración</SelectItem>
              <SelectItem value="otra">Otra</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="w-full"
          disabled={isUpdatingLocation}
          onClick={async () => {
            // Prevenir múltiples clicks
            if (isUpdatingLocation) return
            
            // Validaciones
            if (!sedeData.sede || !sedeData.dependencia) {
              toast.error("Debes seleccionar una sede y dependencia")
              return
            }

            try {
              // Actualizar ubicación
              await updateLocation({
                sede: sedeData.sede,
                dependencia: sedeData.dependencia
              }).unwrap()

              // Mostrar toast de éxito
              toast.success("Ubicación actualizada exitosamente")
              
              // Limpiar formulario
              setSedeData({
                sede: "",
                dependencia: ""
              })
            } catch (error) {
              // El error ya se maneja automáticamente en la mutación
              console.error("Error al actualizar ubicación:", error)
            }
          }}
        >
          {isUpdatingLocation ? "Actualizando ubicación..." : "Actualizar Ubicación"}
        </Button>
      </CardContent>
    </Card>
  )
} 
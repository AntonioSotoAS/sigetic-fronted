"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { UpdatePasswordCard } from "./update-password-card"

interface PasswordResetModalProps {
  isOpen: boolean
  onSuccess: () => void
}

// Componente DialogContent personalizado sin botón de cerrar
const DialogContentNoClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {/* DialogTitle oculto para accesibilidad */}
      <DialogPrimitive.Title className="sr-only">
        Cambio de Contraseña Obligatorio
      </DialogPrimitive.Title>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DialogContentNoClose.displayName = DialogPrimitive.Content.displayName

export function PasswordResetModal({ isOpen, onSuccess }: PasswordResetModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={() => {}}>
      <DialogContentNoClose className="sm:max-w-md">
        <UpdatePasswordCard isModal={true} onSuccess={onSuccess} />
      </DialogContentNoClose>
    </DialogPrimitive.Root>
  )
} 
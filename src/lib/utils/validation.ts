import { ZodError } from "zod"

export function formatZodErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  
  try {
    // Acceder a los errores de forma segura
    const errorData = error as unknown as { errors: Array<{ path: string[]; message: string }> }
    
    if (errorData.errors && Array.isArray(errorData.errors)) {
      errorData.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          const fieldName = err.path[0]
          fieldErrors[fieldName] = err.message
        }
      })
    }
  } catch (e) {
    console.error("Error processing ZodError:", e)
  }
  
  return fieldErrors
} 
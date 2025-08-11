import * as yup from "yup"

export const updatePasswordSchema = yup.object({
  password_actual: yup.string().optional(),
  password_nuevo: yup.string().optional(),
  confirmPassword: yup.string().optional()
}).test('validate-password-fields', 'Validación de contraseñas', function(value) {
  const { password_actual, password_nuevo, confirmPassword } = value
  
  // Si todos los campos están vacíos, no hay errores
  if (!password_actual && !password_nuevo && !confirmPassword) {
    return true
  }
  
  // Si al menos uno tiene contenido, validar todos
  const errors: yup.ValidationError[] = []
  
  if (!password_actual) {
    errors.push(this.createError({ path: 'password_actual', message: 'La contraseña actual es requerida' }))
  }
  
  if (!password_nuevo) {
    errors.push(this.createError({ path: 'password_nuevo', message: 'La nueva contraseña es requerida' }))
  } else if (password_nuevo.length < 6) {
    errors.push(this.createError({ path: 'password_nuevo', message: 'La nueva contraseña debe tener al menos 6 caracteres' }))
  } else if (password_nuevo.length > 50) {
    errors.push(this.createError({ path: 'password_nuevo', message: 'La nueva contraseña no puede exceder 50 caracteres' }))
  }
  
  if (!confirmPassword) {
    errors.push(this.createError({ path: 'confirmPassword', message: 'Debes confirmar la nueva contraseña' }))
  } else if (password_nuevo && confirmPassword !== password_nuevo) {
    errors.push(this.createError({ path: 'confirmPassword', message: 'Las contraseñas nuevas no coinciden' }))
  }
  
  if (password_actual && password_nuevo && password_actual === password_nuevo) {
    errors.push(this.createError({ path: 'password_nuevo', message: 'La nueva contraseña debe ser diferente a la actual' }))
  }
  
  if (errors.length > 0) {
    throw new yup.ValidationError(errors)
  }
  
  return true
})

export type UpdatePasswordFormData = yup.InferType<typeof updatePasswordSchema> 
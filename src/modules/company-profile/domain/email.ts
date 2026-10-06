export class InvalidEmailError extends Error {
  constructor(value: string) {
    super(
      `El correo no es válido: "${value}". Debe tener usuario, @ y dominio, y estar en minúsculas.`,
    )
    this.name = 'InvalidEmailError'
  }
}

// ponytail: formato básico (usuario@dominio.tld); no verifica que el buzón exista.
const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// El correo se publica en minúsculas: no distingue mayúsculas y así no se duplica con otra escritura.
export function validateEmail(value: string): string {
  if (!EMAIL_FORMAT.test(value) || value !== value.toLowerCase()) {
    throw new InvalidEmailError(value)
  }
  return value
}

export interface CompanyProfile {
  readonly name: string
  readonly teamSize: number
  readonly audiences: readonly string[]
  readonly valueProposition: string
}

export interface CompanyProfileInput {
  readonly name: string
  readonly teamSize: number
  readonly audiences: readonly string[]
  readonly valueProposition: string
}

export class InvalidCompanyProfileError extends Error {
  constructor() {
    super('El perfil de la empresa no es válido')
    this.name = 'InvalidCompanyProfileError'
  }
}

export function createCompanyProfile(
  input: CompanyProfileInput,
): CompanyProfile {
  const name = input.name.trim()
  const valueProposition = input.valueProposition.trim()
  const audiences = input.audiences.map((audience) => audience.trim())

  if (
    name.length === 0 ||
    !Number.isInteger(input.teamSize) ||
    input.teamSize <= 0 ||
    audiences.length === 0 ||
    audiences.some((audience) => audience.length === 0) ||
    valueProposition.length === 0
  ) {
    throw new InvalidCompanyProfileError()
  }

  return Object.freeze({
    name,
    teamSize: input.teamSize,
    audiences: Object.freeze(audiences),
    valueProposition,
  })
}

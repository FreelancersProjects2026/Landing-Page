import { describe, expect, it } from 'vitest'

import { InvalidEmailError, validateEmail } from './email.ts'

describe('validateEmail', () => {
  it('acepta un correo válido en minúsculas', () => {
    expect(validateEmail('solutionspjm@gmail.com')).toBe(
      'solutionspjm@gmail.com',
    )
  })

  it.each([
    ['con mayúsculas', 'Solutionspjm@gmail.com'],
    ['sin @', 'solutionspjm.gmail.com'],
    ['sin dominio', 'solutionspjm@'],
    ['sin punto en el dominio', 'solutionspjm@gmail'],
    ['con espacios', 'solutions pjm@gmail.com'],
    ['vacío', ''],
  ])('rechaza un correo %s', (_, value) => {
    expect(() => validateEmail(value)).toThrow(InvalidEmailError)
  })
})

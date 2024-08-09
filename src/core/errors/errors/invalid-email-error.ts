import type { UseCaseError } from '../use-case-error'

export class InvalidEmailError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super(`Invalid e-mail ${identifier}`)
    this.name = 'InvalidEmailError'
  }
}

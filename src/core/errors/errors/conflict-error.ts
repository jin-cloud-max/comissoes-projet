import type { UseCaseError } from '../use-case-error'

export class ConflictError extends Error implements UseCaseError {
  constructor(identifier?: string) {
    super(`Resource already exists ${identifier}`)
    this.name = 'ConflictError'
  }
}

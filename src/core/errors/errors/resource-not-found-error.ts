import type { UseCaseError } from '../use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(resource?: string) {
    super(`Resource not found. ${resource}`)
    this.name = 'ResourceNotFoundError'
  }
}

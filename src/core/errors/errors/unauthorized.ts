import type { UseCaseError } from '../use-case-error'

export class UnauthorizedResource extends Error implements UseCaseError {
  constructor(resource?: string) {
    super(`Unauthorized resource access. ${resource}`)
    this.name = 'UnauthorizedResource'
  }
}

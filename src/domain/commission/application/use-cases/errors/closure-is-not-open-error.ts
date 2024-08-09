import type { UseCaseError } from '@/core/errors/use-case-error'

export class ClosureIsNotOpenError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Closure "${identifier}" already closed`)
  }
}

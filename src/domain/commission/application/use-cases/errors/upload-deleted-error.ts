import type { UseCaseError } from '@/core/errors/use-case-error'

export class UploadDeletedError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Uploaded "${identifier}" was deleted`)
  }
}

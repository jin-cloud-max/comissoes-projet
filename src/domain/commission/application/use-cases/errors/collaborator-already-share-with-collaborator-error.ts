import type { UseCaseError } from '@/core/errors/use-case-error'

export class CollaboratorAlreadyShareWithCollaboratorError
  extends Error
  implements UseCaseError {
  constructor() {
    super(`Collaborator already share with collaborator`)
  }
}

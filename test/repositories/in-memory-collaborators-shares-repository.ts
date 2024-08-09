import type { CollaboratorSharesRepository } from '@/domain/commission/application/repositories/collaborator-shares-repository'
import type { CollaboratorShare } from '@/domain/commission/enterprise/entities/collaborator-share'

export class InMemoryCollaboratorsSharesRepository
  implements CollaboratorSharesRepository {
  public items: CollaboratorShare[] = []

  async create(collaboratorShare: CollaboratorShare): Promise<void> {
    this.items.push(collaboratorShare)
  }

  async findCollaboratorShareWithCollaboratorId({
    collaboratorId,
    shareWithCollaboratorId,
  }: {
    collaboratorId: string
    shareWithCollaboratorId: string
  }): Promise<CollaboratorShare | null> {
    return (
      this.items.find(
        (item) =>
          item.collaboratorId.toString() === collaboratorId &&
          item.shareWithCollaboratorId.toString() === shareWithCollaboratorId,
      ) ?? null
    )
  }
}

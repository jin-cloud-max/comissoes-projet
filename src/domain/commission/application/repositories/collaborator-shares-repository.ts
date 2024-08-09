import type { CollaboratorShare } from '../../enterprise/entities/collaborator-share'

interface FindCollaboratorShareWithCollaboratorIdProps {
  collaboratorId: string
  shareWithCollaboratorId: string
}

export interface CollaboratorSharesRepository {
  create: (collaboratorShare: CollaboratorShare) => Promise<void>
  findCollaboratorShareWithCollaboratorId: (
    params: FindCollaboratorShareWithCollaboratorIdProps,
  ) => Promise<CollaboratorShare | null>
}

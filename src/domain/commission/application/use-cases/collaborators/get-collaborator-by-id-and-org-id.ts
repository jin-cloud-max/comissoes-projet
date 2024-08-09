import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Collaborator } from '@/domain/commission/enterprise/entities/collaborator'

import type { CollaboratorsRepository } from '../../repositories/collaborators-repository'

interface GetCollaboratorByIdUseCaseInput {
  collaboratorId: UniqueEntityID
  organizationId: UniqueEntityID
}

type GetCollaboratorByIdUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    collaborator: Collaborator
  }
>

export class GetCollaboratorByIdUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute(
    input: GetCollaboratorByIdUseCaseInput,
  ): Promise<GetCollaboratorByIdUseCaseOutput> {
    const collaborator = await this.collaboratorsRepository.findByIdAndOrgId(
      input.collaboratorId.toString(),
      input.organizationId.toString(),
    )

    if (!collaborator) {
      return left(new ResourceNotFoundError(input.collaboratorId.toString()))
    }

    return right({ collaborator })
  }
}

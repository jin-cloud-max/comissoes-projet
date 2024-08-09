import { type Either, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { PaginationParamsInput } from '@/core/use-cases/pagination-params-input'
import type { PaginationParamsOutput } from '@/core/use-cases/pagination-params-output'
import type { Collaborator } from '@/domain/commission/enterprise/entities/collaborator'

import type { CollaboratorsRepository } from '../../repositories/collaborators-repository'

type ListAndCountCollaboratorsUseCaseInput = PaginationParamsInput & {
  search?: string
  organizationId: UniqueEntityID
}

type ListAndCountCollaboratorsUseCaseOutputData = PaginationParamsOutput & {
  collaborators: Collaborator[]
}

type ListAndCountCollaboratorsUseCaseOutput = Either<
  null,
  ListAndCountCollaboratorsUseCaseOutputData
>

export class ListAndCountCollaboratorsByOrgIdUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute({
    limit,
    page,
    search,
    organizationId,
  }: ListAndCountCollaboratorsUseCaseInput): Promise<ListAndCountCollaboratorsUseCaseOutput> {
    if (!organizationId) {
      return right({
        count: 0,
        page,
        limit,
        collaborators: [],
      })
    }

    const collaborators = await this.collaboratorsRepository.listByOrgId({
      limit,
      page,
      filterBy: {
        search,
        organizationId: organizationId.toValue(),
      },
    })

    const count = await this.collaboratorsRepository.countByOrgId({
      search,
      organizationId: organizationId.toValue(),
    })

    return right({
      count,
      page,
      limit,
      collaborators,
    })
  }
}

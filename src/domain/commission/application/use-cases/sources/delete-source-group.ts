import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import type { SourceGroupsRepository } from '../../repositories/source-groups-repository'

export interface DeleteSourceGroupUseCaseInput {
  sourceGroupId: UniqueEntityID
}

type DeleteSourceGroupUseCaseOutput = Either<ResourceNotFoundError, null>

export class DeleteSourceGroupUseCase {
  constructor(
    private readonly sourceGroupsRepository: SourceGroupsRepository,
  ) {}

  async execute({
    sourceGroupId,
  }: DeleteSourceGroupUseCaseInput): Promise<DeleteSourceGroupUseCaseOutput> {
    const sourceGroup = await this.sourceGroupsRepository.findById(
      sourceGroupId.toString(),
    )

    if (!sourceGroup) {
      return left(new ResourceNotFoundError())
    }

    // [ ] - Should not delete if there are source with it

    await this.sourceGroupsRepository.delete(sourceGroup)

    return right(null)
  }
}

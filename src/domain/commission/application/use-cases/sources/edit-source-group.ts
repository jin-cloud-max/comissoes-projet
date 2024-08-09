import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { SourceGroup } from '@/domain/commission/enterprise/entities/source-group'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { SourceGroupsRepository } from '../../repositories/source-groups-repository'

export interface EditSourceGroupUseCaseInput {
  sourceGroupId: UniqueEntityID
  name: string
  slug?: Slug
}

type EditSourceGroupUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    sourceGroup: SourceGroup
  }
>

export class EditSourceGroupUseCase {
  constructor(
    private readonly sourceGroupIdsRepository: SourceGroupsRepository,
  ) {}

  async execute({
    sourceGroupId,
    name,
    slug,
  }: EditSourceGroupUseCaseInput): Promise<EditSourceGroupUseCaseOutput> {
    const sourceGroup = await this.sourceGroupIdsRepository.findById(
      sourceGroupId.toString(),
    )

    if (!sourceGroup) {
      return left(new ResourceNotFoundError())
    }

    sourceGroup.name = name
    sourceGroup.slug = slug ?? Slug.createFromText(name)

    await this.sourceGroupIdsRepository.edit(sourceGroup)

    return right({ sourceGroup })
  }
}

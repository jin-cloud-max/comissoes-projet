import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Source } from '@/domain/commission/enterprise/entities/source'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { SourceGroupsRepository } from '../../repositories/source-groups-repository'
import type { SourcesRepository } from '../../repositories/source-repository'

export interface EditSourceGroupSourcesUseCaseInput {
  sourceGroupId: UniqueEntityID
  sourceId: UniqueEntityID
  name: string
  slug?: Slug
}

type EditSourceGroupSourcesUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    source: Source
  }
>

export class EditSourceGroupSourcesUseCase {
  constructor(
    private readonly sourceGroupIdsRepository: SourceGroupsRepository,
    private readonly sourcesRepository: SourcesRepository,
  ) {}

  async execute({
    sourceGroupId,
    sourceId,
    name,
    slug,
  }: EditSourceGroupSourcesUseCaseInput): Promise<EditSourceGroupSourcesUseCaseOutput> {
    const sourceGroup = await this.sourceGroupIdsRepository.findById(
      sourceGroupId.toString(),
    )

    if (!sourceGroup) {
      return left(new ResourceNotFoundError())
    }

    const source = await this.sourcesRepository.findById(sourceId.toString())

    if (!source) {
      return left(new ResourceNotFoundError(sourceId.toString()))
    }

    source.source = name
    source.slug = slug ?? Slug.createFromText(name)
    source.sourceGroupId = sourceGroup.id

    await this.sourcesRepository.edit(source)

    return right({ source })
  }
}

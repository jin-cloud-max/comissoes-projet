import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Source } from '@/domain/commission/enterprise/entities/source'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { SourceGroupsRepository } from '../../repositories/source-groups-repository'
import type { SourcesRepository } from '../../repositories/source-repository'

export interface CreateSourceGroupSourceUseCaseInput {
  source: string
  slug?: Slug
  sourceGroupId: UniqueEntityID
}

type CreateSourceGroupSourceUseCaseOutput = Either<
  ConflictError | ResourceNotFoundError,
  {
    source: Source
  }
>

export class CreateSourceGroupSourceUseCase {
  constructor(
    private readonly sourcesRepository: SourcesRepository,
    private readonly sourceGroupRepository: SourceGroupsRepository,
  ) {}

  async execute({
    source: sourceName,
    sourceGroupId,
    slug,
  }: CreateSourceGroupSourceUseCaseInput): Promise<CreateSourceGroupSourceUseCaseOutput> {
    const sourceGroup = await this.sourceGroupRepository.findById(
      sourceGroupId.toString(),
    )

    if (!sourceGroup) {
      return left(new ResourceNotFoundError())
    }

    const source = Source.create({
      source: sourceName,
      slug,
      sourceGroup,
      sourceGroupId: sourceGroup.id,
    })

    const sourceAlreadyExists = await this.sourcesRepository.findBySlug(
      source.slug.value,
    )

    if (sourceAlreadyExists) {
      return left(new ConflictError())
    }

    await this.sourcesRepository.create(source)

    return right({ source })
  }
}

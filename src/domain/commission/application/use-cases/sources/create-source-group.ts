import { type Either, left, right } from '@/core/either'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { SourceGroup } from '@/domain/commission/enterprise/entities/source-group'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { SourceGroupsRepository } from '../../repositories/source-groups-repository'

export interface CreateSourceGroupUseCaseInput {
  name: string
  slug?: Slug
}

type CreateSourceGroupUseCaseOutput = Either<
  ConflictError,
  {
    sourceGroup: SourceGroup
  }
>

export class CreateSourceGroupUseCase {
  constructor(private readonly sourceGroupRepository: SourceGroupsRepository) {}

  async execute({
    name,
    slug,
  }: CreateSourceGroupUseCaseInput): Promise<CreateSourceGroupUseCaseOutput> {
    const sourceGroup = SourceGroup.create({ name, slug })

    const sourceGroupAlreadyExists =
      await this.sourceGroupRepository.findBySlug(sourceGroup.slug.value)

    if (sourceGroupAlreadyExists) {
      return left(new ConflictError())
    }

    await this.sourceGroupRepository.create(sourceGroup)

    return right({ sourceGroup })
  }
}

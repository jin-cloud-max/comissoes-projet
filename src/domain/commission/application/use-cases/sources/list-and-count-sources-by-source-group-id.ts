import { type Either, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Source } from '@/domain/commission/enterprise/entities/source'

import type { SourcesRepository } from '../../repositories/source-repository'

export interface ListAndCountSourcesBySourceGroupIdUseCaseInput {
  limit: number
  page: number
  sourceGroupId: UniqueEntityID
  source?: string
}

type ListAndCountSourcesBySourceGroupIdUseCaseOutput = Either<
  null,
  {
    count: number
    page: number
    limit: number
    sources: Source[]
  }
>

export class ListAndCountSourcesBySourceGroupIdUseCase {
  constructor(private readonly sourcesRepository: SourcesRepository) {}

  async execute({
    source,
    limit,
    sourceGroupId,
    page,
  }: ListAndCountSourcesBySourceGroupIdUseCaseInput): Promise<ListAndCountSourcesBySourceGroupIdUseCaseOutput> {
    const sources = await this.sourcesRepository.listBySourceGroupId(
      sourceGroupId.toString(),
      {
        limit,
        page,
        filterBy: {
          source,
        },
      },
    )

    const totalRecords = await this.sourcesRepository.countBySourceGroupId(
      sourceGroupId.toString(),
      {
        source,
      },
    )

    return right({
      count: totalRecords,
      limit,
      page,
      sources,
    })
  }
}

import { type Either, right } from '@/core/either'
import type { SourceGroup } from '@/domain/commission/enterprise/entities/source-group'

import type { SourceGroupsRepository } from '../../repositories/source-groups-repository'

export interface ListAndCountSourceGroupsUseCaseInput {
  page: number
  limit: number
  name?: string
}

type ListAndCountSourceGroupsUseCaseOutput = Either<
  null,
  {
    count: number
    page: number
    limit: number
    sourceGroups: SourceGroup[]
  }
>

export class ListAndCountSourceGroupsUseCase {
  constructor(
    private readonly sourceGroupsRepository: SourceGroupsRepository,
  ) {}

  async execute({
    limit,
    page,
    name,
  }: ListAndCountSourceGroupsUseCaseInput): Promise<ListAndCountSourceGroupsUseCaseOutput> {
    const sourceGroups = await this.sourceGroupsRepository.list({
      limit,
      page,
      filterBy: {
        name,
      },
    })

    const count = await this.sourceGroupsRepository.count({
      name,
    })

    return right({ count, page, limit, sourceGroups })
  }
}

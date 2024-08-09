import { type Either, right } from '@/core/either'
import type { PaginationParamsInput } from '@/core/use-cases/pagination-params-input'
import type { PaginationParamsOutput } from '@/core/use-cases/pagination-params-output'
import type { Mapper } from '@/domain/commission/enterprise/entities/mapper'

import type { MappersRepository } from '../../repositories/mappers-repository'

type ListAndCountMappersUseCaseInput = PaginationParamsInput & {
  title?: string
}

type ListAndCountMappersUseCaseOutputData = PaginationParamsOutput & {
  mappers: Mapper[]
}

type ListAndCountMappersUseCaseOutput = Either<
  null,
  ListAndCountMappersUseCaseOutputData
>

export class ListAndCountMappersUseCase {
  constructor(private mappersRepository: MappersRepository) {}

  async execute(
    input: ListAndCountMappersUseCaseInput,
  ): Promise<ListAndCountMappersUseCaseOutput> {
    const mappers = await this.mappersRepository.list(input)

    const count = await this.mappersRepository.count({ title: input.title })

    return right({
      count,
      limit: input.limit,
      page: input.page,
      mappers,
    })
  }
}

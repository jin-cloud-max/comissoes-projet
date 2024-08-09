import { type Either, right } from '@/core/either'
import type { PaginationParamsOutput } from '@/core/use-cases/pagination-params-output'
import type { Category } from '@/domain/commission/enterprise/entities/category'

import type { CategoriesRepository } from '../../repositories/categories-repository'

export interface ListAndCountCategoriesUseCaseInput {
  page: number
  limit: number
  category?: string
}

type ListAndCountCategoriesUseCaseOutputData = PaginationParamsOutput & {
  categories: Category[]
}

type ListAndCountCategoriesUseCaseOutput = Either<
  null,
  ListAndCountCategoriesUseCaseOutputData
>

export class ListAndCountCategoriesUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({
    limit,
    page,
    category,
  }: ListAndCountCategoriesUseCaseInput): Promise<ListAndCountCategoriesUseCaseOutput> {
    const categories = await this.categoriesRepository.list({
      limit,
      page,
      filterBy: {
        category,
      },
    })

    const count = await this.categoriesRepository.count({
      category,
    })

    return right({ count, page, limit, categories })
  }
}

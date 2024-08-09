import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Category } from '@/domain/commission/enterprise/entities/category'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { CategoriesRepository } from '../../repositories/categories-repository'

export interface EditCategoryUseCaseInput {
  categoryId: UniqueEntityID
  categoryName: string
  slug?: Slug
}

type EditCategoryUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    category: Category
  }
>

export class EditCategoryUseCase {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async execute({
    categoryId,
    categoryName,
    slug,
  }: EditCategoryUseCaseInput): Promise<EditCategoryUseCaseOutput> {
    const category = await this.categoriesRepository.findById(
      categoryId.toString(),
    )

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    category.category = categoryName
    category.slug = slug ?? Slug.createFromText(categoryName)

    await this.categoriesRepository.edit(category)

    return right({ category })
  }
}

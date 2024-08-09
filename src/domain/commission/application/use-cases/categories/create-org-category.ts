import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Category } from '@/domain/commission/enterprise/entities/category'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { CategoriesRepository } from '../../repositories/categories-repository'
import type { OrganizationsRepository } from '../../repositories/organizations-repository'

export interface CreateOrgCategoryUseCaseInput {
  categoryName: string
  orgId: UniqueEntityID
  slug?: Slug
}

type CreateOrgCategoryUseCaseOutput = Either<
  ConflictError | ResourceNotFoundError,
  {
    category: Category
  }
>

export class CreateOrgCategoryUseCase {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async execute({
    categoryName,
    slug,
    orgId,
  }: CreateOrgCategoryUseCaseInput): Promise<CreateOrgCategoryUseCaseOutput> {
    const organization = await this.organizationsRepository.findById(
      orgId.toString(),
    )

    if (!organization) {
      return left(new ResourceNotFoundError())
    }

    const category = Category.create({
      category: categoryName,
      slug,
      orgId,
    })

    const existingCategory = await this.categoriesRepository.findBySlug(
      category.slug.value,
    )

    if (existingCategory) {
      return left(new ConflictError())
    }

    await this.categoriesRepository.create(category)

    return right({ category })
  }
}

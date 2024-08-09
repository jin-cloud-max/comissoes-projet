import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedResource } from '@/core/errors/errors/unauthorized'

import type { CategoriesRepository } from '../../repositories/categories-repository'
import type { OrganizationsRepository } from '../../repositories/organizations-repository'

export interface DeleteCategoryUseCaseInput {
  categoryId: UniqueEntityID
  organizationId: UniqueEntityID
}

type DeleteCategoryUseCaseOutput = Either<
  ResourceNotFoundError | UnauthorizedResource,
  null
>

export class DeleteCategoryUseCase {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async execute({
    categoryId,
    organizationId,
  }: DeleteCategoryUseCaseInput): Promise<DeleteCategoryUseCaseOutput> {
    const organization = await this.organizationsRepository.findById(
      organizationId.toString(),
    )

    if (!organization) {
      return left(new ResourceNotFoundError())
    }

    const category = await this.categoriesRepository.findById(
      categoryId.toString(),
    )

    if (!category) {
      return left(new ResourceNotFoundError())
    }

    if (category.orgId.toString() !== organizationId.toString()) {
      return left(new UnauthorizedResource())
    }

    await this.categoriesRepository.delete(category)

    return right(null)
  }
}

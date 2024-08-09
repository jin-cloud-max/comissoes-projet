import { makeCategory } from 'test/factories/make-category'
import { makeOrganization } from 'test/factories/make-organization'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryOrganizationsRepository } from 'test/repositories/in-memory-organizations-repository'

import { ConflictError } from '@/core/errors/errors/conflict-error'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import { CreateOrgCategoryUseCase } from './create-org-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryOrganizationsRepository: InMemoryOrganizationsRepository
let sut: CreateOrgCategoryUseCase

describe('Create Organization Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryOrganizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreateOrgCategoryUseCase(
      inMemoryCategoriesRepository,
      inMemoryOrganizationsRepository,
    )
  })

  test('it should be able to create a new organization category', async () => {
    const org = makeOrganization()

    await inMemoryOrganizationsRepository.create(org)

    const result = await sut.execute({
      categoryName: 'Category name',
      orgId: org.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
  })

  test('it should not be able to create a category that already exists', async () => {
    const org = makeOrganization()

    await inMemoryOrganizationsRepository.create(org)

    const category = makeCategory({
      category: 'Category name 2',
      orgId: org.id,
      slug: Slug.create(`${org.id}-category-name-2`),
    })

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryName: 'Category name 2',
      orgId: org.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})

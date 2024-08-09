import { makeCategory } from 'test/factories/make-category'
import { makeOrganization } from 'test/factories/make-organization'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryOrganizationsRepository } from 'test/repositories/in-memory-organizations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedResource } from '@/core/errors/errors/unauthorized'

import { DeleteCategoryUseCase } from './delete-org-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryOrganizationsRepository: InMemoryOrganizationsRepository
let sut: DeleteCategoryUseCase

describe('Delete Organization Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryOrganizationsRepository = new InMemoryOrganizationsRepository()
    sut = new DeleteCategoryUseCase(
      inMemoryCategoriesRepository,
      inMemoryOrganizationsRepository,
    )
  })

  test('it should be able to delete a organization category', async () => {
    const organization = makeOrganization()
    const category = makeCategory({
      orgId: organization.id,
    })

    await inMemoryOrganizationsRepository.create(organization)

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id,
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(0)
  })

  test('it should not be able to delete a category that does not exists', async () => {
    const organization = makeOrganization()

    await inMemoryOrganizationsRepository.create(organization)
    const result = await sut.execute({
      categoryId: new UniqueEntityID('invalid-id'),
      organizationId: organization.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  test('it should not be able to delete a category from another organization', async () => {
    const organization = makeOrganization()
    const organization2 = makeOrganization()
    const category = makeCategory({
      orgId: organization.id,
    })

    await inMemoryOrganizationsRepository.create(organization)
    await inMemoryOrganizationsRepository.create(organization2)

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id,
      organizationId: organization2.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedResource)
  })
})

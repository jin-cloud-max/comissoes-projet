import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { EditCategoryUseCase } from './edit-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: EditCategoryUseCase

describe('Edit Category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new EditCategoryUseCase(inMemoryCategoriesRepository)
  })

  test('it should be able to edit a category', async () => {
    const category = makeCategory()

    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      categoryId: category.id,
      categoryName: 'Category name edited',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items[0].category).toEqual(
      'Category name edited',
    )
  })

  test('it should not be able to edit a category that does not exists', async () => {
    const result = await sut.execute({
      categoryId: new UniqueEntityID('invalid-id'),
      categoryName: 'Category name edited',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

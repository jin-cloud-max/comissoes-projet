import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { ListAndCountCategoriesUseCase } from './list-and-count-categories'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: ListAndCountCategoriesUseCase

describe('List and Count', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new ListAndCountCategoriesUseCase(inMemoryCategoriesRepository)
  })

  test('it should be able to list and count categories', async () => {
    await inMemoryCategoriesRepository.create(makeCategory())
    await inMemoryCategoriesRepository.create(makeCategory())
    await inMemoryCategoriesRepository.create(makeCategory())

    const result = await sut.execute({
      limit: 10,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(3)
  })

  test('it should not be able to list and count paginated categories', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryCategoriesRepository.create(makeCategory())
    }

    const result = await sut.execute({
      limit: 10,
      page: 3,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.categories).toHaveLength(2)
  })

  test('it should be able to list and count categories and filter by category', async () => {
    await inMemoryCategoriesRepository.create(
      makeCategory({ category: 'Categoria nova 1' }),
    )
    await inMemoryCategoriesRepository.create(
      makeCategory({ category: 'Categoria nova 2' }),
    )
    await inMemoryCategoriesRepository.create(makeCategory())

    const result = await sut.execute({
      limit: 10,
      page: 1,
      category: 'Categoria',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.categories).toHaveLength(2)
    expect(result.value?.count).toBe(2)
  })
})

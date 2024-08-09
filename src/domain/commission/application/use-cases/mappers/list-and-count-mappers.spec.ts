import { makeMapper } from 'test/factories/make-mapper'
import { InMemoryMappersRepository } from 'test/repositories/in-memory-mappers-repository'

import { ListAndCountMappersUseCase } from './list-and-count-mappers'

let inMemoryMappersRepository: InMemoryMappersRepository
let sut: ListAndCountMappersUseCase

describe('List And Count Mappers', () => {
  beforeEach(() => {
    inMemoryMappersRepository = new InMemoryMappersRepository()
    sut = new ListAndCountMappersUseCase(inMemoryMappersRepository)
  })

  test('it should be able to list and count mappers', async () => {
    await inMemoryMappersRepository.create(makeMapper())
    await inMemoryMappersRepository.create(makeMapper())
    await inMemoryMappersRepository.create(makeMapper())

    const result = await sut.execute({
      limit: 10,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMappersRepository.items).toHaveLength(3)
  })
})

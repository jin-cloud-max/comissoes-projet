import { makeMapper } from 'test/factories/make-mapper'
import { InMemoryMappersRepository } from 'test/repositories/in-memory-mappers-repository'

import { DeleteMapperUseCase } from './delete-mapper'

let inMemoryMappersRepository: InMemoryMappersRepository
let sut: DeleteMapperUseCase

describe('Delete Mapper', () => {
  beforeEach(() => {
    inMemoryMappersRepository = new InMemoryMappersRepository()
    sut = new DeleteMapperUseCase(inMemoryMappersRepository)
  })

  test('it should be able to delete a mapper', async () => {
    const mapper = makeMapper()

    await inMemoryMappersRepository.create(mapper)

    const result = await sut.execute({
      mapperId: mapper.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMappersRepository.items).toHaveLength(0)
  })
})

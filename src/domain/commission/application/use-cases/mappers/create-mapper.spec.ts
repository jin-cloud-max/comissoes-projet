import { InMemoryMappersRepository } from 'test/repositories/in-memory-mappers-repository'

import { CreateMapperUseCase } from './create-mapper'

let inMemoryMappersRepository: InMemoryMappersRepository
let sut: CreateMapperUseCase

describe('Create Mapper', () => {
  beforeEach(() => {
    inMemoryMappersRepository = new InMemoryMappersRepository()
    sut = new CreateMapperUseCase(inMemoryMappersRepository)
  })

  test('it should be able to create a new mapper', async () => {
    const result = await sut.execute({
      title: 'title',
      mapField: 'mapField',
      fromField: 'fromField',
      mapValue: 'mapValue',
      value: 'value',
      condition: 'equals',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryMappersRepository.items).toHaveLength(1)
  })
})

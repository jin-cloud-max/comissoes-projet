import { makeMapper } from 'test/factories/make-mapper'
import { InMemoryMappersRepository } from 'test/repositories/in-memory-mappers-repository'

import type { Mapper } from '@/domain/commission/enterprise/entities/mapper'

import { GetMapperByIdUseCase } from './get-mapper-by-id'

let inMemoryMappersRepository: InMemoryMappersRepository
let sut: GetMapperByIdUseCase

describe('Get Mapper', () => {
  beforeEach(() => {
    inMemoryMappersRepository = new InMemoryMappersRepository()
    sut = new GetMapperByIdUseCase(inMemoryMappersRepository)
  })

  test('it should be able to get mapper by id', async () => {
    const mapper = makeMapper()

    await inMemoryMappersRepository.create(mapper)

    const result = await sut.execute({ mapperId: mapper.id })

    expect(result.isRight()).toBe(true)

    expect((result.value as { mapper: Mapper }).mapper).toEqual(mapper)
  })
})

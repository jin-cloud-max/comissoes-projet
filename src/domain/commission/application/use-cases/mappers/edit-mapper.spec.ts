import { makeMapper } from 'test/factories/make-mapper'
import { InMemoryMappersRepository } from 'test/repositories/in-memory-mappers-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Mapper } from '@/domain/commission/enterprise/entities/mapper'

import { EditMapperUseCase } from './edit-mapper'

let inMemoryMappersRepository: InMemoryMappersRepository
let sut: EditMapperUseCase

describe('Edit Mapper', () => {
  beforeEach(() => {
    inMemoryMappersRepository = new InMemoryMappersRepository()
    sut = new EditMapperUseCase(inMemoryMappersRepository)
  })

  test('it should be able to edit mapper', async () => {
    const mapper = makeMapper()

    await inMemoryMappersRepository.create(mapper)

    const result = await sut.execute({
      mapperId: mapper.id,
      title: 'Updated title',
      mapField: 'Updated mapField',
      fromField: 'Updated fromField',
      mapValue: 'Updated mapValue',
      value: 'Updated value',
      condition: 'contains',
    })

    expect(result.isRight()).toBe(true)
    expect((result.value as { mapper: Mapper }).mapper.title).toEqual(
      'Updated title',
    )
  })

  test('it should not be able to edit mapper if it does not exist', async () => {
    const result = await sut.execute({
      mapperId: new UniqueEntityID(),
      title: 'updated title',
      mapField: 'updated mapField',
      fromField: 'updated fromField',
      mapValue: 'updated mapValue',
      value: 'updated value',
      condition: 'contains',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

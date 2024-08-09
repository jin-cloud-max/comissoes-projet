import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'

import { ConflictError } from '@/core/errors/errors/conflict-error'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import { CreateSourceGroupUseCase } from './create-source-group'

let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let sut: CreateSourceGroupUseCase

describe('Create Source Group', () => {
  beforeEach(() => {
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    sut = new CreateSourceGroupUseCase(inMemorySourceGroupsRepository)
  })

  test('it should be able to create a new source group', async () => {
    const result = await sut.execute({
      name: 'Source group name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourceGroupsRepository.items).toHaveLength(1)
  })

  test('it should not be able to create a source group that already exists', async () => {
    await inMemorySourceGroupsRepository.create(
      makeSourceGroup({
        name: 'Source group name',
        slug: Slug.create('source-group-name'),
      }),
    )

    const result = await sut.execute({
      name: 'Source group name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})

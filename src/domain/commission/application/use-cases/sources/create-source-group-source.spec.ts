import { makeSource } from 'test/factories/make-source'
import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'
import { InMemorySourcesRepository } from 'test/repositories/in-memory-source-repository'

import { ConflictError } from '@/core/errors/errors/conflict-error'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import { CreateSourceGroupSourceUseCase } from './create-source-group-source'

let inMemorySourcesRepository: InMemorySourcesRepository
let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let sut: CreateSourceGroupSourceUseCase

describe('Create Source', () => {
  beforeEach(() => {
    inMemorySourcesRepository = new InMemorySourcesRepository()
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    sut = new CreateSourceGroupSourceUseCase(
      inMemorySourcesRepository,
      inMemorySourceGroupsRepository,
    )
  })

  test('it should be able to create a new source', async () => {
    const sourceGroup = makeSourceGroup()

    await inMemorySourceGroupsRepository.create(sourceGroup)

    const result = await sut.execute({
      source: 'Source name',
      sourceGroupId: sourceGroup.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourcesRepository.items).toHaveLength(1)
  })

  test('it should not be able to create a source that already exists', async () => {
    const sourceGroup = makeSourceGroup()

    await inMemorySourceGroupsRepository.create(sourceGroup)

    await inMemorySourcesRepository.create(
      makeSource({
        source: 'Source name',
        slug: Slug.create('source-name'),
      }),
    )

    const result = await sut.execute({
      source: 'Source name',
      sourceGroupId: sourceGroup.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})

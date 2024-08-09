import { makeSource } from 'test/factories/make-source'
import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'
import { InMemorySourcesRepository } from 'test/repositories/in-memory-source-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ListAndCountSourcesBySourceGroupIdUseCase } from './list-and-count-sources-by-source-group-id'

let inMemorySourcesRepository: InMemorySourcesRepository
let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let sut: ListAndCountSourcesBySourceGroupIdUseCase

describe('List and Count', () => {
  beforeEach(() => {
    inMemorySourcesRepository = new InMemorySourcesRepository()
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    sut = new ListAndCountSourcesBySourceGroupIdUseCase(
      inMemorySourcesRepository,
    )
  })

  test('it should be able to list and count sources by source group ID', async () => {
    await inMemorySourcesRepository.create(makeSource())
    await inMemorySourcesRepository.create(makeSource())
    await inMemorySourcesRepository.create(makeSource())

    const result = await sut.execute({
      limit: 10,
      sourceGroupId: new UniqueEntityID('source-group-id'),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourcesRepository.items).toHaveLength(3)
  })

  test('it should not be able to list and count paginated sources', async () => {
    const subSource = makeSourceGroup()

    await inMemorySourceGroupsRepository.create(subSource)

    for (let i = 0; i < 22; i++) {
      await inMemorySourcesRepository.create(
        makeSource({
          sourceGroupId: subSource.id,
        }),
      )
    }

    const result = await sut.execute({
      limit: 10,
      sourceGroupId: subSource.id,
      page: 3,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.sources).toHaveLength(2)
  })

  test('it should be able to list and count sources and filter by source', async () => {
    const subSource = makeSourceGroup()

    await inMemorySourceGroupsRepository.create(subSource)

    await inMemorySourcesRepository.create(
      makeSource({
        source: 'Regra nova 1',
        sourceGroupId: subSource.id,
      }),
    )
    await inMemorySourcesRepository.create(
      makeSource({
        source: 'Regra nova 2',
        sourceGroupId: subSource.id,
      }),
    )
    await inMemorySourcesRepository.create(makeSource())

    const result = await sut.execute({
      limit: 10,
      page: 1,
      source: 'Regra',
      sourceGroupId: subSource.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.sources).toHaveLength(2)
    expect(result.value?.count).toBe(2)
  })
})

import { makeSource } from 'test/factories/make-source'
import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'
import { InMemorySourcesRepository } from 'test/repositories/in-memory-source-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { EditSourceGroupSourcesUseCase } from './edit-source-group-sources'

let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let inMemorySourcesRepository: InMemorySourcesRepository
let sut: EditSourceGroupSourcesUseCase

describe('Edit Source', () => {
  beforeEach(() => {
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    inMemorySourcesRepository = new InMemorySourcesRepository()
    sut = new EditSourceGroupSourcesUseCase(
      inMemorySourceGroupsRepository,
      inMemorySourcesRepository,
    )
  })

  test('it should be able to edit a source', async () => {
    const sourceGroup = makeSourceGroup()
    const source = makeSource()

    await inMemorySourceGroupsRepository.create(sourceGroup)
    await inMemorySourcesRepository.create(source)

    const result = await sut.execute({
      sourceGroupId: sourceGroup.id,
      name: 'Source name edited',
      sourceId: source.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourcesRepository.items[0].source).toEqual(
      'Source name edited',
    )
  })

  test('it should not be able to edit a source that does not exists', async () => {
    const result = await sut.execute({
      sourceGroupId: new UniqueEntityID('invalid-id'),
      name: 'Source name edited',
      sourceId: new UniqueEntityID('source-id'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

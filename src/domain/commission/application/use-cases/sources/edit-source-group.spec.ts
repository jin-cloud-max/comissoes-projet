import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { EditSourceGroupUseCase } from './edit-source-group'

let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let sut: EditSourceGroupUseCase

describe('Edit Source Group', () => {
  beforeEach(() => {
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    sut = new EditSourceGroupUseCase(inMemorySourceGroupsRepository)
  })

  test('it should be able to edit a source group', async () => {
    const sourceGroup = makeSourceGroup()

    await inMemorySourceGroupsRepository.create(sourceGroup)

    const result = await sut.execute({
      sourceGroupId: sourceGroup.id,
      name: 'Source group name edited',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourceGroupsRepository.items[0].name).toEqual(
      'Source group name edited',
    )
  })

  test('it should not be able to edit a source group that does not exists', async () => {
    const result = await sut.execute({
      sourceGroupId: new UniqueEntityID('invalid-id'),
      name: 'Source group name edited',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

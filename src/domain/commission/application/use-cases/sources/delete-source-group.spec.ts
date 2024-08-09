import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeleteSourceGroupUseCase } from './delete-source-group'

let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let sut: DeleteSourceGroupUseCase

describe('Delete Source Group', () => {
  beforeEach(() => {
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    sut = new DeleteSourceGroupUseCase(inMemorySourceGroupsRepository)
  })

  test('it should be able to delete source group', async () => {
    const sourceGroup = makeSourceGroup()

    await inMemorySourceGroupsRepository.create(sourceGroup)

    const result = await sut.execute({
      sourceGroupId: sourceGroup.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourceGroupsRepository.items).toHaveLength(0)
  })

  test('it should not be able to delete a source group that does not exists', async () => {
    const result = await sut.execute({
      sourceGroupId: new UniqueEntityID('invalid-id'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

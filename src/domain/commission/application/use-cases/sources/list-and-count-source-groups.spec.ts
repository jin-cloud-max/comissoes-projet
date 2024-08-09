import { makeSourceGroup } from 'test/factories/make-source-group'
import { InMemorySourceGroupsRepository } from 'test/repositories/in-memory-source-groups-repository'

import { ListAndCountSourceGroupsUseCase } from './list-and-count-source-groups'

let inMemorySourceGroupsRepository: InMemorySourceGroupsRepository
let sut: ListAndCountSourceGroupsUseCase

describe('List and Count', () => {
  beforeEach(() => {
    inMemorySourceGroupsRepository = new InMemorySourceGroupsRepository()
    sut = new ListAndCountSourceGroupsUseCase(inMemorySourceGroupsRepository)
  })

  test('it should be able to list and count source groups', async () => {
    await inMemorySourceGroupsRepository.create(makeSourceGroup())
    await inMemorySourceGroupsRepository.create(makeSourceGroup())
    await inMemorySourceGroupsRepository.create(makeSourceGroup())

    const result = await sut.execute({
      limit: 10,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySourceGroupsRepository.items).toHaveLength(3)
  })

  test('it should not be able to list and count paginated source groups', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemorySourceGroupsRepository.create(makeSourceGroup())
    }

    const result = await sut.execute({
      limit: 10,
      page: 3,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.sourceGroups).toHaveLength(2)
  })

  test('it should be able to list and count source groups and filter by name', async () => {
    await inMemorySourceGroupsRepository.create(
      makeSourceGroup({ name: 'Regra nova 1' }),
    )
    await inMemorySourceGroupsRepository.create(
      makeSourceGroup({ name: 'Regra nova 2' }),
    )
    await inMemorySourceGroupsRepository.create(makeSourceGroup())

    const result = await sut.execute({
      limit: 10,
      page: 1,
      name: 'Regra',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.sourceGroups).toHaveLength(2)
    expect(result.value?.count).toBe(2)
  })
})

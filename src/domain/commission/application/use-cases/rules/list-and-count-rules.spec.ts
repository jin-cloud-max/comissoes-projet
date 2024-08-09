import { makeRule } from 'test/factories/make-rule'
import { InMemoryRulesRepository } from 'test/repositories/in-memory-rules-repository'

import { ListAndCountRulesUseCase } from './list-and-count-rules'

let inMemoryRulesRepository: InMemoryRulesRepository
let sut: ListAndCountRulesUseCase

describe('List and Count', () => {
  beforeEach(() => {
    inMemoryRulesRepository = new InMemoryRulesRepository()
    sut = new ListAndCountRulesUseCase(inMemoryRulesRepository)
  })

  test('it should be able to list and count rules', async () => {
    await inMemoryRulesRepository.create(makeRule())
    await inMemoryRulesRepository.create(makeRule())
    await inMemoryRulesRepository.create(makeRule())

    const result = await sut.execute({
      limit: 10,
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRulesRepository.items).toHaveLength(3)
  })

  test('it should not be able to list and count paginated rules', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryRulesRepository.create(makeRule())
    }

    const result = await sut.execute({
      limit: 10,
      page: 3,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.rules).toHaveLength(2)
  })

  test('it should be able to list and count rules and filter by rule', async () => {
    await inMemoryRulesRepository.create(makeRule({ name: 'Regra nova 1' }))
    await inMemoryRulesRepository.create(makeRule({ name: 'Regra nova 2' }))
    await inMemoryRulesRepository.create(makeRule())

    const result = await sut.execute({
      limit: 10,
      page: 1,
      rule: 'Regra',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.rules).toHaveLength(2)
    expect(result.value?.count).toBe(2)
  })
})

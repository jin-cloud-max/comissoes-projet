import { makeRule } from 'test/factories/make-rule'
import { InMemoryRulesRepository } from 'test/repositories/in-memory-rules-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { EditRuleUseCase } from './edit-rule'

let inMemoryRulesRepository: InMemoryRulesRepository
let sut: EditRuleUseCase

describe('Edit Rule', () => {
  beforeEach(() => {
    inMemoryRulesRepository = new InMemoryRulesRepository()
    sut = new EditRuleUseCase(inMemoryRulesRepository)
  })

  test('it should be able to edit a rule', async () => {
    const rule = makeRule()

    await inMemoryRulesRepository.create(rule)

    const result = await sut.execute({
      ruleId: rule.id,
      name: 'Rule name edited',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRulesRepository.items[0].name).toEqual('Rule name edited')
  })

  test('it should not be able to edit a rule that does not exists', async () => {
    const result = await sut.execute({
      ruleId: new UniqueEntityID('invalid-id'),
      name: 'Rule name edited',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

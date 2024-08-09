import { makeRule } from 'test/factories/make-rule'
import { InMemoryRulesRepository } from 'test/repositories/in-memory-rules-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeleteRuleUseCase } from './delete-rule'

let inMemoryRulesRepository: InMemoryRulesRepository
let sut: DeleteRuleUseCase

describe('Delete Rule', () => {
  beforeEach(() => {
    inMemoryRulesRepository = new InMemoryRulesRepository()
    sut = new DeleteRuleUseCase(inMemoryRulesRepository)
  })

  test('it should be able to delete rule', async () => {
    const rule = makeRule()

    await inMemoryRulesRepository.create(rule)

    const result = await sut.execute({
      ruleId: rule.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRulesRepository.items).toHaveLength(0)
  })

  test('it should not be able to delete a rule that does not exists', async () => {
    const result = await sut.execute({
      ruleId: new UniqueEntityID('invalid-id'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

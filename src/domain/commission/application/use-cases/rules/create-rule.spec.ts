import { makeRule } from 'test/factories/make-rule'
import { InMemoryRulesRepository } from 'test/repositories/in-memory-rules-repository'

import { ConflictError } from '@/core/errors/errors/conflict-error'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import { CreateRuleUseCase } from './create-rule'

let inMemoryRulesRepository: InMemoryRulesRepository
let sut: CreateRuleUseCase

describe('Create Rule', () => {
  beforeEach(() => {
    inMemoryRulesRepository = new InMemoryRulesRepository()
    sut = new CreateRuleUseCase(inMemoryRulesRepository)
  })

  test('it should be able to create a new rule', async () => {
    const result = await sut.execute({
      name: 'Rule name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRulesRepository.items).toHaveLength(1)
  })

  test('it should not be able to create a rule that already exists', async () => {
    await inMemoryRulesRepository.create(
      makeRule({
        name: 'Rule name',
        slug: Slug.create('rule-name'),
      }),
    )

    const result = await sut.execute({
      name: 'Rule name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})

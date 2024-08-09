import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Rule,
  type RuleInput,
} from '@/domain/commission/enterprise/entities/rule'

export function makeRule(
  overrides: Partial<RuleInput> = {},
  id?: UniqueEntityID,
) {
  const rule = Rule.create(
    {
      name: faker.lorem.word(),
      ...overrides,
    },
    id,
  )

  return rule
}

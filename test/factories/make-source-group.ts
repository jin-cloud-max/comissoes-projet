import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  SourceGroup,
  type SourceGroupInput,
} from '@/domain/commission/enterprise/entities/source-group'

export function makeSourceGroup(
  overrides: Partial<SourceGroupInput> = {},
  id?: UniqueEntityID,
) {
  const sourceGroup = SourceGroup.create(
    {
      name: faker.lorem.word(),
      ...overrides,
    },
    id,
  )

  return sourceGroup
}

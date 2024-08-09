import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Source,
  type SourceInput,
} from '@/domain/commission/enterprise/entities/source'

import { makeSourceGroup } from './make-source-group'

export function makeSource(
  overrides: Partial<SourceInput> = {},
  id?: UniqueEntityID,
) {
  const sourceGroup = makeSourceGroup()

  const source = Source.create(
    {
      source: faker.lorem.word(),
      sourceGroup,
      closure: new Date(),
      ...overrides,
    },
    id,
  )

  return source
}

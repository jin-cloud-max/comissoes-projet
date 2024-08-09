import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Mapper,
  type MapperInput,
} from '@/domain/commission/enterprise/entities/mapper'

export function makeMapper(
  overrides: Partial<MapperInput> = {},
  id?: UniqueEntityID,
) {
  const mapper = Mapper.create(
    {
      title: faker.lorem.word(),
      fromField: faker.lorem.word(),
      mapField: faker.lorem.word(),
      mapValue: faker.lorem.word(),
      value: faker.lorem.word(),
      condition: 'equals',
      ...overrides,
    },
    id,
  )

  return mapper
}

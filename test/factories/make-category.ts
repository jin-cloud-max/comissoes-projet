import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Category,
  type CategoryInput,
} from '@/domain/commission/enterprise/entities/category'

export function makeCategory(
  overrides: Partial<CategoryInput> = {},
  id?: UniqueEntityID,
) {
  const category = Category.create(
    {
      category: faker.lorem.word(),
      ...overrides,
    },
    id,
  )

  return category
}

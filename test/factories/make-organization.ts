import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Organization,
  type OrganizationInput,
} from '@/domain/commission/enterprise/entities/organization'

export function makeOrganization(
  overrides: Partial<OrganizationInput> = {},
  id?: UniqueEntityID,
) {
  const organization = Organization.create(
    {
      name: faker.lorem.word(),
      ownerId: new UniqueEntityID(),
      ...overrides,
    },
    id,
  )

  return organization
}

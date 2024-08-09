import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Collaborator,
  type CollaboratorInput,
} from '@/domain/commission/enterprise/entities/collaborator'
import { Email } from '@/domain/commission/enterprise/entities/value-object/email'

export function makeCollaborator(
  overrides: Partial<CollaboratorInput> = {},
  id?: UniqueEntityID,
) {
  const mapper = Collaborator.create(
    {
      code: faker.lorem.word(),
      email: Email.create(faker.internet.email()),
      name: faker.person.fullName(),
      ...overrides,
    },
    id,
  )

  return mapper
}

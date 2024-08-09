import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Upload,
  type UploadInput,
} from '@/domain/commission/enterprise/entities/upload'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import { makeSource } from './make-source'

export function makeUpload(
  overrides: Partial<UploadInput> = {},
  id?: UniqueEntityID,
) {
  const source = makeSource()

  const upload = Upload.create(
    {
      fileName: faker.lorem.word(),
      fileKey: faker.lorem.word(),
      sourceSlug: Slug.createFromText(faker.lorem.word()),
      uploadedByUserId: new UniqueEntityID(),
      closure: new Date(),
      source,
      ...overrides,
    },
    id,
  )

  return upload
}

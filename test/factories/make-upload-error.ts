import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  UploadError,
  type UploadErrorInput,
} from '@/domain/commission/enterprise/entities/upload-error'

export function makeUploadError(
  overrides: Partial<UploadErrorInput> = {},
  id?: UniqueEntityID,
) {
  const upload = UploadError.create(
    {
      message: faker.lorem.word(),
      type: faker.lorem.word(),
      uploadId: new UniqueEntityID(),
      solved: false,
      log: {
        error: faker.lorem.word(),
      },
      ...overrides,
    },
    id,
  )

  return upload
}

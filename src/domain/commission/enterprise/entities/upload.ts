import { AggregateRoot } from '@/core/entities/aggregate-root'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import { RetryFailedUploadedDataEvent } from './events/retry-failed-uploaded-data-event'
import { UploadCreatedEvent } from './events/upload-created-event'
import { UploadDeletedEvent } from './events/upload-deleted-event'
import type { Source } from './source'
import type { Slug } from './value-object/slug'

export interface UploadInput {
  fileKey: string
  fileName: string
  source: Source
  sourceSlug: Slug
  closure: Date
  createdAt: Date
  updatedAt?: Date
  deletedAt?: Date | undefined
  uploadedByUserId: UniqueEntityID
}

export class Upload extends AggregateRoot<UploadInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get fileKey() {
    return this.props.fileKey
  }

  set fileKey(fileKey: string) {
    this.props.fileKey = fileKey

    this.touch()
  }

  get fileName() {
    return this.props.fileName
  }

  set fileName(fileName: string) {
    this.props.fileName = fileName

    this.touch()
  }

  get closure() {
    return this.props.closure
  }

  get source() {
    return this.props.source
  }

  get sourceSlug() {
    return this.props.sourceSlug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  static create(
    input: Optional<UploadInput, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const upload = new Upload(
      {
        ...input,
        createdAt: input.createdAt || new Date(),
        updatedAt: input.updatedAt || new Date(),
      },
      id,
    )

    const isNewUpload = !id

    if (isNewUpload) {
      upload.addDomainEvent(
        new UploadCreatedEvent(upload, input.uploadedByUserId),
      )
    }

    return upload
  }

  static delete(upload: Upload, deletedByUserId: UniqueEntityID) {
    upload.props.deletedAt = new Date()
    upload.touch()

    const deletedUpload = new Upload(upload.props, upload.id)

    deletedUpload.addDomainEvent(
      new UploadDeletedEvent(upload, deletedByUserId),
    )

    return deletedUpload
  }

  static retryFailedDataEvent(
    upload: Upload,
    requestedByUserId: UniqueEntityID,
  ) {
    const retryUpload = new Upload(upload.props, upload.id)

    retryUpload.addDomainEvent(
      new RetryFailedUploadedDataEvent(upload, requestedByUserId),
    )

    return retryUpload
  }
}

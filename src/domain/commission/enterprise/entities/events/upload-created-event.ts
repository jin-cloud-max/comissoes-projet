import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { Upload } from '../upload'

export class UploadCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public upload: Upload
  public uploadedByUserId: UniqueEntityID

  constructor(upload: Upload, uploadedByUserId: UniqueEntityID) {
    this.ocurredAt = new Date()
    this.upload = upload
    this.uploadedByUserId = uploadedByUserId
  }

  getAggregateId(): UniqueEntityID {
    return this.upload.id
  }
}

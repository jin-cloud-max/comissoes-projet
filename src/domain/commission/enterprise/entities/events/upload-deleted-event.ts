import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { Upload } from '../upload'

export class UploadDeletedEvent implements DomainEvent {
  public ocurredAt: Date
  public upload: Upload
  public deletedByUserId: UniqueEntityID

  constructor(upload: Upload, deletedByUserId: UniqueEntityID) {
    this.ocurredAt = new Date()
    this.upload = upload
    this.deletedByUserId = deletedByUserId
  }

  getAggregateId(): UniqueEntityID {
    return this.upload.id
  }
}

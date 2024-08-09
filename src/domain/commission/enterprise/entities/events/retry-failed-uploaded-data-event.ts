import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { Upload } from '../upload'

export class RetryFailedUploadedDataEvent implements DomainEvent {
  public ocurredAt: Date
  public upload: Upload
  public retryByUserId: UniqueEntityID

  constructor(upload: Upload, retryByUserId: UniqueEntityID) {
    this.ocurredAt = new Date()
    this.upload = upload
    this.retryByUserId = retryByUserId
  }

  getAggregateId(): UniqueEntityID {
    return this.upload.id
  }
}

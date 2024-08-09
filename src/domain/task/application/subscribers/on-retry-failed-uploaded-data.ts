import {
  type DomainEventCallback,
  DomainEvents,
} from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { RetryFailedUploadedDataEvent } from '@/domain/commission/enterprise/entities/events/retry-failed-uploaded-data-event'

import type { CreateTaskUseCase } from '../use-case/create-task'

export class OnRetryFailedUploadedData implements EventHandler {
  constructor(private createTask: CreateTaskUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.retryFailedUploadedData.bind(this) as DomainEventCallback,
      RetryFailedUploadedDataEvent.name,
    )
  }

  private async retryFailedUploadedData(input: RetryFailedUploadedDataEvent) {
    await this.createTask.execute({
      type: 'uploads.retry',
      title: `Reprocessamento de arquivo: ${input.upload.fileName}`,
      description: 'Reprocessamento dos dados do arquivo que deram erro.',
      createdByUserId: input.retryByUserId,
      context: {
        uploadId: input.upload.id.toString(),
      },
    })
  }
}

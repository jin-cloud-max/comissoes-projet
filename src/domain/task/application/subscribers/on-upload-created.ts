import {
  type DomainEventCallback,
  DomainEvents,
} from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { UploadCreatedEvent } from '@/domain/commission/enterprise/entities/events/upload-created-event'

import type { CreateTaskUseCase } from '../use-case/create-task'

export class OnUploadCreated implements EventHandler {
  constructor(private createTask: CreateTaskUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.createNewUploadTask.bind(this) as DomainEventCallback,
      UploadCreatedEvent.name,
    )
  }

  private async createNewUploadTask(input: UploadCreatedEvent) {
    await this.createTask.execute({
      type: 'uploads.new',
      title: `Novo upload: ${input.upload.fileName}`,
      description: 'Novo upload fechamento de comissões',
      createdByUserId: input.uploadedByUserId,
      context: {
        uploadId: input.upload.id.toString(),
      },
    })
  }
}

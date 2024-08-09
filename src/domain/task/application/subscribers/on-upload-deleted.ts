import {
  type DomainEventCallback,
  DomainEvents,
} from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import { UploadDeletedEvent } from '@/domain/commission/enterprise/entities/events/upload-deleted-event'

import type { CreateTaskUseCase } from '../use-case/create-task'

export class OnUploadDeleted implements EventHandler {
  constructor(private createTask: CreateTaskUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.deleteUploadTask.bind(this) as DomainEventCallback,
      UploadDeletedEvent.name,
    )
  }

  private async deleteUploadTask(input: UploadDeletedEvent) {
    await this.createTask.execute({
      type: 'uploads.delete',
      title: `Deletar arquivo: ${input.upload.fileName}`,
      description: 'Deletar arquivo fechamento de comissões',
      createdByUserId: input.deletedByUserId,
      context: {
        uploadId: input.upload.id.toString(),
      },
    })
  }
}

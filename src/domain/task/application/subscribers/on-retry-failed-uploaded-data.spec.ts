import { makeUpload } from 'test/factories/make-upload'
import { ImMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { waitFor } from 'test/utils/wait-for'
import type { MockInstance } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import { Upload } from '@/domain/commission/enterprise/entities/upload'

import {
  CreateTaskUseCase,
  type CreateTaskUseCaseInput,
  type CreateTaskUseCaseOutput,
} from '../use-case/create-task'
import { OnRetryFailedUploadedData } from './on-retry-failed-uploaded-data'

let inMemoryTasksRepository: ImMemoryTasksRepository
let createTaskUseCase: CreateTaskUseCase

let createTaskExecuteSpy: MockInstance<
  [CreateTaskUseCaseInput],
  Promise<CreateTaskUseCaseOutput>
>

describe('On Retry Failed Uploaded Data', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new ImMemoryTasksRepository()
    createTaskUseCase = new CreateTaskUseCase(inMemoryTasksRepository)

    createTaskExecuteSpy = vi.spyOn(createTaskUseCase, 'execute')

    new OnRetryFailedUploadedData(createTaskUseCase)
  })

  it('should create a new task when retry to create upload data', async () => {
    const upload = makeUpload({}, new UniqueEntityID())

    const retryUpload = Upload.retryFailedDataEvent(
      upload,
      new UniqueEntityID(),
    )

    DomainEvents.dispatchEventsForAggregate(retryUpload.id)

    await waitFor(() => {
      expect(createTaskExecuteSpy).toHaveBeenCalled()
    })
  })
})

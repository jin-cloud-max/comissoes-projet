import { makeUpload } from 'test/factories/make-upload'
import { removeUpload } from 'test/factories/remove-upload'
import { ImMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'
import { waitFor } from 'test/utils/wait-for'
import type { MockInstance } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import {
  CreateTaskUseCase,
  type CreateTaskUseCaseInput,
  type CreateTaskUseCaseOutput,
} from '../use-case/create-task'
import { OnUploadDeleted } from './on-upload-deleted'

let inMemoryTasksRepository: ImMemoryTasksRepository
let inMemoryUploadsRepository: InMemoryUploadsRepository
let createTaskUseCase: CreateTaskUseCase

let createTaskExecuteSpy: MockInstance<
  [CreateTaskUseCaseInput],
  Promise<CreateTaskUseCaseOutput>
>

describe('On Upload Deleted', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new ImMemoryTasksRepository()
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    createTaskUseCase = new CreateTaskUseCase(inMemoryTasksRepository)

    createTaskExecuteSpy = vi.spyOn(createTaskUseCase, 'execute')

    new OnUploadDeleted(createTaskUseCase)
  })

  it('should create a new task when an upload is deleted', async () => {
    const upload = makeUpload({}, new UniqueEntityID())

    const deleteUpload = removeUpload(upload)

    await inMemoryUploadsRepository.delete(deleteUpload)

    await waitFor(() => {
      expect(createTaskExecuteSpy).toHaveBeenCalled()
    })
  })
})

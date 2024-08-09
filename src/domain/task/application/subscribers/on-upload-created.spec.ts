import { makeUpload } from 'test/factories/make-upload'
import { ImMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'
import { waitFor } from 'test/utils/wait-for'
import type { MockInstance } from 'vitest'

import {
  CreateTaskUseCase,
  type CreateTaskUseCaseInput,
  type CreateTaskUseCaseOutput,
} from '../use-case/create-task'
import { OnUploadCreated } from './on-upload-created'

let inMemoryTasksRepository: ImMemoryTasksRepository
let inMemoryUploadsRepository: InMemoryUploadsRepository
let createTaskUseCase: CreateTaskUseCase

let createTaskExecuteSpy: MockInstance<
  [CreateTaskUseCaseInput],
  Promise<CreateTaskUseCaseOutput>
>

describe('On Upload Created', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new ImMemoryTasksRepository()
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    createTaskUseCase = new CreateTaskUseCase(inMemoryTasksRepository)

    createTaskExecuteSpy = vi.spyOn(createTaskUseCase, 'execute')

    new OnUploadCreated(createTaskUseCase)
  })

  it('should create a new task when an upload is created', async () => {
    const upload = makeUpload()

    await inMemoryUploadsRepository.create(upload)

    await waitFor(() => {
      expect(createTaskExecuteSpy).toHaveBeenCalled()
    })
  })
})

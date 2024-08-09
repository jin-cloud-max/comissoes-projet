import { makeClosure } from 'test/factories/make-closure'
import { makeUpload } from 'test/factories/make-upload'
import { InMemoryClosuresRepository } from 'test/repositories/in-memory-closures-repository'
import { InMemoryUploadErrorsRepository } from 'test/repositories/in-memory-upload-errors-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { ClosureIsNotOpenError } from '../errors/closure-is-not-open-error'
import { UploadDeletedError } from '../errors/upload-deleted-error'
import { RetryFailedUploadedDataUseCase } from './retry-failed-uploaded-data'

let inMemoryUploadsRepository: InMemoryUploadsRepository
let inMemoryUploadErrorsRepository: InMemoryUploadErrorsRepository
let inMemoryClosuresRepository: InMemoryClosuresRepository
let sut: RetryFailedUploadedDataUseCase

describe('Retry Failed Uploaded Data', () => {
  beforeEach(() => {
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    inMemoryUploadErrorsRepository = new InMemoryUploadErrorsRepository()
    inMemoryClosuresRepository = new InMemoryClosuresRepository()
    sut = new RetryFailedUploadedDataUseCase(
      inMemoryUploadsRepository,
      inMemoryUploadErrorsRepository,
      inMemoryClosuresRepository,
    )
  })

  it('should retry failed uploaded data', async () => {
    const closure = makeClosure({
      isOpen: true,
    })

    inMemoryClosuresRepository.items.push(closure)

    const upload = makeUpload({
      closure: closure.closure,
    })

    await inMemoryUploadsRepository.create(upload)

    const result = await sut.execute({
      uploadId: upload.id,
      requestedByUserId: new UniqueEntityID(),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not retry if upload does not exists', async () => {
    const result = await sut.execute({
      uploadId: new UniqueEntityID(),
      requestedByUserId: new UniqueEntityID(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not retry if closure is not open', async () => {
    const closure = makeClosure({
      isOpen: false,
    })

    inMemoryClosuresRepository.items.push(closure)

    const upload = makeUpload({
      closure: closure.closure,
    })

    await inMemoryUploadsRepository.create(upload)

    const result = await sut.execute({
      uploadId: upload.id,
      requestedByUserId: new UniqueEntityID(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClosureIsNotOpenError)
  })

  it('should not retry if upload is deleted', async () => {
    const closure = makeClosure({
      isOpen: true,
    })

    inMemoryClosuresRepository.items.push(closure)

    const upload = makeUpload({
      closure: closure.closure,
      deletedAt: new Date(),
    })

    await inMemoryUploadsRepository.create(upload)

    const result = await sut.execute({
      uploadId: upload.id,
      requestedByUserId: new UniqueEntityID(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UploadDeletedError)
  })
})

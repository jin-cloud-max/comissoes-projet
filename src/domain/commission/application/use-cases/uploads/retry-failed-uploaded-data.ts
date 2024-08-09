import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { DomainEvents } from '@/core/events/domain-events'
import { Upload } from '@/domain/commission/enterprise/entities/upload'

import type { ClosuresRepository } from '../../repositories/closures-repository'
import type { UploadErrorsRepository } from '../../repositories/upload-errors-repository'
import type { UploadsRepository } from '../../repositories/uploads-repository'
import { ClosureIsNotOpenError } from '../errors/closure-is-not-open-error'
import { UploadDeletedError } from '../errors/upload-deleted-error'

interface RetryFailedUploadedDataUseCaseInput {
  uploadId: UniqueEntityID
  requestedByUserId: UniqueEntityID
}

type RetryFailedUploadedDataUseCaseOutput = Either<
  ResourceNotFoundError | ClosureIsNotOpenError,
  null
>

export class RetryFailedUploadedDataUseCase {
  constructor(
    private uploadsRepository: UploadsRepository,
    private uploadErrorsRepository: UploadErrorsRepository,
    private closuresRepository: ClosuresRepository,
  ) {}

  async execute(
    input: RetryFailedUploadedDataUseCaseInput,
  ): Promise<RetryFailedUploadedDataUseCaseOutput> {
    const upload = await this.uploadsRepository.findById(
      input.uploadId.toString(),
    )

    if (!upload) {
      return left(
        new ResourceNotFoundError(`Upload: ${input.uploadId.toString()}`),
      )
    }

    const closure = await this.closuresRepository.findByDate(upload.closure)

    if (upload.deletedAt) {
      return left(new UploadDeletedError(`${input.uploadId.toString()}`))
    }

    if (!closure) {
      return left(
        new ResourceNotFoundError(`Closure: ${upload.closure.toString()}`),
      )
    }

    if (!closure.isOpen) {
      return left(new ClosureIsNotOpenError(upload.closure.toString()))
    }

    const totalUnsolvedErrors = await this.uploadErrorsRepository.count(
      upload.id.toString(),
      { solved: false },
    )

    if (totalUnsolvedErrors === 0) {
      return right(null)
    }

    const retryUpload = Upload.retryFailedDataEvent(
      upload,
      input.requestedByUserId,
    )

    DomainEvents.dispatchEventsForAggregate(retryUpload.id)

    return right(null)
  }
}

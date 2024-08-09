import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Upload } from '@/domain/commission/enterprise/entities/upload'

import type { ClosuresRepository } from '../../repositories/closures-repository'
import type { SourcesRepository } from '../../repositories/source-repository'
import type { UploadsRepository } from '../../repositories/uploads-repository'
import { ClosureIsNotOpenError } from '../errors/closure-is-not-open-error'
import type { CreateUploadUseCaseInput } from './create-upload'

export interface ReplaceUploadedFileUseCaseInput
  extends CreateUploadUseCaseInput {
  oldUploadId: UniqueEntityID
}

export type ReplaceUploadedFileUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    upload: Upload
  }
>

export class ReplaceUploadedFileUseCase {
  constructor(
    private uploadsRepository: UploadsRepository,
    private sourcesRepository: SourcesRepository,
    private closuresRepository: ClosuresRepository,
  ) {}

  async execute(
    input: ReplaceUploadedFileUseCaseInput,
  ): Promise<ReplaceUploadedFileUseCaseOutput> {
    const closure = await this.closuresRepository.findByDate(input.closure)

    if (!closure) {
      return left(new ResourceNotFoundError(`closure: ${input.closure}`))
    }

    if (!closure.isOpen) {
      return left(new ClosureIsNotOpenError(closure.closure.toString()))
    }

    const oldUpload = await this.uploadsRepository.findById(
      input.oldUploadId.toString(),
    )

    if (!oldUpload) {
      return left(
        new ResourceNotFoundError(`upload with id ${input.oldUploadId}`),
      )
    }

    const source = await this.sourcesRepository.findBySlug(
      input.sourceSlug.value,
    )

    if (!source) {
      return left(new ResourceNotFoundError(input.sourceSlug.value))
    }

    const deleteOldUpload = Upload.delete(oldUpload, input.uploadedByUserId)

    await this.uploadsRepository.delete(deleteOldUpload)

    const newUpload = Upload.create({
      source,
      closure: input.closure,
      fileKey: input.fileKey,
      fileName: input.fileName,
      sourceSlug: input.sourceSlug,
      uploadedByUserId: input.uploadedByUserId,
    })

    await this.uploadsRepository.create(newUpload)

    return right({ upload: newUpload })
  }
}

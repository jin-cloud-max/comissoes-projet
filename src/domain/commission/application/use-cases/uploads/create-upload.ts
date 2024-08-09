import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Upload } from '@/domain/commission/enterprise/entities/upload'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { ClosuresRepository } from '../../repositories/closures-repository'
import type { SourcesRepository } from '../../repositories/source-repository'
import type { UploadsRepository } from '../../repositories/uploads-repository'
import { ClosureIsNotOpenError } from '../errors/closure-is-not-open-error'

export interface CreateUploadUseCaseInput {
  fileKey: string
  fileName: string
  sourceSlug: Slug
  closure: Date
  uploadedByUserId: UniqueEntityID
}

type CreateUploadUseCaseOutput = Either<
  ResourceNotFoundError | ConflictError | ClosureIsNotOpenError,
  {
    upload: Upload
  }
>

export class CreateUploadUseCase {
  constructor(
    private uploadsRepository: UploadsRepository,
    private sourcesRepository: SourcesRepository,
    private closuresRepository: ClosuresRepository,
  ) {}

  async execute(
    input: CreateUploadUseCaseInput,
  ): Promise<CreateUploadUseCaseOutput> {
    const closure = await this.closuresRepository.findByDate(input.closure)

    if (!closure) {
      return left(new ResourceNotFoundError(`closure: ${input.closure}`))
    }

    if (!closure.isOpen) {
      return left(new ClosureIsNotOpenError(closure.closure.toString()))
    }

    const source = await this.sourcesRepository.findBySlug(
      input.sourceSlug.value,
    )

    if (!source) {
      return left(new ResourceNotFoundError(input.sourceSlug.value))
    }

    const upload = Upload.create({
      fileKey: input.fileKey,
      fileName: input.fileName,
      closure: input.closure,
      source,
      sourceSlug: input.sourceSlug,
      uploadedByUserId: input.uploadedByUserId,
    })

    const uploadAlreadyCreated = await this.uploadsRepository.findByFileKey(
      upload.fileKey,
    )

    if (uploadAlreadyCreated) {
      return left(new ConflictError())
    }

    await this.uploadsRepository.create(upload)

    return right({ upload })
  }
}

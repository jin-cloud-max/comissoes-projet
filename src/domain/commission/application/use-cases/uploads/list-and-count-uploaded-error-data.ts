import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { PaginationParamsInput } from '@/core/use-cases/pagination-params-input'
import type { PaginationParamsOutput } from '@/core/use-cases/pagination-params-output'
import type { UploadError } from '@/domain/commission/enterprise/entities/upload-error'

import type { UploadErrorsRepository } from '../../repositories/upload-errors-repository'
import type { UploadsRepository } from '../../repositories/uploads-repository'

type ListAndCountUploadedErrorDataUseCaseInput = PaginationParamsInput & {
  type?: string
  uploadId: UniqueEntityID
}

export type ListAndCountUploadedErrorDataUseCaseOutputData =
  PaginationParamsOutput & {
    errors: UploadError[]
  }

type ListAndCountUploadedErrorDataUseCaseOutput = Either<
  ResourceNotFoundError,
  ListAndCountUploadedErrorDataUseCaseOutputData
>

export class ListAndCountUploadedErrorDataUseCase {
  constructor(
    private readonly uploadErrorsRepository: UploadErrorsRepository,
    private readonly uploadsRepository: UploadsRepository,
  ) {}

  async execute(
    input: ListAndCountUploadedErrorDataUseCaseInput,
  ): Promise<ListAndCountUploadedErrorDataUseCaseOutput> {
    const upload = await this.uploadsRepository.findById(
      input.uploadId.toString(),
    )

    if (!upload) {
      return left(
        new ResourceNotFoundError(`Upload: ${input.uploadId.toString()}`),
      )
    }

    const errors = await this.uploadErrorsRepository.list(
      upload.id.toString(),
      {
        limit: input.limit,
        page: input.page,
      },
    )

    const count = await this.uploadErrorsRepository.count(upload.id.toString())

    return right({
      count,
      limit: input.limit,
      page: input.page,
      errors,
    })
  }
}

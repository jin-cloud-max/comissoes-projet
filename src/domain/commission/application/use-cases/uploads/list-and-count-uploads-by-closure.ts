import { type Either, right } from '@/core/either'
import type { PaginationParamsInput } from '@/core/use-cases/pagination-params-input'
import type { PaginationParamsOutput } from '@/core/use-cases/pagination-params-output'
import type { Upload } from '@/domain/commission/enterprise/entities/upload'

import type { UploadsRepository } from '../../repositories/uploads-repository'

type ListAndCountUploadsByClosureUseCaseInput = PaginationParamsInput & {
  closure: Date
}

type ListAndCountUploadsByClosureUseCaseOutputData = PaginationParamsOutput & {
  uploads: Upload[]
}

type ListAndCountUploadsByClosureUseCaseOutput = Either<
  null,
  ListAndCountUploadsByClosureUseCaseOutputData
>

export class ListAndCountUploadsByClosureUseCase {
  constructor(private uploadsRepository: UploadsRepository) {}

  async execute(
    input: ListAndCountUploadsByClosureUseCaseInput,
  ): Promise<ListAndCountUploadsByClosureUseCaseOutput> {
    const uploads = await this.uploadsRepository.listByClosure(input.closure, {
      limit: input.limit,
      page: input.page,
    })

    const count = await this.uploadsRepository.countByClosure(input.closure)

    return right({
      count,
      limit: input.limit,
      page: input.page,
      uploads,
    })
  }
}

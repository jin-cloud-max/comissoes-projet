import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Mapper } from '@/domain/commission/enterprise/entities/mapper'

import type { MappersRepository } from '../../repositories/mappers-repository'

interface GetMapperByIdUseCaseInput {
  mapperId: UniqueEntityID
}

type GetMapperByIdUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    mapper: Mapper
  }
>

export class GetMapperByIdUseCase {
  constructor(private mappersRepository: MappersRepository) {}

  async execute({
    mapperId,
  }: GetMapperByIdUseCaseInput): Promise<GetMapperByIdUseCaseOutput> {
    const mapper = await this.mappersRepository.findById(mapperId.toString())

    if (!mapper) {
      return left(new ResourceNotFoundError(`Mapper with id ${mapperId}`))
    }

    return right({ mapper })
  }
}

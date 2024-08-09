import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import type { MappersRepository } from '../../repositories/mappers-repository'

interface DeleteMapperUseCaseInput {
  mapperId: UniqueEntityID
}

type DeleteMapperUseCaseOutput = Either<ResourceNotFoundError, null>

export class DeleteMapperUseCase {
  constructor(private mappersRepository: MappersRepository) {}

  async execute(
    input: DeleteMapperUseCaseInput,
  ): Promise<DeleteMapperUseCaseOutput> {
    const mapper = await this.mappersRepository.findById(
      input.mapperId.toString(),
    )

    if (!mapper) {
      return left(new ResourceNotFoundError(`Mapper with id ${input.mapperId}`))
    }

    await this.mappersRepository.delete(mapper)

    return right(null)
  }
}

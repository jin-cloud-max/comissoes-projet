import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type {
  Condition,
  Mapper,
} from '@/domain/commission/enterprise/entities/mapper'

import type { MappersRepository } from '../../repositories/mappers-repository'

interface EditMapperUseCaseInput {
  mapperId: UniqueEntityID
  title: string
  mapField: string
  fromField: string
  mapValue: string
  value: string
  condition: Condition
}

type EditMapperUseCaseOutput = Either<ResourceNotFoundError, { mapper: Mapper }>

export class EditMapperUseCase {
  constructor(private mapperRepository: MappersRepository) {}

  async execute(
    input: EditMapperUseCaseInput,
  ): Promise<EditMapperUseCaseOutput> {
    const mapper = await this.mapperRepository.findById(
      input.mapperId.toString(),
    )

    if (!mapper) {
      return left(new ResourceNotFoundError())
    }

    mapper.title = input.title
    mapper.mapField = input.mapField
    mapper.fromField = input.fromField
    mapper.mapValue = input.mapValue
    mapper.value = input.value
    mapper.condition = input.condition

    await this.mapperRepository.update(mapper)

    return right({ mapper })
  }
}

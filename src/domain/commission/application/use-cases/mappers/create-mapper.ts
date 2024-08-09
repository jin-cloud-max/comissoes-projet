import { type Either, right } from '@/core/either'
import {
  Condition,
  Mapper,
} from '@/domain/commission/enterprise/entities/mapper'

import type { MappersRepository } from '../../repositories/mappers-repository'

interface CreateMapperUseCaseInput {
  title: string
  mapField: string
  fromField: string
  mapValue: string
  value: string
  condition: Condition
}

type CreateMapperUseCaseOutput = Either<null, { mapper: Mapper }>

export class CreateMapperUseCase {
  constructor(private mappersRepository: MappersRepository) {}

  async execute(
    input: CreateMapperUseCaseInput,
  ): Promise<CreateMapperUseCaseOutput> {
    const mapper = Mapper.create(input)

    await this.mappersRepository.create(mapper)

    return right({ mapper })
  }
}

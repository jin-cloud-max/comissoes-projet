import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import type { RulesRepository } from '../../repositories/rules-repository'

export interface DeleteRuleUseCaseInput {
  ruleId: UniqueEntityID
}

type DeleteRuleUseCaseOutput = Either<ResourceNotFoundError, null>

export class DeleteRuleUseCase {
  constructor(private readonly rulesRepository: RulesRepository) {}

  async execute({
    ruleId,
  }: DeleteRuleUseCaseInput): Promise<DeleteRuleUseCaseOutput> {
    const rule = await this.rulesRepository.findById(ruleId.toString())

    if (!rule) {
      return left(new ResourceNotFoundError())
    }

    await this.rulesRepository.delete(rule)

    return right(null)
  }
}

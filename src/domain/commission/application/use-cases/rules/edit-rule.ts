import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Rule } from '@/domain/commission/enterprise/entities/rule'
import { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { RulesRepository } from '../../repositories/rules-repository'

export interface EditRuleUseCaseInput {
  ruleId: UniqueEntityID
  name: string
  slug?: Slug
}

type EditRuleUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    rule: Rule
  }
>

export class EditRuleUseCase {
  constructor(private readonly rulesRepository: RulesRepository) {}

  async execute({
    ruleId,
    name,
    slug,
  }: EditRuleUseCaseInput): Promise<EditRuleUseCaseOutput> {
    const rule = await this.rulesRepository.findById(ruleId.toString())

    if (!rule) {
      return left(new ResourceNotFoundError())
    }

    rule.name = name
    rule.slug = slug ?? Slug.createFromText(name)

    await this.rulesRepository.edit(rule)

    return right({ rule })
  }
}

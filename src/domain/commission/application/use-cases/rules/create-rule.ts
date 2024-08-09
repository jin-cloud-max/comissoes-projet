import { type Either, left, right } from '@/core/either'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { Rule } from '@/domain/commission/enterprise/entities/rule'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { RulesRepository } from '../../repositories/rules-repository'

export interface CreateRuleUseCaseInput {
  name: string
  slug?: Slug
}

type CreateRuleUseCaseOutput = Either<
  ConflictError,
  {
    rule: Rule
  }
>

export class CreateRuleUseCase {
  constructor(private readonly rulesRepository: RulesRepository) {}

  async execute({
    name,
    slug,
  }: CreateRuleUseCaseInput): Promise<CreateRuleUseCaseOutput> {
    const rule = Rule.create({ name, slug })

    const ruleAlreadyExists = await this.rulesRepository.findBySlug(
      rule.slug.value,
    )

    if (ruleAlreadyExists) {
      return left(new ConflictError())
    }

    await this.rulesRepository.create(rule)

    return right({ rule })
  }
}

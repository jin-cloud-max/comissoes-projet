import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { Rule } from '@/domain/commission/enterprise/entities/rule'
import type { RuleCategory } from '@/domain/commission/enterprise/entities/rule-category'

import type { RuleCategoriesRepository } from '../../repositories/rule-categories-repository'
import type { RulesRepository } from '../../repositories/rules-repository'

export interface ListAndCountRuleCategoriesByRuleSlugUseCaseInput {
  page: number
  limit: number
  ruleSlug: string
}

type ListAndCountRuleCategoriesByRuleSlugUseCaseOutput = Either<
  ResourceNotFoundError,
  {
    count: number
    page: number
    limit: number
    ruleCategories: RuleCategory[]
  }
>

export class ListAndCountRuleCategoriesByRuleSlugUseCase {
  constructor(
    private readonly rulesRepository: RulesRepository,
    private readonly ruleCategoriesRepository: RuleCategoriesRepository,
  ) {}

  async execute({
    limit,
    page,
    ruleSlug,
  }: ListAndCountRuleCategoriesByRuleSlugUseCaseInput): Promise<ListAndCountRuleCategoriesByRuleSlugUseCaseOutput> {
    const rule = await this.rulesRepository.findBySlug(ruleSlug)

    if (!rule) {
      return left(new ResourceNotFoundError(ruleSlug))
    }

    const ruleCategories = await this.ruleCategoriesRepository.listByRuleSlug(
      ruleSlug,
      {
        limit,
        page,
      },
    )

    const count = await this.ruleCategoriesRepository.countByRuleSlug(ruleSlug)

    return right({ count, page, limit, ruleCategories })
  }
}

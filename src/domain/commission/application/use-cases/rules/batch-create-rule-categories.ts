import { type Either, right } from '@/core/either'
import { Category } from '@/domain/commission/enterprise/entities/category'
import { RuleCategory } from '@/domain/commission/enterprise/entities/rule-category'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { CategoriesRepository } from '../../repositories/categories-repository'
import type { RuleCategoriesRepository } from '../../repositories/rule-categories-repository'
import type { RulesRepository } from '../../repositories/rules-repository'

export interface BatchCreateRuleCategoriesUseCaseInput {
  ruleSlug: Slug
  categorySlug: Slug
  fee: number
}

type BatchCreateRuleCategoriesUseCaseOutput = Either<
  null,
  {
    totalRecordsCreated: number
  }
>

export class BatchCreateRuleCategoriesUseCase {
  constructor(
    private readonly ruleCategoriesRepository: RuleCategoriesRepository,
    private readonly rulesRepository: RulesRepository,
    private categoriesRepository: CategoriesRepository,
  ) {}

  async execute(
    data: BatchCreateRuleCategoriesUseCaseInput[],
  ): Promise<BatchCreateRuleCategoriesUseCaseOutput> {
    const batchRuleCategory: RuleCategory[] = []

    for await (const { categorySlug, ruleSlug, fee } of data) {
      const category = await this.categoriesRepository.findBySlug(
        categorySlug.value,
      )

      if (!category) continue

      const rule = await this.rulesRepository.findBySlug(ruleSlug.value)

      if (!rule) continue

      const ruleCategory = RuleCategory.create({
        categorySlug,
        ruleSlug,
        category: Category.create(category, category.id),
        fee,
      })

      batchRuleCategory.push(ruleCategory)
    }

    const createRuleCategories =
      await this.ruleCategoriesRepository.createBatch(batchRuleCategory)

    return right({ totalRecordsCreated: createRuleCategories })
  }
}

import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { RuleCategory } from '../../enterprise/entities/rule-category'

export interface FilterRuleCategories {
  rule?: string
}

export interface RuleCategoriesRepository {
  createBatch: (data: RuleCategory[]) => Promise<number>
  listByRuleSlug: (
    ruleSlug: string,
    params: PaginationParams,
  ) => Promise<RuleCategory[]>
  countByRuleSlug: (ruleSlug: string) => Promise<number>
}

import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Rule } from '../../enterprise/entities/rule'

export interface FilterRules {
  rule?: string
}

export interface RulesRepository {
  create: (rule: Rule) => Promise<void>
  findBySlug: (slug: string) => Promise<Rule | null>
  findById: (id: string) => Promise<Rule | null>
  delete: (rule: Rule) => Promise<void>
  edit: (rule: Rule) => Promise<void>
  list: (params: PaginationParams<FilterRules>) => Promise<Rule[]>
  count: (filterBy: FilterRules) => Promise<number>
}

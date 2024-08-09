import type { PaginationParams } from '@/core/repositories/pagination-params'
import type {
  FilterRules,
  RulesRepository,
} from '@/domain/commission/application/repositories/rules-repository'
import type { Rule } from '@/domain/commission/enterprise/entities/rule'

export class InMemoryRulesRepository implements RulesRepository {
  public items: Rule[] = []

  async create(rule: Rule): Promise<void> {
    this.items.push(rule)
  }

  async findBySlug(slug: string): Promise<Rule | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findById(id: string): Promise<Rule | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async delete(rule: Rule): Promise<void> {
    this.items = this.items.filter((item) => item.id !== rule.id)
  }

  async edit(rule: Rule): Promise<void> {
    const index = this.items.findIndex((item) => item.id === rule.id)

    this.items[index] = rule
  }

  async list(params: PaginationParams<FilterRules>): Promise<Rule[]> {
    const { page, limit, filterBy } = params

    return this.items
      .filter((item) => {
        if (filterBy && filterBy.rule) {
          return item.name.includes(filterBy.rule)
        }

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async count(filterBy: FilterRules): Promise<number> {
    return this.items.filter((item) => {
      if (filterBy && filterBy.rule) {
        return item.name.includes(filterBy.rule)
      }

      return true
    }).length
  }
}

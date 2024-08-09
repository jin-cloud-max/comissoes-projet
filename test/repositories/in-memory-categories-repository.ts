import type { PaginationParams } from '@/core/repositories/pagination-params'
import type {
  CategoriesRepository,
  FilterCategories,
} from '@/domain/commission/application/repositories/categories-repository'
import type { Category } from '@/domain/commission/enterprise/entities/category'

export class InMemoryCategoriesRepository implements CategoriesRepository {
  public items: Category[] = []

  async create(category: Category): Promise<void> {
    this.items.push(category)
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findById(id: string): Promise<Category | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async delete(category: Category): Promise<void> {
    this.items = this.items.filter((item) => item.id !== category.id)
  }

  async edit(category: Category): Promise<void> {
    const index = this.items.findIndex((item) => item.id === category.id)

    this.items[index] = category
  }

  async list(params: PaginationParams<FilterCategories>): Promise<Category[]> {
    const { page, limit, filterBy } = params

    return this.items
      .filter((item) => {
        if (filterBy && filterBy.category) {
          return item.category.includes(filterBy.category)
        }

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async count(filterBy: FilterCategories): Promise<number> {
    return this.items.filter((item) => {
      if (filterBy && filterBy.category) {
        return item.category.includes(filterBy.category)
      }

      return true
    }).length
  }
}

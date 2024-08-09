import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Category } from '../../enterprise/entities/category'

export interface FilterCategories {
  category?: string
}

export interface CategoriesRepository {
  create: (category: Category) => Promise<void>
  findBySlug: (slug: string) => Promise<Category | null>
  findById: (id: string) => Promise<Category | null>
  delete: (category: Category) => Promise<void>
  edit: (category: Category) => Promise<void>
  list: (params: PaginationParams<FilterCategories>) => Promise<Category[]>
  count: (filterBy: FilterCategories) => Promise<number>
}

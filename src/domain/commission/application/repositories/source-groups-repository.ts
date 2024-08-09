import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { SourceGroup } from '../../enterprise/entities/source-group'

export interface FilterSourceGroup {
  name?: string
}

export interface SourceGroupsRepository {
  create: (sourceGroup: SourceGroup) => Promise<void>
  findBySlug: (slug: string) => Promise<SourceGroup | null>
  findById: (id: string) => Promise<SourceGroup | null>
  delete: (sourceGroup: SourceGroup) => Promise<void>
  edit: (sourceGroup: SourceGroup) => Promise<void>
  list: (params: PaginationParams<FilterSourceGroup>) => Promise<SourceGroup[]>
  count: (filterBy: FilterSourceGroup) => Promise<number>
}

import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Source } from '../../enterprise/entities/source'

export interface FilterSource {
  source?: string
}

export interface SourcesRepository {
  create: (source: Source) => Promise<void>
  findBySlug: (slug: string) => Promise<Source | null>
  findById: (id: string) => Promise<Source | null>
  delete: (source: Source) => Promise<void>
  edit: (source: Source) => Promise<void>
  listBySourceGroupId: (
    sourceGroupId: string,
    params: PaginationParams<FilterSource>,
  ) => Promise<Source[]>
  countBySourceGroupId: (
    sourceGroupId: string,
    filterBy: FilterSource,
  ) => Promise<number>
}

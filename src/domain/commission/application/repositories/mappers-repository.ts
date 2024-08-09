import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Mapper } from '../../enterprise/entities/mapper'

export interface ListMappersFilterBy {
  title?: string
}

export interface MappersRepository {
  create: (mapper: Mapper) => Promise<void>
  delete: (mapper: Mapper) => Promise<void>
  update: (mapper: Mapper) => Promise<Mapper>
  list: (params: PaginationParams<ListMappersFilterBy>) => Promise<Mapper[]>
  count: (filterBy?: ListMappersFilterBy) => Promise<number>
  findById: (id: string) => Promise<Mapper | null>
}

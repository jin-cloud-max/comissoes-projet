import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Collaborator } from '../../enterprise/entities/collaborator'

export interface CollaboratorsRepository {
  create: (collaborator: Collaborator) => Promise<void>
  listByOrgId: (
    params: PaginationParams<{ search?: string; organizationId: string }>,
  ) => Promise<Collaborator[]>
  countByOrgId: (filterBy: {
    search?: string
    organizationId: string
  }) => Promise<number>
  findByIdAndOrgId: (id: string, orgId: string) => Promise<Collaborator | null>
  findByCode: (code: string) => Promise<Collaborator | null>
  findByEmail: (email: string) => Promise<Collaborator | null>
  update: (collaborator: Collaborator) => Promise<void>
}

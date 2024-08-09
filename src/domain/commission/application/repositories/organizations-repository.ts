import type { Organization } from '../../enterprise/entities/organization'

export interface OrganizationsRepository {
  create: (organization: Organization) => Promise<void>
  findBySlug: (slug: string) => Promise<Organization | null>
  findById: (id: string) => Promise<Organization | null>
}

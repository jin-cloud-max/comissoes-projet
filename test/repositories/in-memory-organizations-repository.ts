import type { OrganizationsRepository } from '@/domain/commission/application/repositories/organizations-repository'
import type { Organization } from '@/domain/commission/enterprise/entities/organization'

export class InMemoryOrganizationsRepository
  implements OrganizationsRepository {
  public items: Organization[] = []

  async create(organization: Organization): Promise<void> {
    this.items.push(organization)
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findById(id: string): Promise<Organization | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }
}

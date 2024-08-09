import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { CollaboratorsRepository } from '@/domain/commission/application/repositories/collaborators-repository'
import type { Collaborator } from '@/domain/commission/enterprise/entities/collaborator'

export class InMemoryCollaboratorsRepository
  implements CollaboratorsRepository {
  public items: Collaborator[] = []

  async create(collaborator: Collaborator): Promise<void> {
    this.items.push(collaborator)
  }

  async listByOrgId(
    params: PaginationParams<{ search?: string; organizationId: string }>,
  ): Promise<Collaborator[]> {
    const { page, limit, filterBy } = params

    return this.items
      .filter((item) => {
        if (filterBy && filterBy.search) {
          if (
            item.code?.includes(filterBy.search) &&
            item.orgId?.toValue() === params.filterBy?.organizationId
          ) {
            return true
          }

          if (
            item.email.value.includes(filterBy.search.toLowerCase()) &&
            item.orgId?.toValue() === params.filterBy?.organizationId
          ) {
            return true
          }

          if (
            item.name.includes(filterBy.search) &&
            item.orgId?.toValue() === params.filterBy?.organizationId
          ) {
            return true
          }

          return false
        }

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async countByOrgId(filterBy: {
    search?: string
    organizationId: string
  }): Promise<number> {
    return this.items.filter((item) => {
      if (filterBy && filterBy.search) {
        if (
          item.code?.includes(filterBy.search) &&
          item.orgId?.toValue() === filterBy.organizationId
        )
          return true

        if (
          item.email.value.includes(filterBy.search.toLowerCase()) &&
          item.orgId?.toValue() === filterBy.organizationId
        )
          return true

        if (
          item.name.includes(filterBy.search) &&
          item.orgId?.toValue() === filterBy.organizationId
        )
          return true

        return false
      }

      return true
    }).length
  }

  async findByIdAndOrgId(
    id: string,
    orgId: string,
  ): Promise<Collaborator | null> {
    return (
      this.items.find(
        (item) => item.id.toString() === id && item.orgId?.toString() === orgId,
      ) ?? null
    )
  }

  async findByCode(code: string): Promise<Collaborator | null> {
    return this.items.find((item) => item.code === code) ?? null
  }

  async findByEmail(email: string): Promise<Collaborator | null> {
    return this.items.find((item) => item.email.value === email) ?? null
  }

  async update(collaborator: Collaborator): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === collaborator.id.toString(),
    )

    this.items[index] = collaborator
  }
}

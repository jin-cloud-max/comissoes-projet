import type { PaginationParams } from '@/core/repositories/pagination-params'
import type {
  FilterSourceGroup,
  SourceGroupsRepository,
} from '@/domain/commission/application/repositories/source-groups-repository'
import type { SourceGroup } from '@/domain/commission/enterprise/entities/source-group'

export class InMemorySourceGroupsRepository implements SourceGroupsRepository {
  public items: SourceGroup[] = []

  async create(sourceGroup: SourceGroup): Promise<void> {
    this.items.push(sourceGroup)
  }

  async findBySlug(slug: string): Promise<SourceGroup | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findById(id: string): Promise<SourceGroup | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async delete(sourceGroup: SourceGroup): Promise<void> {
    this.items = this.items.filter((item) => item.id !== sourceGroup.id)
  }

  async edit(sourceGroup: SourceGroup): Promise<void> {
    const index = this.items.findIndex((item) => item.id === sourceGroup.id)

    this.items[index] = sourceGroup
  }

  async list(
    params: PaginationParams<FilterSourceGroup>,
  ): Promise<SourceGroup[]> {
    const { page, limit, filterBy } = params

    return this.items
      .filter((item) => {
        if (filterBy && filterBy.name) {
          return item.name.includes(filterBy.name)
        }

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async count(filterBy: FilterSourceGroup): Promise<number> {
    return this.items.filter((item) => {
      if (filterBy && filterBy.name) {
        return item.name.includes(filterBy.name)
      }

      return true
    }).length
  }
}

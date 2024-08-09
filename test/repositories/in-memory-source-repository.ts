import type { PaginationParams } from '@/core/repositories/pagination-params'
import type {
  FilterSource,
  SourcesRepository,
} from '@/domain/commission/application/repositories/source-repository'
import type { Source } from '@/domain/commission/enterprise/entities/source'

export class InMemorySourcesRepository implements SourcesRepository {
  public items: Source[] = []

  async create(source: Source): Promise<void> {
    this.items.push(source)
  }

  async findBySlug(slug: string): Promise<Source | null> {
    return this.items.find((item) => item.slug.value === slug) ?? null
  }

  async findById(id: string): Promise<Source | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async delete(source: Source): Promise<void> {
    this.items = this.items.filter((item) => item.id !== source.id)
  }

  async edit(source: Source): Promise<void> {
    const index = this.items.findIndex((item) => item.id === source.id)

    this.items[index] = source
  }

  async listBySourceGroupId(
    sourceGroupId: string,
    params: PaginationParams<FilterSource>,
  ): Promise<Source[]> {
    const { page, limit, filterBy } = params

    const filteredItems = this.items.filter(
      (item) => item.sourceGroupId?.toString() === sourceGroupId,
    )

    return filteredItems
      .filter((item) => {
        if (filterBy && filterBy.source) {
          return item.source.includes(filterBy.source)
        }

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async countBySourceGroupId(
    sourceGroupId: string,
    filterBy: FilterSource,
  ): Promise<number> {
    const filteredItems = this.items.filter(
      (item) => item.sourceGroupId?.toString() === sourceGroupId,
    )

    return filteredItems.filter((item) => {
      if (filterBy && filterBy.source) {
        return item.source.includes(filterBy.source)
      }

      return true
    }).length
  }
}

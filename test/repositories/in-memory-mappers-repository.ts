import type { PaginationParams } from '@/core/repositories/pagination-params'
import type {
  ListMappersFilterBy,
  MappersRepository,
} from '@/domain/commission/application/repositories/mappers-repository'
import type { Mapper } from '@/domain/commission/enterprise/entities/mapper'

export class InMemoryMappersRepository implements MappersRepository {
  public items: Mapper[] = []

  async create(mapper: Mapper): Promise<void> {
    this.items.push(mapper)
  }

  async findById(id: string): Promise<Mapper | null> {
    return this.items.find((item) => item.id.toString() === id) ?? null
  }

  async delete(mapper: Mapper): Promise<void> {
    this.items = this.items.filter((item) => item.id !== mapper.id)
  }

  async update(mapper: Mapper): Promise<Mapper> {
    const index = this.items.findIndex((item) => item.id === mapper.id)
    this.items[index] = mapper
    return this.items[index]
  }

  async list(params: PaginationParams<ListMappersFilterBy>): Promise<Mapper[]> {
    const { page, limit, filterBy } = params

    if (filterBy) {
      return this.items
        .filter((item) => {
          if (filterBy.title) {
            return item.title.includes(filterBy.title)
          }
          return true
        })
        .slice((page - 1) * limit, page * limit)
    }

    return this.items
  }

  async count(filterBy?: ListMappersFilterBy): Promise<number> {
    if (filterBy) {
      return this.items.filter((item) => {
        if (filterBy.title) {
          return item.title.includes(filterBy.title)
        }
        return true
      }).length
    }

    return this.items.length
  }
}

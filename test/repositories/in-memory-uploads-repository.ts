import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { UploadsRepository } from '@/domain/commission/application/repositories/uploads-repository'
import type { Upload } from '@/domain/commission/enterprise/entities/upload'

export class InMemoryUploadsRepository implements UploadsRepository {
  public items: Upload[] = []

  async create(upload: Upload): Promise<void> {
    this.items.push(upload)

    DomainEvents.dispatchEventsForAggregate(upload.id)
  }

  async findByFileKey(fileKey: string): Promise<Upload | null> {
    return this.items.find((upload) => upload.fileKey === fileKey) || null
  }

  async findById(id: string): Promise<Upload | null> {
    return (
      this.items.find((upload) => upload.id.equals(new UniqueEntityID(id))) ||
      null
    )
  }

  async delete(upload: Upload): Promise<void> {
    const index = this.items.findIndex((item) => item.id === upload.id)

    this.items[index] = upload

    DomainEvents.dispatchEventsForAggregate(upload.id)
  }

  async listByClosure(
    closure: Date,
    params: PaginationParams,
  ): Promise<Upload[]> {
    const { page, limit } = params

    return this.items
      .filter((item) => {
        // if (filterBy && filterBy.rule) {
        //   return item.name.includes(filterBy.rule)
        // }

        if (item.closure.toDateString() !== closure.toDateString()) return false

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async countByClosure(closure: Date): Promise<number> {
    return this.items.filter(
      (item) => item.closure.toDateString() === closure.toDateString(),
    ).length
  }
}

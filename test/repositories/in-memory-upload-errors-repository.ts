import type { PaginationParams } from '@/core/repositories/pagination-params'
import type {
  UploadErrorsFilterBy,
  UploadErrorsRepository,
} from '@/domain/commission/application/repositories/upload-errors-repository'
import type { UploadError } from '@/domain/commission/enterprise/entities/upload-error'

export class InMemoryUploadErrorsRepository implements UploadErrorsRepository {
  public items: UploadError[] = []

  async list(uploadId: string, params: PaginationParams<UploadErrorsFilterBy>) {
    const { limit, page, filterBy } = params

    return this.items
      .filter((error) => {
        if (filterBy && filterBy.solved) {
          return error.solved === filterBy.solved
        }

        if (error.uploadId.toString() !== uploadId) return false

        return true
      })
      .slice((page - 1) * limit, page * limit)
  }

  async count(uploadId: string, filterBy?: UploadErrorsFilterBy) {
    const filteredItems = this.items.filter(
      (item) => item.uploadId.toString() === uploadId,
    )

    if (filterBy && filterBy.solved) {
      return filteredItems.filter((item) => item.solved === filterBy.solved)
        .length
    }

    return filteredItems.length
  }
}

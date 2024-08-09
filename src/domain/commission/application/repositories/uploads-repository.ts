import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { Upload } from '../../enterprise/entities/upload'

export interface UploadsRepository {
  create: (upload: Upload) => Promise<void>
  delete: (upload: Upload) => Promise<void>
  listByClosure: (closure: Date, params: PaginationParams) => Promise<Upload[]>
  countByClosure: (closure: Date) => Promise<number>
  findById: (id: string) => Promise<Upload | null>
  findByFileKey: (fileKey: string) => Promise<Upload | null>
}

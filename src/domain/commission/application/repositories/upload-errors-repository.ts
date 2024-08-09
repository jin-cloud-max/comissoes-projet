import type { PaginationParams } from '@/core/repositories/pagination-params'

import type { UploadError } from '../../enterprise/entities/upload-error'

export interface UploadErrorsFilterBy {
  solved?: boolean
}

export interface UploadErrorsRepository {
  list: (
    uploadId: string,
    params: PaginationParams<UploadErrorsFilterBy>,
  ) => Promise<UploadError[]>
  count: (uploadId: string, filterBy?: UploadErrorsFilterBy) => Promise<number>
}

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Upload } from '@/domain/commission/enterprise/entities/upload'

export function removeUpload(upload: Upload) {
  const deleteUpload = Upload.delete(upload, new UniqueEntityID())

  return deleteUpload
}

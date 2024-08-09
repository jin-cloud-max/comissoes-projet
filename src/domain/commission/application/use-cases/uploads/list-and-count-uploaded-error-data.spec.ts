import { makeUpload } from 'test/factories/make-upload'
import { makeUploadError } from 'test/factories/make-upload-error'
import { InMemoryUploadErrorsRepository } from 'test/repositories/in-memory-upload-errors-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'

import {
  ListAndCountUploadedErrorDataUseCase,
  type ListAndCountUploadedErrorDataUseCaseOutputData,
} from './list-and-count-uploaded-error-data'

let inMemoryUploadsRepository: InMemoryUploadsRepository
let inMemoryUploadErrorsRepository: InMemoryUploadErrorsRepository
let sut: ListAndCountUploadedErrorDataUseCase

describe('List and Count Uploaded Error Data', () => {
  beforeEach(() => {
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    inMemoryUploadErrorsRepository = new InMemoryUploadErrorsRepository()
    sut = new ListAndCountUploadedErrorDataUseCase(
      inMemoryUploadErrorsRepository,
      inMemoryUploadsRepository,
    )
  })

  it('should list and count uploaded error data', async () => {
    const upload = makeUpload()

    await inMemoryUploadsRepository.create(upload)

    const limit = 10
    const page = 1

    const uploadError = Array.from({ length: 20 }, () => {
      return makeUploadError({
        uploadId: upload.id,
      })
    })

    inMemoryUploadErrorsRepository.items.push(...uploadError)

    const result = await sut.execute({ uploadId: upload.id, limit, page })

    expect(result.isRight()).toBeTruthy()

    expect(
      (result.value as ListAndCountUploadedErrorDataUseCaseOutputData)?.count,
    ).toBe(20)
    expect(
      (result.value as ListAndCountUploadedErrorDataUseCaseOutputData)?.limit,
    ).toBe(10)
    expect(
      (result.value as ListAndCountUploadedErrorDataUseCaseOutputData)?.page,
    ).toBe(1)
  })
})

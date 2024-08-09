import { makeClosure } from 'test/factories/make-closure'
import { makeUpload } from 'test/factories/make-upload'
import { InMemoryClosuresRepository } from 'test/repositories/in-memory-closures-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'

import { ListAndCountUploadsByClosureUseCase } from './list-and-count-uploads-by-closure'

let inMemoryClosuresRepository: InMemoryClosuresRepository
let inMemoryUploadsRepository: InMemoryUploadsRepository
let sut: ListAndCountUploadsByClosureUseCase

describe('List and Count Uploads by Closure', () => {
  beforeEach(() => {
    inMemoryClosuresRepository = new InMemoryClosuresRepository()
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    sut = new ListAndCountUploadsByClosureUseCase(inMemoryUploadsRepository)
  })

  it('should list and count uploads by closure', async () => {
    const closure = makeClosure()

    inMemoryClosuresRepository.items.push(closure)

    const limit = 10
    const page = 1

    const uploads = Array.from({ length: 20 }, () => {
      return makeUpload({
        closure: closure.closure,
      })
    })

    await Promise.all(
      uploads.map((upload) => inMemoryUploadsRepository.create(upload)),
    )

    const result = await sut.execute({ closure: closure.closure, limit, page })

    expect(result.isRight()).toBeTruthy()

    expect(result.value?.count).toBe(20)
    expect(result.value?.limit).toBe(10)
    expect(result.value?.page).toBe(1)
  })
})

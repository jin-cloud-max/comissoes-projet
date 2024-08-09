import { makeClosure } from 'test/factories/make-closure'
import { makeSource } from 'test/factories/make-source'
import { makeUpload } from 'test/factories/make-upload'
import { InMemoryClosuresRepository } from 'test/repositories/in-memory-closures-repository'
import { InMemorySourcesRepository } from 'test/repositories/in-memory-source-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { ClosureIsNotOpenError } from '../errors/closure-is-not-open-error'
import { ReplaceUploadedFileUseCase } from './replace-uploaded-file'

let inMemoryUploadsRepository: InMemoryUploadsRepository
let inMemorySourcesRepository: InMemorySourcesRepository
let inMemoryClosuresRepository: InMemoryClosuresRepository
let sut: ReplaceUploadedFileUseCase

describe('Replace Uploaded File', () => {
  beforeEach(() => {
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    inMemorySourcesRepository = new InMemorySourcesRepository()
    inMemoryClosuresRepository = new InMemoryClosuresRepository()
    sut = new ReplaceUploadedFileUseCase(
      inMemoryUploadsRepository,
      inMemorySourcesRepository,
      inMemoryClosuresRepository,
    )
  })

  it('should replace the uploaded file', async () => {
    const source = makeSource()

    const closure = makeClosure({
      isOpen: true,
    })

    inMemoryClosuresRepository.items.push(closure)

    inMemorySourcesRepository.items.push(source)

    const oldUpload = makeUpload()

    inMemoryUploadsRepository.items.push(oldUpload)

    const result = await sut.execute({
      fileKey: 'new-file-key',
      fileName: 'new-file-name',
      oldUploadId: oldUpload.id,
      closure: closure.closure,
      sourceSlug: source.slug,
      uploadedByUserId: new UniqueEntityID(),
    })

    const deletedUpload = inMemoryUploadsRepository.items.find(
      (upload) => upload.deletedAt !== undefined,
    )

    expect(result.isRight()).toBe(true)
    expect(inMemoryUploadsRepository.items).toHaveLength(2)
    expect(deletedUpload).toBeDefined()
  })

  it('should return an error if the old upload does not exist', async () => {
    const source = makeSource()

    inMemorySourcesRepository.items.push(source)

    const result = await sut.execute({
      fileKey: 'new-file-key',
      fileName: 'new-file-name',
      closure: new Date(),
      oldUploadId: new UniqueEntityID(),
      sourceSlug: source.slug,
      uploadedByUserId: new UniqueEntityID(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an error if the closure is not open', async () => {
    const source = makeSource()

    const closure = makeClosure({
      isOpen: false,
    })

    inMemoryClosuresRepository.items.push(closure)

    inMemorySourcesRepository.items.push(source)

    const oldUpload = makeUpload()

    inMemoryUploadsRepository.items.push(oldUpload)

    const result = await sut.execute({
      fileKey: 'new-file-key',
      fileName: 'new-file-name',
      oldUploadId: oldUpload.id,
      closure: closure.closure,
      sourceSlug: source.slug,
      uploadedByUserId: new UniqueEntityID(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClosureIsNotOpenError)
  })
})

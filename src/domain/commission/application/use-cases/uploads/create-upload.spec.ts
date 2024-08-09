import { makeClosure } from 'test/factories/make-closure'
import { makeSource } from 'test/factories/make-source'
import { InMemoryClosuresRepository } from 'test/repositories/in-memory-closures-repository'
import { InMemorySourcesRepository } from 'test/repositories/in-memory-source-repository'
import { InMemoryUploadsRepository } from 'test/repositories/in-memory-uploads-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ClosureIsNotOpenError } from '../errors/closure-is-not-open-error'
import { CreateUploadUseCase } from './create-upload'

let inMemoryUploadsRepository: InMemoryUploadsRepository
let inMemorySourcesRepository: InMemorySourcesRepository
let inMemoryClosuresRepository: InMemoryClosuresRepository
let sut: CreateUploadUseCase

describe('Create Upload', () => {
  beforeEach(() => {
    inMemoryUploadsRepository = new InMemoryUploadsRepository()
    inMemorySourcesRepository = new InMemorySourcesRepository()
    inMemoryClosuresRepository = new InMemoryClosuresRepository()
    sut = new CreateUploadUseCase(
      inMemoryUploadsRepository,
      inMemorySourcesRepository,
      inMemoryClosuresRepository,
    )
  })

  test('it should be able to create a new upload', async () => {
    const source = makeSource()

    const closure = makeClosure({
      isOpen: true,
    })

    inMemoryClosuresRepository.items.push(closure)

    inMemorySourcesRepository.items.push(source)

    const result = await sut.execute({
      fileKey: 'file-key',
      fileName: 'file-name',
      sourceSlug: source.slug,
      uploadedByUserId: new UniqueEntityID(),
      closure: closure.closure,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUploadsRepository.items).toHaveLength(1)
  })

  it('should not be able to create a new upload if the closure is not open', async () => {
    const source = makeSource()

    const closure = makeClosure({
      isOpen: false,
    })

    inMemoryClosuresRepository.items.push(closure)

    inMemorySourcesRepository.items.push(source)

    const result = await sut.execute({
      fileKey: 'file-key',
      fileName: 'file-name',
      sourceSlug: source.slug,
      uploadedByUserId: new UniqueEntityID(),
      closure: closure.closure,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClosureIsNotOpenError)
  })
})

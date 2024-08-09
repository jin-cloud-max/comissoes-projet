import { makeCollaborator } from 'test/factories/make-collaborator'
import { InMemoryCollaboratorsRepository } from 'test/repositories/in-memory-collaborators-repository'

import { ConflictError } from '@/core/errors/errors/conflict-error'
import { InvalidEmailError } from '@/core/errors/errors/invalid-email-error'

import { CreateCollaboratorUseCase } from './create-collaborator'

let inMemoryCollaboratorsRepository: InMemoryCollaboratorsRepository
let sut: CreateCollaboratorUseCase

describe('Create Collaborator', () => {
  beforeEach(() => {
    inMemoryCollaboratorsRepository = new InMemoryCollaboratorsRepository()
    sut = new CreateCollaboratorUseCase(inMemoryCollaboratorsRepository)
  })

  it('should create a collaborator', async () => {
    const result = await sut.execute({
      name: 'name',
      email: 'test@email.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCollaboratorsRepository.items).toHaveLength(1)
  })

  it('should not create a collaborator with invalid e-mail', async () => {
    const result = await sut.execute({
      name: 'name',
      email: 'test@email',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEmailError)
  })

  it('should not create a collaborator with same e-mail', async () => {
    const collaborator = makeCollaborator()

    inMemoryCollaboratorsRepository.items.push(collaborator)

    const result = await sut.execute({
      name: 'name',
      email: collaborator.email.value,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })

  it('should not create a collaborators with same code', async () => {
    const collaborator = makeCollaborator()

    inMemoryCollaboratorsRepository.items.push(collaborator)

    const result = await sut.execute({
      name: 'name',
      email: 'email@email.com',
      code: collaborator.code,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})

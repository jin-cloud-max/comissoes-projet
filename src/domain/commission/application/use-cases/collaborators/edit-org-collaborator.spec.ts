import { makeCollaborator } from 'test/factories/make-collaborator'
import { makeOrganization } from 'test/factories/make-organization'
import { InMemoryCollaboratorsRepository } from 'test/repositories/in-memory-collaborators-repository'
import { InMemoryOrganizationsRepository } from 'test/repositories/in-memory-organizations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Email } from '@/domain/commission/enterprise/entities/value-object/email'

import { EditCollaboratorUseCase } from './edit-org-collaborator'

let inMemoryCollaboratorsRepository: InMemoryCollaboratorsRepository
let inMemoryOrganizationsRepository: InMemoryOrganizationsRepository
let sut: EditCollaboratorUseCase

describe('Edit Collaborator', () => {
  beforeEach(() => {
    inMemoryCollaboratorsRepository = new InMemoryCollaboratorsRepository()
    inMemoryOrganizationsRepository = new InMemoryOrganizationsRepository()
    sut = new EditCollaboratorUseCase(
      inMemoryCollaboratorsRepository,
      inMemoryOrganizationsRepository,
    )
  })

  test('it should be able to edit a collaborator', async () => {
    const org = makeOrganization()

    await inMemoryOrganizationsRepository.create(org)

    const collaborator = makeCollaborator({ organizationId: org.id })

    await inMemoryCollaboratorsRepository.create(collaborator)

    const result = await sut.execute({
      collaboratorId: collaborator.id,
      email: Email.create('email@email.com'),
      name: 'Collaborator name edited',
      organizationId: org.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCollaboratorsRepository.items[0].email).toEqual(
      Email.create('email@email.com'),
    )
  })

  test('it should not be able to edit a collaborator that does not exists', async () => {
    const result = await sut.execute({
      collaboratorId: new UniqueEntityID('invalid-id'),
      email: Email.create('email@email.com'),
      name: 'Collaborator name edited',
      organizationId: new UniqueEntityID('invalid-id'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

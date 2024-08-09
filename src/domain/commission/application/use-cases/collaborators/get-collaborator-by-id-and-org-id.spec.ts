import { makeCollaborator } from 'test/factories/make-collaborator'
import { makeOrganization } from 'test/factories/make-organization'
import { InMemoryCollaboratorsRepository } from 'test/repositories/in-memory-collaborators-repository'

import type { Collaborator } from '@/domain/commission/enterprise/entities/collaborator'

import { GetCollaboratorByIdUseCase } from './get-collaborator-by-id-and-org-id'

let inMemoryCollaboratorsRepository: InMemoryCollaboratorsRepository
let sut: GetCollaboratorByIdUseCase

describe('Get collaborator by ID and organization ID', () => {
  beforeEach(() => {
    inMemoryCollaboratorsRepository = new InMemoryCollaboratorsRepository()
    sut = new GetCollaboratorByIdUseCase(inMemoryCollaboratorsRepository)
  })

  it('should return a collaborator by id', async () => {
    const org = makeOrganization()

    const collaborator = makeCollaborator({ organizationId: org.id })

    inMemoryCollaboratorsRepository.items.push(collaborator)

    const result = await sut.execute({
      collaboratorId: collaborator.id,
      organizationId: org.id,
    })

    const { value } = result as { value: { collaborator: Collaborator } }

    expect(result.isRight()).toBe(true)
    expect(value.collaborator).toEqual(collaborator)
  })
})

import { makeCollaborator } from 'test/factories/make-collaborator'
import { makeOrganization } from 'test/factories/make-organization'
import { InMemoryOrganizationsRepository } from 'test/repositories/in-memory-organizations-repository'

import { ConflictError } from '@/core/errors/errors/conflict-error'

import { CreateOrganizationUseCase } from './create-organizations'

let inMemoryOrganizationsRepository: InMemoryOrganizationsRepository
let sut: CreateOrganizationUseCase

describe('Create Organization', () => {
  beforeEach(() => {
    inMemoryOrganizationsRepository = new InMemoryOrganizationsRepository()
    sut = new CreateOrganizationUseCase(inMemoryOrganizationsRepository)
  })

  it('should create a new organization', async () => {
    const collaborator = makeCollaborator()

    const result = await sut.execute({
      name: 'New organization',
      ownerId: collaborator.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrganizationsRepository.items).toHaveLength(1)
  })

  it('should not create two or more organizations with the same slug', async () => {
    const owner = makeCollaborator()
    const organization = makeOrganization({ ownerId: owner.id })

    inMemoryOrganizationsRepository.items.push(organization)

    const result = await sut.execute({
      name: organization.name,
      slug: organization.slug,
      ownerId: owner.id,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ConflictError)
  })
})

import { makeCollaborator } from 'test/factories/make-collaborator'
import { makeOrganization } from 'test/factories/make-organization'
import { InMemoryCollaboratorsRepository } from 'test/repositories/in-memory-collaborators-repository'

import { Email } from '@/domain/commission/enterprise/entities/value-object/email'

import { ListAndCountCollaboratorsByOrgIdUseCase } from './list-and-count-collaborators-by-org-id'

let inMemoryCollaboratorsRepository: InMemoryCollaboratorsRepository
let sut: ListAndCountCollaboratorsByOrgIdUseCase

describe('List and Count', () => {
  beforeEach(() => {
    inMemoryCollaboratorsRepository = new InMemoryCollaboratorsRepository()
    sut = new ListAndCountCollaboratorsByOrgIdUseCase(
      inMemoryCollaboratorsRepository,
    )
  })

  test('it should be able to list and count collaborators', async () => {
    const org = makeOrganization()

    await inMemoryCollaboratorsRepository.create(
      makeCollaborator({ organizationId: org.id }),
    )
    await inMemoryCollaboratorsRepository.create(
      makeCollaborator({ organizationId: org.id }),
    )
    await inMemoryCollaboratorsRepository.create(
      makeCollaborator({ organizationId: org.id }),
    )

    const result = await sut.execute({
      limit: 10,
      page: 1,
      organizationId: org.id,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCollaboratorsRepository.items).toHaveLength(3)
  })

  test('it should not be able to list and count paginated collaborators', async () => {
    const org = makeOrganization()

    for (let i = 0; i < 22; i++) {
      await inMemoryCollaboratorsRepository.create(makeCollaborator())
    }

    const result = await sut.execute({
      limit: 10,
      page: 3,
      organizationId: org.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.collaborators).toHaveLength(2)
  })

  test('it should be able to list and count collaborators and filter by search', async () => {
    const org = makeOrganization()

    await inMemoryCollaboratorsRepository.create(
      makeCollaborator({ name: 'John', organizationId: org.id }),
    )
    await inMemoryCollaboratorsRepository.create(
      makeCollaborator({
        email: Email.create('john@email.com'),
        organizationId: org.id,
      }),
    )
    await inMemoryCollaboratorsRepository.create(
      makeCollaborator({ organizationId: org.id }),
    )

    const result = await sut.execute({
      limit: 10,
      page: 1,
      search: 'John',
      organizationId: org.id,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.collaborators).toHaveLength(2)
    expect(result.value?.count).toBe(2)
  })
})

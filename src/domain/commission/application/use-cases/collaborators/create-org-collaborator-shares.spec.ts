import { makeCollaborator } from 'test/factories/make-collaborator'
import { makeOrganization } from 'test/factories/make-organization'
import { makeRule } from 'test/factories/make-rule'
import { InMemoryCollaboratorsRepository } from 'test/repositories/in-memory-collaborators-repository'
import { InMemoryCollaboratorsSharesRepository } from 'test/repositories/in-memory-collaborators-shares-repository'
import { InMemoryRulesRepository } from 'test/repositories/in-memory-rules-repository'

import { CreateCollaboratorSharesUseCase } from './create-org-collaborator-shares'

let inMemoryCollaboratorsSharesRepository: InMemoryCollaboratorsSharesRepository
let inMemoryCollaboratorsRepository: InMemoryCollaboratorsRepository
let inMemoryRulesRepository: InMemoryRulesRepository
let sut: CreateCollaboratorSharesUseCase

describe('Create Collaborator Shares', () => {
  beforeEach(() => {
    inMemoryCollaboratorsSharesRepository =
      new InMemoryCollaboratorsSharesRepository()
    inMemoryCollaboratorsRepository = new InMemoryCollaboratorsRepository()
    inMemoryRulesRepository = new InMemoryRulesRepository()
    sut = new CreateCollaboratorSharesUseCase(
      inMemoryCollaboratorsSharesRepository,
      inMemoryCollaboratorsRepository,
      inMemoryRulesRepository,
    )
  })

  it('should create collaborator shares', async () => {
    const organization = makeOrganization()
    const collaborator = makeCollaborator({ organizationId: organization.id })
    const shareWithCollaborator = makeCollaborator({
      organizationId: organization.id,
    })
    const rule = makeRule()

    await inMemoryCollaboratorsRepository.create(collaborator)
    await inMemoryCollaboratorsRepository.create(shareWithCollaborator)
    await inMemoryRulesRepository.create(rule)

    const result = await sut.execute({
      collaboratorId: collaborator.id,
      shareWithCollaboratorId: shareWithCollaborator.id,
      payCollaborator: true,
      shareAllClients: true,
      sharedRuleSlug: rule.slug,
      organizationId: organization.id,
    })

    expect(result.isRight()).toBe(true)
  })
})

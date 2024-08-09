import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CollaboratorShare } from '@/domain/commission/enterprise/entities/collaborator-share'
import type { CollaboratorShareClient } from '@/domain/commission/enterprise/entities/collaborator-share-clients'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { CollaboratorSharesRepository } from '../../repositories/collaborator-shares-repository'
import type { CollaboratorsRepository } from '../../repositories/collaborators-repository'
import type { RulesRepository } from '../../repositories/rules-repository'
import { CollaboratorAlreadyShareWithCollaboratorError } from '../errors/collaborator-already-share-with-collaborator-error'

interface CreateCollaboratorSharesUseCaseInput {
  organizationId: UniqueEntityID
  collaboratorId: UniqueEntityID
  shareWithCollaboratorId: UniqueEntityID
  payCollaborator: boolean
  shareAllClients: boolean
  sharedRuleSlug: Slug
  shareClients?: CollaboratorShareClient[]
}

type CreateCollaboratorSharesUseCaseOutput = Either<
  CollaboratorAlreadyShareWithCollaboratorError,
  {
    collaboratorShare: CollaboratorShare
  }
>

export class CreateCollaboratorSharesUseCase {
  constructor(
    private collaboratorSharesRepository: CollaboratorSharesRepository,
    private collaboratorsRepository: CollaboratorsRepository,
    private rulesRepository: RulesRepository,
  ) {}

  async execute(
    input: CreateCollaboratorSharesUseCaseInput,
  ): Promise<CreateCollaboratorSharesUseCaseOutput> {
    const collaborator = await this.collaboratorsRepository.findByIdAndOrgId(
      input.collaboratorId.toString(),
      input.organizationId.toString(),
    )

    if (!collaborator) {
      return left(
        new ResourceNotFoundError(
          `Collaborator not found ${input.collaboratorId.toString()}`,
        ),
      )
    }

    const shareWithCollaborator =
      await this.collaboratorsRepository.findByIdAndOrgId(
        input.shareWithCollaboratorId.toString(),
        input.organizationId.toString(),
      )

    if (!shareWithCollaborator) {
      return left(
        new ResourceNotFoundError(
          `Share with collaborator not found ${input.shareWithCollaboratorId.toString()}`,
        ),
      )
    }

    const collaboratorAlreadyShareWithCollaborator =
      await this.collaboratorSharesRepository.findCollaboratorShareWithCollaboratorId(
        {
          collaboratorId: input.collaboratorId.toString(),
          shareWithCollaboratorId: input.shareWithCollaboratorId.toString(),
        },
      )

    if (collaboratorAlreadyShareWithCollaborator) {
      return left(new CollaboratorAlreadyShareWithCollaboratorError())
    }

    const rule = await this.rulesRepository.findBySlug(
      input.sharedRuleSlug.value,
    )

    if (!rule) {
      return left(
        new ResourceNotFoundError(`Rule not found ${input.sharedRuleSlug}`),
      )
    }

    const collaboratorShare = CollaboratorShare.create({
      collaboratorId: input.collaboratorId,
      shareWitCollaboratorId: input.shareWithCollaboratorId,
      shareWithCollaborator,
      payCollaborator: input.payCollaborator,
      shareAllClients: input.shareAllClients,
      sharedRuleSlug: rule.slug,
      orgId: input.organizationId,
      rule,
    })

    if (input.shareAllClients) {
      collaboratorShare.shareClients = input.shareClients
    }

    await this.collaboratorSharesRepository.create(collaboratorShare)

    return right({ collaboratorShare })
  }
}

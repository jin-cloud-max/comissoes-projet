import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedResource } from '@/core/errors/errors/unauthorized'
import { Collaborator } from '@/domain/commission/enterprise/entities/collaborator'
import type { Email } from '@/domain/commission/enterprise/entities/value-object/email'

import type { CollaboratorsRepository } from '../../repositories/collaborators-repository'
import type { OrganizationsRepository } from '../../repositories/organizations-repository'

interface EditCollaboratorUseCaseInput {
  collaboratorId: UniqueEntityID
  code?: string
  name: string
  email: Email
  organizationId: UniqueEntityID
}

type EditCollaboratorUseCaseOutput = Either<
  ResourceNotFoundError | ConflictError,
  {
    collaborator: Collaborator
  }
>

export class EditCollaboratorUseCase {
  constructor(
    private collaboratorsRepository: CollaboratorsRepository,
    private organizationsRepository: OrganizationsRepository,
  ) {}

  async execute(
    input: EditCollaboratorUseCaseInput,
  ): Promise<EditCollaboratorUseCaseOutput> {
    const organization = await this.organizationsRepository.findById(
      input.organizationId.toString(),
    )

    if (!organization) {
      return left(
        new ResourceNotFoundError(
          `Organization with id ${input.organizationId.toString()} not found`,
        ),
      )
    }

    const collaborator = await this.collaboratorsRepository.findByIdAndOrgId(
      input.collaboratorId.toString(),
      input.organizationId.toString(),
    )

    if (!collaborator) {
      return left(
        new ResourceNotFoundError(
          `Collaborator with id ${input.collaboratorId.toString()} not found`,
        ),
      )
    }

    if (collaborator.orgId?.toString() !== input.organizationId.toString()) {
      return left(new UnauthorizedResource(`Collaborators`))
    }

    const findCollaboratorByEmail =
      await this.collaboratorsRepository.findByEmail(input.email.value)

    if (findCollaboratorByEmail) {
      return left(new ConflictError(`${input.email.value}`))
    }

    if (input.code) {
      const findCollaboratorByCode =
        await this.collaboratorsRepository.findByCode(input.code)

      if (findCollaboratorByCode) {
        return left(new ConflictError(`${input.code}`))
      }
    }

    collaborator.code = input.code
    collaborator.name = input.name
    collaborator.email = input.email

    await this.collaboratorsRepository.update(collaborator)

    return right({ collaborator })
  }
}

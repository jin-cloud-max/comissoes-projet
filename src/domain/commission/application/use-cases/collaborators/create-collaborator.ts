import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { InvalidEmailError } from '@/core/errors/errors/invalid-email-error'
import { Collaborator } from '@/domain/commission/enterprise/entities/collaborator'
import { Email } from '@/domain/commission/enterprise/entities/value-object/email'

import type { CollaboratorsRepository } from '../../repositories/collaborators-repository'

interface CreateCollaboratorUseCaseInput {
  name: string
  email: string
  code?: string
  organizationId?: UniqueEntityID
}

type CreateCollaboratorUseCaseOutput = Either<
  ConflictError,
  {
    collaborator: Collaborator
  }
>

export class CreateCollaboratorUseCase {
  constructor(private collaboratorsRepository: CollaboratorsRepository) {}

  async execute(
    input: CreateCollaboratorUseCaseInput,
  ): Promise<CreateCollaboratorUseCaseOutput> {
    const emailAlreadyExists = await this.collaboratorsRepository.findByEmail(
      input.email,
    )

    if (emailAlreadyExists) {
      return left(new ConflictError(input.email))
    }

    if (input.code) {
      const codeAlreadyExists = await this.collaboratorsRepository.findByCode(
        input.code,
      )

      if (codeAlreadyExists) {
        return left(new ConflictError(input.code))
      }
    }

    const isValidEmail = Email.validate(input.email)

    if (!isValidEmail) {
      return left(new InvalidEmailError(input.email))
    }

    const collaborator = Collaborator.create({
      email: Email.create(input.email),
      name: input.name,
      code: input.code?.trim(),
      organizationId: input.organizationId,
    })

    await this.collaboratorsRepository.create(collaborator)

    return right({ collaborator })
  }
}

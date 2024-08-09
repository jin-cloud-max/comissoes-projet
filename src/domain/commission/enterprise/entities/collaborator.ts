import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import type { Email } from './value-object/email'

export interface CollaboratorInput {
  name: string
  email: Email
  code?: string
  isActive?: boolean
  organizationId?: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Collaborator extends Entity<CollaboratorInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  get email() {
    return this.props.email
  }

  get orgId() {
    return this.props.organizationId
  }

  set email(email: Email) {
    this.props.email = email

    this.touch()
  }

  get code() {
    return this.props.code
  }

  set code(code: string | undefined) {
    this.props.code = code

    this.touch()
  }

  get isActive() {
    return this.props.isActive
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    input: Optional<CollaboratorInput, 'createdAt'>,
    id?: UniqueEntityID,
  ): Collaborator {
    const collaborator = new Collaborator(
      {
        ...input,
        createdAt: input.createdAt ?? new Date(),
      },
      id,
    )

    return collaborator
  }

  static inactivateCollaborator(collaborator: Collaborator): Collaborator {
    collaborator.props.isActive = false

    return collaborator
  }
}

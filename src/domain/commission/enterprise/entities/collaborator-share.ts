import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import type { Collaborator } from './collaborator'
import type { CollaboratorShareClient } from './collaborator-share-clients'
import { Rule } from './rule'
import type { Slug } from './value-object/slug'

interface CollaboratorShareInput {
  collaboratorId: UniqueEntityID
  shareWitCollaboratorId: UniqueEntityID
  payCollaborator: boolean
  shareAllClients: boolean
  sharedRuleSlug: Slug
  rule: Rule
  orgId: UniqueEntityID
  shareWithCollaborator: Collaborator
  shareClients?: CollaboratorShareClient[]
  createdAt: Date
  updatedAt?: Date
}

export class CollaboratorShare extends Entity<CollaboratorShareInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get collaboratorId() {
    return this.props.collaboratorId
  }

  set collaboratorId(collaboratorId: UniqueEntityID) {
    this.props.collaboratorId = collaboratorId

    this.touch()
  }

  get shareWithCollaboratorId() {
    return this.props.shareWitCollaboratorId
  }

  set shareWithCollaboratorId(shareWithCollaboratorId: UniqueEntityID) {
    this.props.shareWitCollaboratorId = shareWithCollaboratorId
  }

  get payCollaborator() {
    return this.props.payCollaborator
  }

  set payCollaborator(payCollaborator: boolean) {
    this.props.payCollaborator = payCollaborator

    this.touch()
  }

  get shareAllClients() {
    return this.props.shareAllClients
  }

  set shareAllClients(shareAllClients: boolean) {
    this.props.shareAllClients = shareAllClients

    this.touch()
  }

  get sharedRuleSlug() {
    return this.props.sharedRuleSlug
  }

  get orgId() {
    return this.props.orgId
  }

  set sharedRuleSlug(sharedRuleSlug: Slug) {
    this.props.sharedRuleSlug = sharedRuleSlug

    this.touch()
  }

  get shareClients() {
    return this.props.shareClients
  }

  set shareClients(shareClients: CollaboratorShareClient[] | undefined) {
    this.props.shareClients = shareClients

    this.touch()
  }

  static create(
    input: Optional<CollaboratorShareInput, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    return new CollaboratorShare(
      {
        ...input,
        createdAt: input.createdAt ?? new Date(),
      },
      id,
    )
  }
}

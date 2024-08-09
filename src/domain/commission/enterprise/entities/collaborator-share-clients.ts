import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CollaboratorShareClientInput {
  collaboratorShareId: UniqueEntityID
  client: string
}

export class CollaboratorShareClient extends Entity<CollaboratorShareClientInput> {
  get collaboratorShareId() {
    return this.props.collaboratorShareId
  }

  get client() {
    return this.props.client
  }

  static create(input: CollaboratorShareClientInput, id?: UniqueEntityID) {
    return new CollaboratorShareClient(input, id)
  }
}

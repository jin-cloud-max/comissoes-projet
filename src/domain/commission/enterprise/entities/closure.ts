import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface ClosureInput {
  closure: Date
  isOpen?: boolean
  closedByUser?: UniqueEntityID
  createdAt: Date
  closedAt?: Date
  updatedAt?: Date
}

export class Closure extends Entity<ClosureInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get closure() {
    return this.props.closure
  }

  get isOpen() {
    return this.props.isOpen
  }

  static create(
    input: Optional<ClosureInput, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const closure = new Closure(
      {
        ...input,
        createdAt: input.createdAt ?? new Date(),
      },
      id,
    )

    return closure
  }
}

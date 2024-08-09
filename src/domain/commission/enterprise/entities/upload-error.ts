import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface UploadErrorInput {
  message: string
  type: string
  uploadId: UniqueEntityID
  log: Record<string, unknown>
  solved: boolean
  createdAt: Date
  updatedAt?: Date
}

export class UploadError extends Entity<UploadErrorInput> {
  get message(): string {
    return this.props.message
  }

  get type(): string {
    return this.props.type
  }

  get uploadId(): UniqueEntityID {
    return this.props.uploadId
  }

  get log(): Record<string, unknown> {
    return this.props.log
  }

  get solved(): boolean {
    return this.props.solved
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  public static create(
    input: Optional<UploadErrorInput, 'createdAt'>,
    id?: UniqueEntityID,
  ): UploadError {
    return new UploadError(
      {
        ...input,
        createdAt: new Date(),
      },
      id,
    )
  }
}

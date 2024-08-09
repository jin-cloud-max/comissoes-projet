import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

interface TaskInput {
  title: string
  description: string
  type: string
  createdByUserId: UniqueEntityID
  context?: Record<string, unknown>
  status: 'available' | 'running' | 'done' | 'error' | 'canceled'
  createdAt: Date
  updatedAt?: Date
  endedAt?: Date
  startedAt?: Date
}

export class Task extends Entity<TaskInput> {
  public static create(
    input: Optional<TaskInput, 'createdAt' | 'status'>,
    id?: UniqueEntityID,
  ) {
    return new Task(
      {
        ...input,
        status: 'available',
        createdAt: input.createdAt ?? new Date(),
      },
      id,
    )
  }
}

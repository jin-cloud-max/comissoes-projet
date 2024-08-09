import { type Either, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Task } from '../../enterprise/entities/task'
import type { TasksRepository } from '../../repositories/tasks-repository'

export interface CreateTaskUseCaseInput {
  title: string
  description: string
  type: string
  createdByUserId: UniqueEntityID
  context?: Record<string, unknown>
}

export type CreateTaskUseCaseOutput = Either<
  null,
  {
    task: Task
  }
>

export class CreateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(
    input: CreateTaskUseCaseInput,
  ): Promise<CreateTaskUseCaseOutput> {
    const task = Task.create({
      createdByUserId: input.createdByUserId,
      description: input.description,
      title: input.title,
      type: input.type,
      context: input.context,
    })

    await this.tasksRepository.create(task)

    return right({ task })
  }
}

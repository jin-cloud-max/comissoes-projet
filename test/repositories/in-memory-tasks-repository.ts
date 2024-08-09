import type { Task } from '@/domain/task/enterprise/entities/task'
import type { TasksRepository } from '@/domain/task/repositories/tasks-repository'

export class ImMemoryTasksRepository implements TasksRepository {
  public items: Task[] = []

  async create(task: Task): Promise<void> {
    this.items.push(task)
  }
}

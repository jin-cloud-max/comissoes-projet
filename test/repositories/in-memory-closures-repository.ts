import type { ClosuresRepository } from '@/domain/commission/application/repositories/closures-repository'
import type { Closure } from '@/domain/commission/enterprise/entities/closure'

export class InMemoryClosuresRepository implements ClosuresRepository {
  public items: Closure[] = []

  async findByDate(date: Date): Promise<Closure | undefined> {
    return this.items.find(
      (item) => item.closure.toDateString() === date.toDateString(),
    )
  }
}

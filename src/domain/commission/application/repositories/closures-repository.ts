import type { Closure } from '../../enterprise/entities/closure'

export interface ClosuresRepository {
  findByDate(date: Date): Promise<Closure | undefined>
}

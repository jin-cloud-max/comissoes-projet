import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Closure,
  type ClosureInput,
} from '@/domain/commission/enterprise/entities/closure'

export function makeClosure(
  overrides: Partial<ClosureInput> = {},
  id?: UniqueEntityID,
) {
  const closure = Closure.create(
    {
      closure: new Date(),
      ...overrides,
    },
    id,
  )

  return closure
}

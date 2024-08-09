import { createId } from '@paralleldrive/cuid2'

export class UniqueEntityID {
  private value: string

  toString(): string {
    return this.value
  }

  toValue(): string {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? createId()
  }

  public equals(id: UniqueEntityID): boolean {
    return id.toValue() === this.value
  }
}

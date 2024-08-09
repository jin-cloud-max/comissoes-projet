import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export type Condition = 'equals' | 'contains' | 'isEmpty'

export interface MapperInput {
  title: string
  mapField: string
  fromField: string
  mapValue: string
  value: string
  condition: Condition
  createdAt: Date
  updatedAt?: Date
}

export class Mapper extends Entity<MapperInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title

    this.touch()
  }

  get mapField() {
    return this.props.mapField
  }

  set mapField(mapField: string) {
    this.props.mapField = mapField

    this.touch()
  }

  get fromField() {
    return this.props.fromField
  }

  set fromField(fromField: string) {
    this.props.fromField = fromField

    this.touch()
  }

  get mapValue() {
    return this.props.mapValue
  }

  set mapValue(mapValue: string) {
    this.props.mapValue = mapValue

    this.touch()
  }

  get value() {
    return this.props.value
  }

  set value(value: string) {
    this.props.value = value

    this.touch()
  }

  get condition() {
    return this.props.condition
  }

  set condition(condition: Condition) {
    this.props.condition = condition

    this.touch()
  }

  static create(
    input: Optional<MapperInput, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const mapper = new Mapper(
      {
        ...input,
        createdAt: input.createdAt ?? new Date(),
        updatedAt: input.updatedAt ?? new Date(),
      },
      id,
    )

    return mapper
  }
}

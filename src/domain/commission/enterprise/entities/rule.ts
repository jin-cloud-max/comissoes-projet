import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import { Slug } from './value-object/slug'

export interface RuleInput {
  name: string
  createdAt: Date
  updatedAt?: Date | null
  slug: Slug
}

export class Rule extends Entity<RuleInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name

    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug

    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<RuleInput, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const rule = new Rule(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )

    return rule
  }
}

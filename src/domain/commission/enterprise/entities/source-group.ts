import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import { Slug } from './value-object/slug'

export interface SourceGroupInput {
  name: string
  slug: Slug
  createdAt: Date
  updatedAt?: Date | null
}

export class SourceGroup extends Entity<SourceGroupInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug

    this.touch()
  }

  static create(
    input: Optional<SourceGroupInput, 'slug' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const sourceGroup = new SourceGroup(
      {
        ...input,
        slug: input.slug ?? Slug.createFromText(input.name),
        createdAt: input.createdAt ?? new Date(),
        updatedAt: input.updatedAt ?? new Date(),
      },
      id,
    )

    return sourceGroup
  }
}

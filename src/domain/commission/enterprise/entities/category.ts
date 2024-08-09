import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import { Slug } from './value-object/slug'

export interface CategoryInput {
  category: string
  createdAt: Date
  orgId: UniqueEntityID
  updatedAt?: Date | null
  slug: Slug
}

export class Category extends Entity<CategoryInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get category() {
    return this.props.category
  }

  get slug() {
    return this.props.slug
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get orgId() {
    return this.props.orgId
  }

  set category(value: string) {
    this.props.category = value
    this.touch()
  }

  set slug(value: Slug) {
    this.props.slug = value
    this.touch()
  }

  static create(
    props: Optional<CategoryInput, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const category = new Category(
      {
        ...props,
        slug:
          props.slug ?? Slug.createFromText(`${props.orgId}-${props.category}`),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )

    return category
  }
}

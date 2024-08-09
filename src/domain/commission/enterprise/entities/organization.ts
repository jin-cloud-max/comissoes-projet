import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import { Slug } from './value-object/slug'

export interface OrganizationInput {
  name: string
  slug: Slug
  ownerId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Organization extends Entity<OrganizationInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug

    this.touch()
  }

  get ownerId() {
    return this.props.ownerId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<OrganizationInput, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const organization = new Organization(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )

    return organization
  }
}

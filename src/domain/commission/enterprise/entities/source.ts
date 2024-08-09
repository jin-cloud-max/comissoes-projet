import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

import type { SourceGroup } from './source-group'
import { Slug } from './value-object/slug'

export interface SourceInput {
  source: string
  slug: Slug
  closure: Date
  sourceGroupId?: UniqueEntityID
  sourceGroup: SourceGroup
  createdAt: Date
  updatedAt?: Date
}

export class Source extends Entity<SourceInput> {
  private touch() {
    this.props.updatedAt = new Date()
  }

  get source() {
    return this.props.source
  }

  set source(source: string) {
    this.props.source = source

    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug

    this.touch()
  }

  get sourceGroupId() {
    return this.props.sourceGroupId
  }

  get sourceGroup() {
    return this.props.source
  }

  set sourceGroupId(sourceGroupId: UniqueEntityID | undefined) {
    if (!sourceGroupId) return

    this.props.sourceGroupId = sourceGroupId

    this.touch()
  }

  static create(
    input: Optional<SourceInput, 'createdAt' | 'slug'>,
    id?: UniqueEntityID,
  ) {
    const source = new Source(
      {
        ...input,
        slug: input.slug ?? Slug.createFromText(input.source),
        createdAt: input.createdAt ?? new Date(),
        updatedAt: input.updatedAt ?? new Date(),
      },
      id,
    )

    return source
  }
}

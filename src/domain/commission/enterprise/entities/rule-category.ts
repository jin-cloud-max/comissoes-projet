import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { Category } from './category'
import type { Slug } from './value-object/slug'

export interface RuleCategoryInput {
  ruleSlug: Slug
  categorySlug: Slug
  category: Category
  fee: number
}

export class RuleCategory extends Entity<RuleCategoryInput> {
  get ruleSlug() {
    return this.props.ruleSlug
  }

  get categorySlug() {
    return this.props.categorySlug
  }

  get fee() {
    return this.props.fee
  }

  set fee(fee: number) {
    this.props.fee = fee
  }

  get category() {
    return this.props.category
  }

  static create(input: RuleCategoryInput, id?: UniqueEntityID) {
    const ruleCategory = new RuleCategory(
      {
        ...input,
      },
      id,
    )

    return ruleCategory
  }
}

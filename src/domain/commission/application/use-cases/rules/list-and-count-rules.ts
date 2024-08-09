import { type Either, right } from '@/core/either'
import type { Rule } from '@/domain/commission/enterprise/entities/rule'

import type { RulesRepository } from '../../repositories/rules-repository'

export interface ListAndCountRulesUseCaseInput {
  page: number
  limit: number
  rule?: string
}

type ListAndCountRulesUseCaseOutput = Either<
  null,
  {
    count: number
    page: number
    limit: number
    rules: Rule[]
  }
>

export class ListAndCountRulesUseCase {
  constructor(private readonly rulesRepository: RulesRepository) {}

  async execute({
    limit,
    page,
    rule,
  }: ListAndCountRulesUseCaseInput): Promise<ListAndCountRulesUseCaseOutput> {
    const rules = await this.rulesRepository.list({
      limit,
      page,
      filterBy: {
        rule,
      },
    })

    const count = await this.rulesRepository.count({
      rule,
    })

    return right({ count, page, limit, rules })
  }
}

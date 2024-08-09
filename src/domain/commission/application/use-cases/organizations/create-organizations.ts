import { type Either, left, right } from '@/core/either'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ConflictError } from '@/core/errors/errors/conflict-error'
import { Organization } from '@/domain/commission/enterprise/entities/organization'
import type { Slug } from '@/domain/commission/enterprise/entities/value-object/slug'

import type { OrganizationsRepository } from '../../repositories/organizations-repository'

export interface CreateOrganizationUseCaseInput {
  name: string
  slug?: Slug
  ownerId: UniqueEntityID
}

type CreateOrganizationUseCaseOutput = Either<
  ConflictError,
  {
    organization: Organization
  }
>

export class CreateOrganizationUseCase {
  constructor(private organizationsRepository: OrganizationsRepository) {}

  async execute({
    name,
    slug,
    ownerId,
  }: CreateOrganizationUseCaseInput): Promise<CreateOrganizationUseCaseOutput> {
    const org = Organization.create({ name, slug, ownerId })

    const organizationAlreadyExists =
      await this.organizationsRepository.findBySlug(org.slug.value)

    if (organizationAlreadyExists) {
      return left(new ConflictError(org.slug.value))
    }

    await this.organizationsRepository.create(org)

    return right({ organization: org })
  }
}

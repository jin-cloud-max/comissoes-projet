import { expect, test } from 'vitest'

import { Email } from './email'

describe('Email', () => {
  test('it should to verify if is a invalid e-mail', () => {
    const isValidEmail = Email.validate('invalid-email')

    expect(isValidEmail).toEqual(false)
  })

  test('it should to verify if is a valid e-mail', () => {
    const isValidEmail = Email.validate('valid.email@email.com.br')

    expect(isValidEmail).toEqual(true)
  })
})

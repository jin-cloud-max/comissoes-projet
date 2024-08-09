export class Email {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  /**
   * Receive a string and verify if it is a valid email
   *
   * Example: "email@email.com => true
   *
   * @param text {string}
   */
  static validate(email: string) {
    const isValidEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
      email,
    )

    return isValidEmail
  }

  static create(email: string) {
    return new Email(email.trim())
  }
}

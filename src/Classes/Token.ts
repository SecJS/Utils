import { v4, validate } from 'uuid'
import { InternalServerException } from '@secjs/exceptions'

export class Token {
  /**
   * Verify if string is a valid uuid
   *
   * @param token The token to be verified
   * @param isPrefixed If is prefixed or not
   * @return True or false
   */
  static verify(token: string, isPrefixed = false): boolean {
    if (isPrefixed) {
      return validate(this.getToken(token))
    }

    return validate(token)
  }

  /**
   * Generate an uuid token
   *
   * @param prefix The token prefix to come in front
   * @return The token generated
   */
  static generate(prefix?: string): string {
    if (prefix) {
      return `${prefix}-${v4()}`
    }

    return v4()
  }

  /**
   * Generate an uuid token
   *
   * @param prefix The token prefix to come in front
   * @return The token generated
   */
  static getToken(token: string): string {
    const prefix = token.split('-')[0]

    return token.split(`${prefix}-`)[1]
  }

  /**
   * Inject a prefix in the uuid token
   *
   * @param prefix The token prefix to come in front
   * @param token The token that is going to be prefixed
   * @throws Error if token is not a valid uuid
   * @return The token prefixed
   */
  static injectPrefix(prefix: string, token: string): string {
    if (!this.verify(token)) {
      throw new InternalServerException('Token is not a valid uuid.')
    }

    return `${prefix}-${token}`
  }

  /**
   * Change the prefix of and uuid token
   *
   * @param newPrefix The new token prefix to come in front
   * @param token The token that is going to be prefixed
   * @throws Error if token is not a valid uuid
   * @return The token prefixed
   */
  static changePrefix(newPrefix: string, token: string): string {
    const uuid = this.getToken(token)

    if (!this.verify(uuid)) {
      throw new InternalServerException('Token is not a valid uuid.')
    }

    return `${newPrefix}-${uuid}`
  }

  /**
   * Change the token prefix or generate a new one
   *
   * @param prefix The token prefix to come in front
   * @param token The token that is going to be changed
   * @throws Error if token is not a valid uuid
   * @return The token prefixed or generated
   */
  static changeOrGenerate(prefix: string, token?: string): string {
    if (token) {
      return this.changePrefix(prefix, token)
    }

    return this.generate(prefix)
  }
}

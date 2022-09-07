/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { v4 } from 'uuid'
import { Is } from '#src/Helpers/Is'
import { InvalidUuidException } from '#src/Exceptions/InvalidUuidException'

export class Uuid {
  /**
   * Verify if string is a valid uuid.
   *
   * @param {string} token
   * @param {boolean} [isPrefixed]
   * @return {boolean}
   */
  static verify(token, isPrefixed = false) {
    if (isPrefixed) {
      return Is.Uuid(this.getToken(token))
    }

    return Is.Uuid(token)
  }

  /**
   * Generate an uuid token
   *
   * @param {string} [prefix]
   * @return {string}
   */
  static generate(prefix) {
    if (prefix) {
      return `${prefix}::${v4()}`
    }

    return v4()
  }

  /**
   * Return the token without his prefix.
   *
   * @param {string} token
   * @return {string}
   */
  static getToken(token) {
    const prefix = Uuid.getPrefix(token)

    if (!prefix) {
      return token
    }

    return token.split(`${prefix}::`)[1]
  }

  /**
   * Return the prefix without his token.
   *
   * @param {string} token
   * @return {string|null}
   */
  static getPrefix(token) {
    const prefix = token.split('::')[0]

    /**
     * Means that the "::" char has not been
     * found. So there is no prefix in the token.
     */
    if (prefix === token) {
      return null
    }

    return prefix
  }

  /**
   * Inject a prefix in the uuid token.
   *
   * @param {string} prefix
   * @param {string} token
   * @throws {InvalidUuidException}
   * @return {string}
   */
  static injectPrefix(prefix, token) {
    if (!this.verify(token)) {
      throw new InvalidUuidException(token)
    }

    return `${prefix}::${token}`
  }

  /**
   * Change the prefix of and uuid token
   *
   * @param {string} newPrefix
   * @param {string} token
   * @throws {InvalidUuidException}
   * @return {string}
   */
  static changePrefix(newPrefix, token) {
    const uuid = this.getToken(token)

    if (!this.verify(uuid)) {
      throw new InvalidUuidException(uuid)
    }

    return `${newPrefix}::${uuid}`
  }

  /**
   * Change the token prefix or generate a new one
   *
   * @param {string} prefix
   * @param {string?} token
   * @return {string}
   */
  static changeOrGenerate(prefix, token) {
    if (token) {
      return this.changePrefix(prefix, token)
    }

    return this.generate(prefix)
  }
}

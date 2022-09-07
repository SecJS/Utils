/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import pluralize from 'pluralize'
import changeCase from 'change-case'

import { randomBytes } from 'crypto'
import { OrdinalNanException } from '#src/Exceptions/OrdinalNanException'

export class String {
  /**
   * Generate random string by size.
   *
   * @param {number} size
   * @return {string}
   */
  static generateRandom(size) {
    const bits = (size + 1) * 6
    const buffer = randomBytes(Math.ceil(bits / 8))

    return String.normalizeBase64(buffer.toString('base64')).slice(0, size)
  }

  /**
   * Generate random color in hexadecimal format.
   *
   * @return {string}
   */
  static generateRandomColor() {
    return `#${((Math.random() * 0xffffff) << 0).toString(16)}`
  }

  /**
   * Normalizes the string in base64 format removing
   * special chars.
   *
   * @param {string} value
   * @return {string}
   */
  static normalizeBase64(value) {
    return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  /**
   * Transforms the string to "camelCase".
   *
   * @param {string} value
   * @return {string}
   */
  static toCamelCase(value) {
    return changeCase.camelCase(value)
  }

  /**
   * Transforms the string to "snake_case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toSnakeCase(value, capitalize) {
    if (capitalize) {
      return changeCase.snakeCase(value, {
        transform: changeCase.capitalCaseTransform,
      })
    }

    return changeCase.snakeCase(value)
  }

  /**
   * Transforms the string to "CONSTANT_CASE".
   *
   * @param {string} value
   * @return {string}
   */
  static toConstantCase(value) {
    return changeCase.constantCase(value)
  }

  /**
   * Transforms the string to "PascalCase".
   *
   * @param {string} value
   * @return {string}
   */
  static toPascalCase(value) {
    return changeCase.pascalCase(value)
  }

  /**
   * Transforms the string to "Sentence case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toSentenceCase(value, capitalize) {
    if (capitalize) {
      return changeCase.capitalCase(value)
    }

    return changeCase.sentenceCase(value)
  }

  /**
   * Transforms the string to "dot.case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toDotCase(value, capitalize) {
    if (capitalize) {
      return changeCase.dotCase(value, {
        transform: changeCase.capitalCaseTransform,
      })
    }

    return changeCase.dotCase(value)
  }

  /**
   * Removes all sorted cases from string.
   *
   * @param {string} value
   * @return {string}
   */
  static toNoCase(value) {
    return changeCase.noCase(value)
  }

  /**
   * Transforms a string to "dash-case"
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toDashCase(value, capitalize) {
    if (capitalize) {
      return changeCase.headerCase(value)
    }

    return changeCase.paramCase(value)
  }

  /**
   * Transforms a word to plural.
   *
   * @param {string} word
   * @return {string}
   */
  static pluralize(word) {
    return pluralize.plural(word)
  }

  /**
   * Transforms a word to singular.
   *
   * @param {string} word
   * @return {string}
   */
  static singularize(word) {
    return pluralize.singular(word)
  }

  /**
   * Transforms a number to your ordinal format.
   *
   * @param {string,number} value
   * @throws {OrdinalNanException}
   * @return {string}
   */
  static ordinalize(value) {
    const transformedValue = Math.abs(
      typeof value === 'string' ? parseInt(value) : value,
    )

    if (!Number.isFinite(transformedValue) || Number.isNaN(transformedValue)) {
      throw new OrdinalNanException()
    }

    const percent = transformedValue % 100

    if (percent >= 10 && percent <= 20) {
      return `${value}th`
    }

    const decimal = transformedValue % 10

    switch (decimal) {
      case 1:
        return `${value}st`
      case 2:
        return `${value}nd`
      case 3:
        return `${value}rd`
      default:
        return `${value}th`
    }
  }
}

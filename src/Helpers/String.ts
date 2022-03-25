/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import * as changeCase from 'change-case'

import { randomBytes } from 'crypto'
import { plural, singular } from 'pluralize'

export class String {
  /**
   * generateRandom generate random string by size
   *
   * @param size The size
   * @return Return the random string by size
   */
  static generateRandom(size: number) {
    const bits = (size + 1) * 6
    const buffer = randomBytes(Math.ceil(bits / 8))

    return String.normalizeBase64(buffer.toString('base64')).slice(0, size)
  }

  /**
   * generateRandomColor generate random color in hexadecimal format
   *
   * @return Return the color in hexadecimal
   */
  static generateRandomColor() {
    return `#${((Math.random() * 0xffffff) << 0).toString(16)}`
  }

  /**
   * normalizeBase64 normalizes the string in base64 format removing special chars
   *
   * @param value The string
   * @return Return the base64 string normalized
   */
  static normalizeBase64(value: string) {
    return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }

  /**
   * toCamelCase transforms the string to camelCase
   *
   * @param value The string
   * @return Return the word in camelCase
   */
  static toCamelCase(value: string): string {
    return changeCase.camelCase(value)
  }

  /**
   * toSnakeCase transforms the string to snake_case
   *
   * @param value The string
   * @param capitalize If true will transform to Snake_Case
   * @return Return the word in snake_case
   */
  static toSnakeCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.snakeCase(value, {
        transform: changeCase.capitalCaseTransform,
      })
    }

    return changeCase.snakeCase(value)
  }

  /**
   * toConstantCase transforms the string to CONSTANT_CASE
   *
   * @param value The string
   * @return Return the word in CONSTANT_CASE
   */
  static toConstantCase(value: string): string {
    return changeCase.constantCase(value)
  }

  /**
   * toPascalCase transforms the string to PascalCase
   *
   * @param value The string
   * @return Return the word in PascalCase
   */
  static toPascalCase(value: string): string {
    return changeCase.pascalCase(value)
  }

  /**
   * toSentenceCase transforms the string to Sentence case
   *
   * @param value The string
   * @param capitalize If true will transform to Capital Case
   * @return Return the word in Sentence case
   */
  static toSentenceCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.capitalCase(value)
    }

    return changeCase.sentenceCase(value)
  }

  /**
   * toDotCase transforms the string to dot.case
   *
   * @param value The string
   * @param capitalize If true will transform to Dot.Case
   * @return Return the word in dot.case
   */
  static toDotCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.dotCase(value, {
        transform: changeCase.capitalCaseTransform,
      })
    }

    return changeCase.dotCase(value)
  }

  /**
   * toNoCase removes all sorted cases from string
   *
   * @param value The string
   * @return Return the word with no case
   */
  static toNoCase(value: string): string {
    return changeCase.noCase(value)
  }

  /**
   * toDashCase transforms a string to dash-case
   *
   * @param value The string
   * @param capitalize If true will transform to Header-Case
   * @return Return the word in dash-case
   */
  static toDashCase(value: string, capitalize?: boolean): string {
    if (capitalize) {
      return changeCase.headerCase(value)
    }

    return changeCase.paramCase(value)
  }

  /**
   * pluralize transforms a word to plural
   *
   * @param word The word
   * @return Return the word in plural
   */
  static pluralize(word: string): string {
    return plural(word)
  }

  /**
   * singularize transforms a word to singular
   *
   * @param word The word
   * @return Return the word in singular
   */
  static singularize(word: string): string {
    return singular(word)
  }

  /**
   * ordinalize transforms a number to your ordinal format
   *
   * @param value The number in string/number
   * @return Return the number ordinalized
   */
  static ordinalize(value: string | number): string {
    const transformedValue = Math.abs(
      typeof value === 'string' ? parseInt(value) : value,
    )

    if (!Number.isFinite(transformedValue) || Number.isNaN(transformedValue)) {
      throw new Error('Cannot ordinal NAN or infinite numbers')
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

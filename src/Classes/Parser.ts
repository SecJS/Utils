/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ms from 'ms'
import bytes from 'bytes'

import { getReasonPhrase, getStatusCode } from 'http-status-codes'
import { InternalServerException } from '@secjs/exceptions'
import { String } from './String'

export class Parser {
  /**
   * Parse a string to array
   *
   * @param string The string to parse
   * @param separator The separator to use
   * @return The array of string
   */
  static stringToArray(string: string, separator: string): string[] {
    return string.split(separator).map(index => index.trim())
  }

  /**
   * Parse an array to a string base on options
   *
   * @return The string
   * @param values The array of string
   * @param options { separator?: string, pairSeparator?: string, lastSeparator?: string }
   */
  static arrayToString(
    values: string[],
    options?: {
      separator?: string
      pairSeparator?: string
      lastSeparator?: string
    },
  ): string {
    if (values.length === 0) {
      return ''
    }

    if (values.length === 1) {
      return values[0]
    }

    if (values.length === 2) {
      return `${values[0]}${options?.pairSeparator || ' and '}${values[1]}`
    }

    const normalized = Object.assign(
      { separator: ', ', lastSeparator: ' and ' },
      options,
    )

    return (
      values.slice(0, -1).join(normalized.separator) +
      normalized.lastSeparator +
      values[values.length - 1]
    )
  }

  /**
   * Parse a string to number or Cordinate
   *
   * @param string The string to parse
   * @param isCoordinate If string is a coordinate
   * @return The string parsed to int or float
   */
  static stringToNumber(string: string, isCoordinate = false): number {
    if (!string.replace(/\D/g, '')) {
      throw new InternalServerException(
        'Your string is invalid, it should have at least one number.',
      )
    }

    string = string.replace(/\D/g, '')

    if (string.length >= 9 || isCoordinate) {
      return parseFloat(string)
    }

    return parseInt(string)
  }

  /**
   * Parse an object to form data
   *
   * @param object The object to parse
   * @return The object parsed to form data
   */
  static jsonToFormData(object: any): string {
    return Object.keys(object)
      .reduce((previous, current) => {
        return previous + `&${current}=${encodeURIComponent(object[current])}`
      }, '')
      .substring(1)
  }

  /**
   * Parse form data to json
   *
   * @param formData The form data to parse
   * @return The form data parsed to object
   */
  static formDataToJson(formData: string): any {
    const object = {}

    if (formData.startsWith('?')) formData = formData.replace('?', '')

    formData.split('&').forEach(queries => {
      const query = queries.split('=')

      object[decodeURIComponent(query[0])] = decodeURIComponent(query[1])
    })

    return object
  }

  /**
   * linkToHref parses all links inside the string to HTML link with <a href= .../>
   *
   * @param string - The string with links inside
   * @return formattedString - Return the formatted string
   */
  static linkToHref(string: any): string {
    const regex = /(https?:\/\/[^\s]+)/g

    return string.replace(regex, '<a href="$1">$1</a>')
  }

  /**
   * sizeToBytes parses a number to Byte format
   *
   * @param value - The string/number
   * @param options - The options from formatting
   * @return Return the byte value format in string
   */
  static sizeToByte(value: number, options?: bytes.BytesOptions): string {
    return bytes.format(value, options)
  }

  /**
   * byteToSize parses a byte format to number
   *
   * @param byte - The string/number
   * @return Return the number from byte value
   */
  static byteToSize(byte: string): number {
    return bytes.parse(byte)
  }

  /**
   * timeToMs parses a string to MS format
   *
   * @param value - The string
   * @return Return the number in ms
   */
  static timeToMs(value: string): number {
    return ms(value)
  }

  /**
   * msToTime parses an MS number to time format
   *
   * @param value - The number
   * @param long - Will return the time format in long form example: 2 days
   * @return Return the time format of the MS value
   */
  static msToTime(value: number, long = false): string {
    return ms(value, { long })
  }

  /**
   * statusCodeToReason parses the status code number to it reason in string
   *
   * @param status - The status code
   * @return Return the status code reason
   */
  static statusCodeToReason(status: string | number): string {
    return String.toConstantCase(getReasonPhrase(status))
  }

  /**
   * reasonToStatusCode parses the reason in string to it status code number
   *
   * @param reason - The status code reason
   * @return Return the status code number
   */
  static reasonToStatusCode(reason: string): number {
    reason = String.toSentenceCase(reason, true)

    if (reason === 'Ok') reason = 'OK'

    return getStatusCode(reason)
  }
}

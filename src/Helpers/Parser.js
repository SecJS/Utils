/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import ms from 'ms'
import bytes from 'bytes'

import { getReasonPhrase, getStatusCode } from 'http-status-codes'

import { Is } from '#src/Helpers/Is'
import { String } from '#src/Helpers/String'
import { Options } from '#src/Helpers/Options'
import { InvalidNumberException } from '#src/Exceptions/InvalidNumberException'

export class Parser {
  /**
   * Parse a string to array.
   *
   * @param {string} string
   * @param {string} separator
   * @return {string[]}
   */
  static stringToArray(string, separator) {
    return string.split(separator).map(index => index.trim())
  }

  /**
   * Parse an array of strings to a string.
   *
   * @param {string[]} values
   * @param {{
   *   separator?: string,
   *   pairSeparator?: string,
   *   lastSeparator?: string
   * }} [options]
   * @return {string}
   */
  static arrayToString(values, options) {
    if (values.length === 0) {
      return ''
    }

    if (values.length === 1) {
      return values[0]
    }

    if (values.length === 2) {
      return `${values[0]}${options?.pairSeparator || ' and '}${values[1]}`
    }

    const normalized = Options.create(options, {
      separator: ', ',
      lastSeparator: ' and ',
    })

    return (
      values.slice(0, -1).join(normalized.separator) +
      normalized.lastSeparator +
      values[values.length - 1]
    )
  }

  /**
   * Parse a string to number or Coordinate.
   *
   * @param {string} string
   * @param {boolean} isCoordinate
   * @throws {InvalidNumberException}
   * @return {number}
   */
  static stringToNumber(string, isCoordinate = false) {
    if (!string.replace(/\D/g, '')) {
      throw new InvalidNumberException(string)
    }

    string = string.replace(/\D/g, '')

    if (string.length >= 9 || isCoordinate) {
      return parseFloat(string)
    }

    return parseInt(string)
  }

  /**
   * Parse an object to form data.
   *
   * @param {any} object
   * @return {string}
   */
  static jsonToFormData(object) {
    return Object.keys(object)
      .reduce((previous, current) => {
        return previous + `&${current}=${encodeURIComponent(object[current])}`
      }, '')
      .substring(1)
  }

  /**
   * Parse form data to json.
   *
   * @param {string} formData
   * @return {any}
   */
  static formDataToJson(formData) {
    const object = {}

    if (formData.startsWith('?')) formData = formData.replace('?', '')

    formData.split('&').forEach(queries => {
      const query = queries.split('=')

      object[decodeURIComponent(query[0])] = decodeURIComponent(query[1])
    })

    return object
  }

  /**
   * Parses all links inside the string to HTML link
   * with <a href= .../>.
   *
   * @param {string} string
   * @return {string}
   */
  static linkToHref(string) {
    const regex = /(https?:\/\/[^\s]+)/g

    return string.replace(regex, '<a href="$1">$1</a>')
  }

  /**
   * Parses a number to Byte format.
   *
   * @param {number} value
   * @param {object} [options]
   * @param {number} [options.decimalPlaces=2]
   * @param {number} [options.fixedDecimals=false]
   * @param {string} [options.thousandsSeparator=]
   * @param {string} [options.unit=]
   * @param {string} [options.unitSeparator=]
   * @return {string}
   */
  static sizeToByte(value, options) {
    return bytes.format(value, options)
  }

  /**
   * Parses a byte format to number.
   *
   * @param {string|number} byte
   * @return {number}
   */
  static byteToSize(byte) {
    return bytes.parse(byte)
  }

  /**
   * Parses a string to MS format.
   *
   * @param {string} value
   * @return {number}
   */
  static timeToMs(value) {
    return ms(value)
  }

  /**
   * Parses an MS number to time format.
   *
   * @param {number} value
   * @param {boolean} long
   * @return {string}
   */
  static msToTime(value, long = false) {
    return ms(value, { long })
  }

  /**
   * Parses the status code number to it reason in string.
   *
   * @param {string|number} status
   * @return {string}
   */
  static statusCodeToReason(status) {
    return String.toConstantCase(getReasonPhrase(status))
  }

  /**
   * Parses the reason in string to it status code number
   *
   * @param {string} reason
   * @return {number}
   */
  static reasonToStatusCode(reason) {
    reason = String.toSentenceCase(reason, true)

    if (reason === 'Ok') reason = 'OK'

    return getStatusCode(reason)
  }

  /**
   * Parses the database connection url to connection object.
   *
   * @param {string} url
   * @return {{
   *   protocol: string,
   *   user?: string,
   *   password?: string,
   *   host: string|string[],
   *   port?: number,
   *   database: string,
   *   options?: any,
   * }}
   */
  static dbUrlToConnectionObj(url) {
    const urlRegexp =
      /^([^:\\/\s]+):\/\/((.*):(.*)@|)(.*)(:(.*)|)\/(.*)(\?(.+))?/

    /** @type {any[]} */
    const matcher = url.match(urlRegexp)

    const connectionObject = {
      protocol: matcher[1],
      user: null,
      password: null,
      host: null,
      port: null,
      database: matcher[8],
      options: {},
    }

    if (matcher[5].includes(',')) {
      connectionObject.host = matcher[5].split(',')
    } else {
      connectionObject.host = matcher[5]

      if (matcher[5].includes(':')) {
        const [h, p] = matcher[5].split(':')

        connectionObject.host = h
        connectionObject.port = parseInt(p)
      }
    }

    if (connectionObject.database.includes('?')) {
      const [database, options] = connectionObject.database.split('?')

      connectionObject.database = database
      connectionObject.options = this.formDataToJson(options)
    }

    if (matcher[3]) connectionObject.user = matcher[3]
    if (matcher[4]) connectionObject.password = matcher[4]

    return connectionObject
  }

  /**
   * Parses the database connection object to connection url.
   *
   * @param {{
   *   protocol: string,
   *   user?: string,
   *   password?: string,
   *   host: string|string[],
   *   port?: number,
   *   database: string,
   *   options?: any,
   * }} object
   * @return {string}
   */
  static connectionObjToDbUrl(object) {
    const { protocol, user, password, host, port, database, options } = object

    let url = `${protocol}://`

    if (user && password) {
      url = url.concat(user).concat(`:${password}`).concat('@')
    }

    if (Is.Array(host)) {
      url = url.concat(host.join(','))
    } else {
      url = url.concat(host)

      /**
       * If port exists and host does not include more than one host
       */
      if (port && !host.includes(',')) url = url.concat(`:${port}`)
    }

    url = url.concat(`/${database}`)

    if (!Is.Empty(options)) url = url.concat(`?${this.jsonToFormData(options)}`)

    return url
  }
}

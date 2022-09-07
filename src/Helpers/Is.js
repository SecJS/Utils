/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import kindOf from 'kind-of'

import { isIP } from 'node:net'
import { validate } from 'uuid'
import { isCep, isCnpj, isCpf } from 'validator-brazil'

export class Is {
  /**
   * Return the kindOf.
   *
   * @private
   * @param {any} value
   * @return {any}
   */
  static #kindOf(value) {
    const kind = kindOf(value)

    if (
      kind === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(value))
    ) {
      return 'class'
    }

    return kind
  }

  /**
   * Verify if is valid Uuid.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Uuid(value) {
    return validate(value)
  }

  /**
   * Verify if is valid Json.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Json(value) {
    try {
      JSON.parse(value)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Verify if is valid Ip.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Ip(value) {
    // Removes http/https and port/route values
    value = value.replace(/^https?:\/\//, '').split(':')[0]

    return isIP(value) !== 0
  }

  /**
   * Verify if is valid Empty.
   *
   * @param {string|any|any[]} value
   * @return {boolean}
   */
  static Empty(value) {
    if (!value) {
      return true
    }

    if (Is.Array(value)) {
      return !value.length
    }

    if (Is.String(value)) {
      return value.trim().length === 0
    }

    if (Is.Object(value)) {
      return !Object.keys(value).length
    }

    return false
  }

  /**
   * Verify if is a valid Cep.
   *
   * @param {string|number} cep
   * @return {boolean}
   */
  static Cep(cep) {
    if (typeof cep === 'number') cep = cep.toString()

    return isCep(cep)
  }

  /**
   * Verify if is a valid Cpf.
   *
   * @param {string|number} cpf
   * @return {boolean}
   */
  static Cpf(cpf) {
    if (typeof cpf === 'number') cpf = cpf.toString()

    return isCpf(cpf)
  }

  /**
   * Verify if is a valid Cnpj.
   *
   * @param {string|number} cnpj
   * @return {boolean}
   */
  static Cnpj(cnpj) {
    if (typeof cnpj === 'number') cnpj = cnpj.toString()

    return isCnpj(cnpj)
  }

  /**
   * Verify if is a valid Async function.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Async(value) {
    const fnString = value.toString().trim()

    const validation = !!(
      fnString.match(/^async/) || fnString.match(/return _ref[^.]*\.apply/)
    )

    return validation || fnString.includes('new Promise(')
  }

  /**
   * Verify if is a valid Undefined.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Undefined(value) {
    return Is.#kindOf(value) === 'undefined'
  }

  /**
   * Verify if is a valid Null.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Null(value) {
    return Is.#kindOf(value) === 'null'
  }

  /**
   * Verify if is a valid Boolean.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Boolean(value) {
    return Is.#kindOf(value) === 'boolean'
  }

  /**
   * Verify if is a valid Buffer.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Buffer(value) {
    return Is.#kindOf(value) === 'buffer'
  }

  /**
   * Verify if is a valid Number.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Number(value) {
    return Is.#kindOf(value) === 'number'
  }

  /**
   * Verify if is a valid String.
   *
   * @param {any} value
   * @return {boolean}
   */
  static String(value) {
    return Is.#kindOf(value) === 'string'
  }

  /**
   * Verify if is a valid Object.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Object(value) {
    return Is.#kindOf(value) === 'object'
  }

  /**
   * Verify if is a valid Date.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Date(value) {
    return Is.#kindOf(value) === 'date'
  }

  /**
   * Verify if is a valid Array.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Array(value) {
    return Is.#kindOf(value) === 'array'
  }

  /**
   * Verify if is a valid Regexp.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Regexp(value) {
    return Is.#kindOf(value) === 'regexp'
  }

  /**
   * Verify if is a valid Error.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Error(value) {
    return Is.#kindOf(value) === 'error'
  }

  /**
   * Verify if is a valid Function.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Function(value) {
    return Is.#kindOf(value) === 'function'
  }

  /**
   * Verify if is a valid Class.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Class(value) {
    return Is.#kindOf(value) === 'class'
  }

  /**
   * Verify if is a valid Integer.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Integer(value) {
    return Number.isInteger(value)
  }

  /**
   * Verify if is a valid Float.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Float(value) {
    return value !== (value | 0)
  }

  /**
   * Verify if is a valid ArrayOfObjects.
   *
   * @param {any[]} value
   * @return {boolean}
   */
  static ArrayOfObjects(value) {
    if (!value.length) return false

    const results = value.map(v => Is.Object(v))

    return !results.includes(false)
  }
}

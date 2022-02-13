/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import kindOf from 'kind-of'

import { isIP } from 'net'
import { validate } from 'uuid'
import { isCpf, isCep, isCnpj } from 'validator-brazil'

export type KindOfTypes =
  | 'undefined'
  | 'null'
  | 'boolean'
  | 'buffer'
  | 'number'
  | 'string'
  | 'arguments'
  | 'object'
  | 'date'
  | 'array'
  | 'regexp'
  | 'error'
  | 'function'
  | 'class'
  | 'generatorfunction'
  | 'symbol'
  | 'map'
  | 'weakmap'
  | 'set'
  | 'weakset'
  | 'int8array'
  | 'uint8array'
  | 'uint8clampedarray'
  | 'int16array'
  | 'uint16array'
  | 'int32array'
  | 'uint32array'
  | 'float32array'
  | 'float64array'

export class Is {
  private static kindOf(value: any): KindOfTypes {
    const kind = kindOf(value)

    if (
      kind === 'function' &&
      /^class\s/.test(Function.prototype.toString.call(value))
    ) {
      return 'class'
    }

    return kind as KindOfTypes
  }

  static isUuid(value: string): boolean {
    return validate(value)
  }

  /**
   * Json verify if value is valid Json string
   *
   * @param value The value
   * @return Return true/false
   */
  static Json(value: string): boolean {
    try {
      JSON.parse(value)

      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Ip verify if value is empty
   *
   * @param value The value
   * @return Return true/false
   */
  static Ip(value: string): boolean {
    // Removes http/https and port/route values
    value = value.replace(/^https?:\/\//, '').split(':')[0]

    return isIP(value) !== 0
  }

  /**
   * empty verify if value is empty
   *
   * @param value The value
   * @return Return true/false
   */
  static Empty(value: any): boolean {
    if (!value) {
      return true
    }

    if (value instanceof Object && !Is.Array(value)) {
      return !Object.keys(value).length
    }

    if (Array.isArray(value)) {
      return !value.length
    }

    if (typeof value === 'string') {
      return value.trim().length === 0
    }

    return false
  }

  /**
   * Verify if is a valid CEP document
   *
   * @param cep The cep as string or number
   * @return true or false
   */
  static Cep(cep: string | number): boolean {
    if (typeof cep === 'number') cep = cep.toString()

    return isCep(cep)
  }

  /**
   * Verify if is a valid CPF document
   *
   * @param cpf The cpf as string or number
   * @return true or false
   */
  static Cpf(cpf: string | number): boolean {
    if (typeof cpf === 'number') cpf = cpf.toString()

    return isCpf(cpf)
  }

  /**
   * Verify if is a valid CNPJ document
   *
   * @param cnpj The cnpj as string or number
   * @return true or false
   */
  static Cnpj(cnpj: string | number): boolean {
    if (typeof cnpj === 'number') cnpj = cnpj.toString()

    return isCnpj(cnpj)
  }

  /**
   * Verify if is an async function
   *
   * @param value The value
   * @return true or false
   */
  static Async(value: any) {
    const fnString = value.toString().trim()

    const validation = !!(
      fnString.match(/^async/) || fnString.match(/return _ref[^.]*\.apply/)
    )

    return validation || fnString.includes('new Promise(')
  }

  /**
   * Verify if value is undefined
   *
   * @param value The value
   * @return true or false
   */
  static Undefined(value: any): value is undefined {
    return Is.kindOf(value) === 'undefined'
  }

  /**
   * Verify if value is null
   *
   * @param value The value
   * @return true or false
   */
  static Null(value: any): value is null {
    return Is.kindOf(value) === 'null'
  }

  /**
   * Verify if value is boolean
   *
   * @param value The value
   * @return true or false
   */
  static Boolean(value: any): value is boolean {
    return Is.kindOf(value) === 'boolean'
  }

  /**
   * Verify if value is buffer
   *
   * @param value The value
   * @return true or false
   */
  static Buffer(value: any): value is Buffer {
    return Is.kindOf(value) === 'buffer'
  }

  /**
   * Verify if value is number
   *
   * @param value The value
   * @return true or false
   */
  static Number(value: any): value is number {
    return Is.kindOf(value) === 'number'
  }

  /**
   * Verify if value is string
   *
   * @param value The value
   * @return true or false
   */
  static String(value: any): value is string {
    return Is.kindOf(value) === 'string'
  }

  /**
   * Verify if value is objects
   *
   * @param value The value
   * @return true or false
   */
  static Object(value: any): boolean {
    return Is.kindOf(value) === 'object'
  }

  /**
   * Verify if value is date
   *
   * @param value The value
   * @return true or false
   */
  static Date(value: any): value is Date {
    return Is.kindOf(value) === 'date'
  }

  /**
   * Verify if value is array
   *
   * @param value The value
   * @return true or false
   */
  static Array(value: any): value is any[] {
    return Is.kindOf(value) === 'array'
  }

  /**
   * Verify if value is regexp
   *
   * @param value The value
   * @return true or false
   */
  static Regexp(value: any): value is RegExp {
    return Is.kindOf(value) === 'regexp'
  }

  /**
   * Verify if value is error
   *
   * @param value The value
   * @return true or false
   */
  static Error(value: any): boolean {
    return Is.kindOf(value) === 'error'
  }

  /**
   * Verify if value is function
   *
   * @param value The value
   * @return true or false
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  static Function(value: any): value is Function {
    return Is.kindOf(value) === 'function'
  }

  /**
   * Verify if value is class
   *
   * @param value The value
   * @return true or false
   */
  static Class(value: any): boolean {
    return Is.kindOf(value) === 'class'
  }

  /**
   * Verify if value is integer
   *
   * @param value The value
   * @return true or false
   */
  static Integer(value: number): value is number {
    return Number.isInteger(value)
  }

  /**
   * Verify if value is float
   *
   * @param value The value
   * @return true or false
   */
  static Float(value: number): value is number {
    return value !== (value | 0)
  }

  /**
   * Verify if value is Array of objects
   *
   * @param value The value
   * @return true or false
   */
  static ArrayOfObjects(value: any | any[]): boolean {
    if (!value.length) return false

    const results = value.map(v => Is.Object(v))

    return !results.includes(false)
  }
}

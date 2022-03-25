/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { String } from './String'
import { ExceptionJSON } from '../Contracts/ExceptionJSON'

export class Exception extends Error {
  public name: string
  public status: number
  public content: string
  public help?: string
  public code?: string

  constructor(content: string, status = 500, code?: string, help?: string) {
    super(content)

    Object.defineProperty(this, 'name', {
      configurable: true,
      enumerable: false,
      value: this.constructor.name,
      writable: true,
    })

    Object.defineProperty(this, 'status', {
      configurable: true,
      enumerable: false,
      value: status,
      writable: true,
    })

    Object.defineProperty(this, 'code', {
      configurable: true,
      enumerable: false,
      value: code || String.toConstantCase(this.constructor.name),
      writable: true,
    })

    Object.defineProperty(this, 'content', {
      configurable: true,
      enumerable: false,
      value: content,
      writable: true,
    })

    if (help) {
      Object.defineProperty(this, 'help', {
        configurable: true,
        enumerable: false,
        value: help,
        writable: true,
      })
    }

    Error.captureStackTrace(this, this.constructor)
  }

  toJSON(stack = true): ExceptionJSON {
    const json: Partial<ExceptionJSON> = {}

    json.code = this.code
    json.name = this.name
    json.status = this.status
    json.content = this.content

    if (this.help) json.help = this.help
    if (stack) json.stack = this.stack

    return json as ExceptionJSON
  }
}

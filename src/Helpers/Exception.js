/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Youch from 'youch'
import chalk from 'chalk'
import changeCase from 'change-case'
import YouchTerminal from 'youch-terminal'

import { Options } from '#src/Helpers/Options'

export class Exception extends Error {
  /**
   * Creates a new instance of Exception.
   *
   * @param {string} [content]
   * @param {number} [status]
   * @param {string} [code]
   * @param {string} [help]
   * @return {Exception}
   */
  constructor(content, status = 500, code, help) {
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
      value: code || changeCase.constantCase(this.constructor.name),
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

  /**
   * Transform the exception to a valid JSON Object.
   *
   * @param [stack] {boolean}
   * @return {{
   *   code: string,
   *   name: string,
   *   status: number,
   *   content: string,
   *   help?: string,
   *   stack?: string
   * }}
   */
  toJSON(stack = true) {
    const json = {}

    json.code = this.code
    json.name = this.name
    json.status = this.status
    json.content = this.content

    if (this.help) json.help = this.help
    if (stack) json.stack = this.stack

    return json
  }

  /**
   * Prettify the error using Youch API.
   *
   * @param {any} [options]
   * @param {string} [options.prefix]
   * @param {boolean} [options.hideMessage]
   * @param {boolean} [options.hideErrorTitle]
   * @param {boolean} [options.displayShortPath]
   * @param {boolean} [options.displayMainFrameOnly]
   * @return {Promise<string>}
   */
  async prettify(options) {
    options = Options.create(options, {
      displayShortPath: false,
      prefix: '',
      hideErrorTitle: false,
      hideMessage: false,
      displayMainFrameOnly: false,
    })

    const message = `${chalk.yellow.bold('MESSAGE')}\n   ${this.message}`
    const help = ` ${chalk.green.bold('HELP')}\n   ${this.help}`

    this.name = this.code

    if (this.help) {
      this.message = `${message}\n\n${help}`
    } else {
      this.message = `${message}`
    }

    const jsonResponse = await new Youch(this, {}).toJSON()

    return YouchTerminal(jsonResponse, options).concat('\n')
  }
}

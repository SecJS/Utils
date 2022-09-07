/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import debug from 'debug'
import chalk from 'chalk'

import { Is } from '#src/Helpers/Is'

export class Debug {
  /**
   * Get the timestamp ms.
   *
   * @private
   * @return {string}
   */
  static #getTimestamp() {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    }

    return new Date(Date.now()).toLocaleString(undefined, localeStringOptions)
  }

  /**
   * Format the message using Chalk API.
   *
   * @param {string} message
   * @return {string}
   */
  static format(message) {
    if (Is.Object(message)) {
      message = JSON.stringify(message)
    }

    const pid = chalk.yellow(`PID: ${process.pid}`)
    const timestamp = Debug.#getTimestamp()

    return `${chalk.yellow(`[Debug]`)} - ${pid} - ${timestamp} ${chalk.yellow(
      message,
    )}`
  }

  /**
   * Format and throw the message in the stdout accordingly to the namespace.
   *
   * @param {string|any} message
   * @param {string} [namespace]
   * @return {void}
   */
  static log(message, namespace = 'api:main') {
    debug(namespace)(Debug.format(message))
  }
}

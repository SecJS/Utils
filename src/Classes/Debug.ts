/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import debug from 'debug'
import Chalk from 'chalk'

import { Is } from './Is'

export class Debug {
  private context: string
  private namespace: string

  constructor(context = 'API', namespace = 'api:main') {
    this.context = context
    this.namespace = namespace
  }

  private static getTimestamp(): string {
    const localeStringOptions = {
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: '2-digit',
      month: '2-digit',
    }

    return new Date(Date.now()).toLocaleString(
      undefined,
      localeStringOptions as Intl.DateTimeFormatOptions,
    )
  }

  private static format(message: any, context: string) {
    if (Is.Object(message)) {
      message = JSON.stringify(message)
    }

    const pid = Chalk.hex('#7059C1')(`PID: ${process.pid}`)
    const timestamp = Debug.getTimestamp()
    const messageCtx = Chalk.hex('#FFE600')(`[${context}]`)

    return `[SecJS Debugger] - ${pid} - ${timestamp} ${messageCtx} ${Chalk.hex(
      '#7059C1',
    )(message)}`
  }

  /**
   * buildContext - Set the context that will appear in the logs
   *
   * @param context The context
   * @return Debug instance
   */
  buildContext(context: string): Debug {
    this.context = context

    return this
  }

  /**
   * buildNamespace - Set the namespace that debug will show the logs
   *
   * @param namespace The namespace
   * @return Debug instance
   */
  buildNamespace(namespace: string): Debug {
    this.namespace = namespace

    return this
  }

  /**
   * log - Format and throw the message in the stdout accordingly to the namespace
   *
   * @param message The log message
   * @param context The log context, default is API. You can usually use the class or function name as context
   */
  log(message: any) {
    debug(this.namespace)(Debug.format(message, this.context))
  }
}

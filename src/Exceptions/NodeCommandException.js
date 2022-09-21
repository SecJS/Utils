/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class NodeCommandException extends Exception {
  /**
   * Creates a new instance of NodeCommandException.
   *
   * @param {string} command
   * @param {any} error
   * @return {NodeCommandException}
   */
  constructor(command, error) {
    const content = `Error has occurred when executing the command "${command}"`

    let help = ''

    if (error.stdout) {
      help = help.concat(`Command stdout:\n\n${error.stdout}\n\n`)
    }

    if (error.stderr) {
      help = help.concat(`Command stderr:\n\n${error.stderr}\n\n`)
    }

    if (!error.stdout && !error.stdout) {
      help = `Command error:\n\n${JSON.stringify(error)}\n\n`
    }

    super(content, 500, 'E_NODE_EXEC', help)
  }
}

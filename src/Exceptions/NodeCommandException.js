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
   * @param {string?} stdout
   * @param {string?} stderr
   * @return {NodeCommandException}
   */
  constructor(command, stdout, stderr) {
    const content = `Error has occurred when executing the command "${command}"`

    let help = ''

    if (stdout) {
      help = help.concat(`Command stdout:\n\n${stdout}\n\n`)
    }

    if (stderr) {
      help = help.concat(`Command stderr:\n\n${stderr}\n\n`)
    }

    super(content, 500, 'E_NODE_EXEC', help)
  }
}

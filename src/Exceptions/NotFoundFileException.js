/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class NotFoundFileException extends Exception {
  /**
   * Creates a new instance of NotFoundFileException.
   *
   * @param {string} filePath
   * @return {NotFoundFileException}
   */
  constructor(filePath) {
    const content = `The file ${filePath} doesnt exist.`

    super(
      content,
      500,
      'E_NOT_FOUND_FILE',
      'Try using File.create method to create the file.',
    )
  }
}

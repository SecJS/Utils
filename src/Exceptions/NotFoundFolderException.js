/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class NotFoundFolderException extends Exception {
  /**
   * Creates a new instance of NotFoundFolderException.
   *
   * @param {string} filePath
   * @return {NotFoundFolderException}
   */
  constructor(filePath) {
    const content = `The folder ${filePath} doesnt exist.`

    super(
      content,
      500,
      'E_NOT_FOUND_FILE',
      'Try using Folder.create method to create the folder.',
    )
  }
}

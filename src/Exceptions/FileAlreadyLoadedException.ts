/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FileAlreadyLoadedException extends Exception {
  public constructor(fileName: string) {
    const content = `File ${fileName} has been already loaded`

    super(
      content,
      500,
      'FILE_LOADED_ERROR',
      `Do not call File.load or loadSync method more than once for the file ${fileName}`,
    )
  }
}

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FileAlreadyExistException extends Exception {
  public constructor(fileName: string) {
    const content = `File ${fileName} already exists`

    super(
      content,
      500,
      'FILE_EXIST_ERROR',
      `You cannot use File.create or createSync on a file that already exist`,
    )
  }
}

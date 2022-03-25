/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FileDoesntExistException extends Exception {
  public constructor(fileName: string) {
    const content = `File ${fileName} does not exist`

    super(
      content,
      500,
      'FILE_EXIST_ERROR',
      `Try using the File.create or createSync method to create the file ${fileName}. Or provide a content as second parameter in File constructor to create the file`,
    )
  }
}

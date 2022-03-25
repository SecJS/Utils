/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FileWithoutContentException extends Exception {
  public constructor(fileName: string) {
    const content = `Cannot create the file ${fileName} without content`

    super(
      content,
      500,
      'FILE_CONTENT_ERROR',
      `Set the content as second parameter in the File constructor instance`,
    )
  }
}

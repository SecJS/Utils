/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FolderAlreadyExistException extends Exception {
  public constructor(folderName: string) {
    const content = `Folder ${folderName} already exists`

    super(
      content,
      500,
      'FOLDER_EXIST_ERROR',
      `You cannot use Folder.create or createSync on a folder that already exist`,
    )
  }
}

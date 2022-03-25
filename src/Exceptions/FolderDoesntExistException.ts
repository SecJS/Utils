/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FolderDoesntExistException extends Exception {
  public constructor(folderName: string) {
    const content = `Folder ${folderName} does not exist`

    super(
      content,
      500,
      'FOLDER_EXIST_ERROR',
      `Try using the Folder.create or createSync method to create the folder ${folderName}`,
    )
  }
}

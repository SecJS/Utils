/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class FolderAlreadyLoadedException extends Exception {
  public constructor(folderName: string) {
    const content = `Folder ${folderName} has been already loaded`

    super(
      content,
      500,
      'FOLDER_LOADED_ERROR',
      `Do not call Folder.load or loadSync method more than once for the folder ${folderName}`,
    )
  }
}

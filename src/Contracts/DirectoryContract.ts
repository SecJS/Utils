/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { FileContract } from './FileContract'

export interface DirectoryContract {
  name?: string
  path?: string
  files?: FileContract[]
  folders?: DirectoryContract[]
}

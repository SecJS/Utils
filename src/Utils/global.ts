/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '../Helpers/Is'
import { Path } from '../Helpers/Path'
import { File } from '../Helpers/File'
import { Folder } from '../Helpers/Folder'
import { Config } from '../Helpers/Config'

const _global = global as any

// Classes
_global.Is = Is
_global.Path = Path
_global.File = File
_global.Folder = Folder
_global.Config = Config

export {}

declare global {
  const Is: Is
  const Path: Path
  const File: File
  const Folder: Folder
  const Config: Config
}

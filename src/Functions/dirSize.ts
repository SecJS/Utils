/*
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { join } from 'path'
import { readdir, stat } from 'fs/promises'

/**
 * dirSize returns the size of the directory without recursively going through it
 *
 * @param path - the directory path
 * @return size - the size of the directory in bytes
 */
export async function dirSize(path: string): Promise<number> {
  const files = await readdir(path)
  const stats = files.map(file => stat(join(path, file)))

  return (await Promise.all(stats)).reduce(
    (accumulator, { size }) => accumulator + size,
    0,
  )
}

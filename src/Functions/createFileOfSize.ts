/*
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { closeSync, mkdirSync, openSync, writeSync } from 'fs'

/**
 * createFileOfSize creates a file with any size
 *
 * @param fileName - the path to the file
 * @param size - the size of the file to be created
 * @return void
 */
export function createFileOfSize(fileName: string, size: number) {
  const fileNameArray = fileName.split('/')

  fileNameArray.pop()

  const dir = fileNameArray.join('/')

  mkdirSync(dir, { recursive: true })

  const fh = openSync(fileName, 'w')

  writeSync(fh, Buffer.alloc(Math.max(0, size - 2), 'l'))

  closeSync(fh)
}

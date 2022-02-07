/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { createInterface } from 'readline'
import { createWriteStream, createReadStream } from 'fs'

export class Blacklist {
  private readonly filePath?: string

  constructor(filePath?: string) {
    this.filePath = filePath
  }

  /**
   * Add value to a file path
   *
   * @param value The value to be add
   * @param filePath The file path to the blacklist
   * @return void
   */
  async add(value: string, filePath?: string): Promise<void> {
    filePath = filePath || this.filePath

    return new Promise((resolve, reject) => {
      const stream = createWriteStream(filePath, { flags: 'a' })

      stream.write(value + '\n')

      stream.on('error', () => {
        reject(new Error(`Error on writing the value to archive ${filePath}`))
      })

      stream.end(() => resolve())
    })
  }

  /**
   * Find value inside file path
   *
   * @param value The value to find inside file
   * @param filePath The file path to the blacklist
   * @return string|null The value found or null
   */
  async find(value: string, filePath: string): Promise<string | null> {
    filePath = filePath || this.filePath

    const stream = createReadStream(filePath)

    const lines = createInterface({
      input: stream,
      crlfDelay: Infinity,
    })

    lines.on('error', err => {
      throw err
    })

    for await (const line of lines) {
      if (line.match(value)) return line
    }

    return null
  }

  /**
   * Remove value inside file path
   *
   * @param value The value to remove inside file
   * @param filePath The file path to the blacklist
   * @return void The value found or null
   */
  async remove(value: string, filePath: string): Promise<void> {
    filePath = filePath || this.filePath

    return new Promise((resolve, reject) => {
      const readStream = createReadStream(filePath)

      readStream.on('error', err => reject(err))

      readStream.on('data', chunk => {
        const data = chunk.toString().split('\n')
        const newData = data.filter(string => string !== value).join('\n')

        const writeStream = createWriteStream(filePath, { flags: 'w' })

        writeStream.on('error', err => reject(err))

        writeStream.write(newData)
        writeStream.end(() => resolve())
      })
    })
  }
}

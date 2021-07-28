import { createInterface } from 'readline'
import { createWriteStream, createReadStream } from 'fs'

export class Blacklist {
  async add(value: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const stream = createWriteStream(filePath, { flags: 'a' })

      stream.write(value + '\n')

      stream.on('error', () => {
        reject(new Error(`Error on writing the value to archive ${filePath}`))
      })

      stream.end(() => resolve())
    })
  }

  async find(value: string, filePath: string): Promise<string> {
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

  async remove(value: string, filePath: string): Promise<void> {
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

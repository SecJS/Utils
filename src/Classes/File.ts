/*
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import logger from '../utils/logger'

import {
  createWriteStream,
  createReadStream,
  writeFileSync,
  readFileSync,
  existsSync,
  statSync,
  mkdirSync,
  promises,
  rmSync,
} from 'fs'

import { Path } from './Path'
import { lookup } from 'mime-types'
import { randomBytes } from 'crypto'
import { parse, isAbsolute } from 'path'
import { formatBytes } from '../Functions/formatBytes'
import { InternalServerException } from '@secjs/exceptions'

export interface FileJsonContract {
  dir: string
  name: string
  base: string
  path: string
  mime: string
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  fileSize: string
  extension: string
  fileExists: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFileExists: boolean
  content: string
}

export class File {
  constructor(path: string, content: Buffer | null = null) {
    const { ext, dir, name, base, mime } = File.parsePath(path)

    this._originalDir = dir
    this._originalName = name
    this._originalBase = base
    this._originalPath = this._originalDir + '/' + this._originalBase
    this._originalFileExists = existsSync(this._originalPath)
    this._fileExists = this._originalFileExists
    this._content = content
    this._mime = mime
    this._extension = ext
    this.createFileValues()

    if (!this._originalFileExists && !this._content)
      throw new InternalServerException(
        'File does not exist, please provide a content as second parameter in File constructor',
      )
  }

  toJSON(): FileJsonContract {
    return JSON.parse(
      JSON.stringify({
        dir: this.dir,
        name: this.name,
        base: this.base,
        path: this.path,
        mime: this.mime,
        createdAt: this.createdAt,
        accessedAt: this.accessedAt,
        modifiedAt: this.modifiedAt,
        fileSize: this.fileSize,
        extension: this.extension,
        fileExists: this.fileExists,
        originalDir: this.originalDir,
        originalName: this.originalName,
        originalPath: this.originalPath,
        originalFileExists: this.originalFileExists,
        content: this.content,
      }),
    )
  }

  createSync() {
    if (this._fileExists)
      throw new InternalServerException('File already exists')

    if (!this._content)
      throw new InternalServerException('Cannot create a file without content')

    mkdirSync(this._dir, { recursive: true })
    writeFileSync(this._path, this._content)

    this._content = null
    this._fileExists = true

    return this
  }

  async create(): Promise<File> {
    if (this._fileExists)
      throw new InternalServerException('File already exists')

    if (!this._content)
      throw new InternalServerException('Cannot create a file without content')

    await promises.mkdir(this._dir, { recursive: true })

    return new Promise((resolve, reject) => {
      const writable = createWriteStream(this._path)

      writable.on('end', () => {
        this._content = null
        this._fileExists = true

        resolve(this)
      })

      writable.on('error', err => reject(err))
    })
  }

  loadSync(options?: { withContent: boolean }) {
    options = Object.assign({}, { withContent: true }, options)

    if (this._content && this._fileExists)
      throw new InternalServerException('File has been already loaded')

    if (!this._fileExists)
      throw new InternalServerException(
        'File does not exist, use create method to create the file',
      )

    const fileStat = statSync(this._path)

    this._createdAt = fileStat.birthtime
    this._accessedAt = fileStat.atime
    this._modifiedAt = fileStat.mtime
    this._fileSize = formatBytes(fileStat.size, 4)

    if (options.withContent) {
      // 200mb
      if (fileStat.size >= 2e8) {
        logger.debug(
          `Be careful, a file with ${this._fileSize} has been loaded in heap memory`,
        )
      }

      this._content = readFileSync(this._path)
    }

    return this
  }

  async load(options?: { withContent: boolean }): Promise<File> {
    options = Object.assign({}, { withContent: true }, options)

    if (this._content && this._fileExists) {
      throw new InternalServerException('File has been already loaded')
    }

    if (!this._fileExists) {
      throw new InternalServerException(
        'File does not exist, use create method to create the file',
      )
    }

    const fileStat = await promises.stat(this._path)

    this._accessedAt = fileStat.atime
    this._modifiedAt = fileStat.mtime
    this._createdAt = fileStat.birthtime
    this._fileSize = formatBytes(fileStat.size, 4)

    if (!options.withContent) return this

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this._path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => {
        this._content = Buffer.concat(chunks)

        // 200mb
        if (fileStat.size >= 2e8) {
          logger.debug(
            `Be careful, a file with ${this._fileSize} has been loaded in heap memory`,
          )
        }

        resolve(this)
      })

      readable.on('error', err => reject(err))
    })
  }

  getContentSync(): Buffer {
    if (!this._fileExists)
      throw new InternalServerException(
        'File does not exist, use create method to create the file',
      )

    if (this._content) return this._content

    return readFileSync(this._path)
  }

  async getContent(): Promise<Buffer> {
    if (!this._fileExists)
      throw new InternalServerException(
        'File does not exist, use create method to create the file',
      )

    if (this._content) return this._content

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this._path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => resolve(Buffer.concat(chunks)))

      readable.on('error', err => reject(err))
    })
  }

  removeSync() {
    if (!this._fileExists)
      throw new InternalServerException('File does not exist')

    this._content = null
    this._createdAt = null
    this._accessedAt = null
    this._modifiedAt = null
    this._fileSize = null
    this._fileExists = false
    this._originalFileExists = false

    rmSync(this._path, { recursive: true })
  }

  async remove(): Promise<void> {
    if (!this._fileExists)
      throw new InternalServerException('File does not exist')

    this._content = null
    this._createdAt = null
    this._accessedAt = null
    this._modifiedAt = null
    this._fileSize = null
    this._fileExists = false
    this._originalFileExists = false

    await promises.rm(this._path, { recursive: true })
  }

  private createFileValues() {
    if (this._originalFileExists) {
      this._dir = this._originalDir
      this._name = this._originalName
      this._base = this._originalBase
      this._path = this._originalPath

      return
    }

    const bytes = randomBytes(30)
    const buffer = Buffer.from(bytes)

    this._dir = this._originalDir
    this._name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
    this._base = this._name + this._extension
    this._path = this._dir + '/' + this._base
  }

  private static parsePath(path: string) {
    const { base, dir, root } = parse(isAbsolute(path) ? path : Path.pwd(path))

    const baseArray = base.split('.')

    const name = baseArray.splice(0, 1)[0]
    // eslint-disable-next-line array-callback-return
    const ext = baseArray.reduce((accumulator, current) => {
      // eslint-disable-next-line no-return-assign
      if (current !== '') return accumulator + '.' + current
    }, '')
    const mime = lookup(dir + '/' + base)

    return { ext, dir, name, root, base, mime }
  }

  private _dir?: string
  private _name?: string
  private _base?: string
  private _path?: string
  private _content?: Buffer
  private _createdAt?: Date
  private _accessedAt?: Date
  private _modifiedAt?: Date
  private _fileSize?: string
  private _extension: string
  private _originalDir: string
  private _mime: string | false
  private _originalName: string
  private _originalBase: string
  private _originalPath: string
  private _fileExists: boolean
  private _originalFileExists: boolean

  get dir() {
    return this._dir
  }

  get name() {
    return this._name
  }

  get base() {
    return this._base
  }

  get path() {
    return this._path
  }

  get content() {
    return this._content
  }

  get createdAt() {
    return this._createdAt
  }

  get accessedAt() {
    return this._accessedAt
  }

  get modifiedAt() {
    return this._modifiedAt
  }

  get fileSize() {
    return this._fileSize
  }

  get extension() {
    return this._extension
  }

  get originalDir() {
    return this._originalDir
  }

  get mime() {
    return this._mime
  }

  get originalName() {
    return this._originalName
  }

  get originalBase() {
    return this._originalBase
  }

  get originalPath() {
    return this._originalPath
  }

  /**
   * fileExists - If true means the file has been created or already exists
   */
  get fileExists() {
    return this._fileExists
  }

  /**
   * _originalFileExists - If true means the file already exists when creating the instance
   */
  get originalFileExists() {
    return this._originalFileExists
  }
}

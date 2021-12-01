/**
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
import { Parser } from './Parser'
import { lookup } from 'mime-types'
import { randomBytes } from 'crypto'
import { parse, isAbsolute } from 'path'
import { InternalServerException } from '@secjs/exceptions'
import { FileContract } from '@secjs/contracts'

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
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFileExists: boolean
  content: string
}

export class File {
  static async createFileOfSize(filePath: string, size: number) {
    const { dir, path } = File.parsePath(filePath)

    await promises.mkdir(dir, { recursive: true })

    return new Promise((resolve, reject) => {
      const writable = createWriteStream(path)

      writable.write(Buffer.alloc(Math.max(0, size - 2), 'l'))

      writable.end(() => resolve(this))
      writable.on('error', err => reject(err))
    })
  }

  /**
   * Constructor
   *
   * @param filePath Path to the file, it existing or not
   * @param content Default is null
   * @param mockedValues Default is false
   * @param isCopy Default is false
   */
  constructor(
    filePath: string,
    content: Buffer | null = null,
    mockedValues = false,
    isCopy = false,
  ) {
    const { ext, dir, name, base, mime, path } = File.parsePath(filePath)

    this._originalDir = dir
    this._originalName = name
    this._originalBase = base
    this._originalPath = path
    this._isCopy = isCopy
    this._originalFileExists = existsSync(this._originalPath) && !this._isCopy
    this._fileExists = this._originalFileExists
    this._content = content
    this._mime = mime
    this._extension = ext
    this.createFileValues(mockedValues)

    if (!this._originalFileExists && !this._content)
      throw new InternalServerException(
        'File does not exist, please provide a content as second parameter in File constructor',
      )
  }

  toContract(): FileContract {
    return {
      name: this.name,
      path: this.path,
      value: this.getContentSync(),
    }
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
        isCopy: this.isCopy,
        originalDir: this.originalDir,
        originalName: this.originalName,
        originalPath: this.originalPath,
        originalFileExists: this.originalFileExists,
        content: this.content,
      }),
    )
  }

  createSync() {
    if (this._fileExists) {
      throw new InternalServerException(`File ${this._base} already exists`)
    }

    if (!this._content) {
      throw new InternalServerException(
        `Cannot create the file ${this._base} without content`,
      )
    }

    mkdirSync(this._dir, { recursive: true })
    writeFileSync(this._path, this._content)

    this._content = null
    this._fileExists = true

    return this
  }

  async create(): Promise<File> {
    if (this._fileExists) {
      throw new InternalServerException(`File ${this._base} already exists`)
    }

    if (!this._content) {
      throw new InternalServerException(
        `Cannot create the file ${this._base} without content`,
      )
    }

    await promises.mkdir(this._dir, { recursive: true })

    return new Promise((resolve, reject) => {
      const writable = createWriteStream(this._path, { flags: 'w' })

      writable.write(this._content)

      writable.end(() => {
        this._content = null
        this._fileExists = true

        resolve(this)
      })

      writable.on('error', err => reject(err))
    })
  }

  /**
   * load
   *
   * @param options Options
   * @param options.withContent Default is true
   */
  loadSync(options?: { withContent?: boolean }) {
    options = Object.assign({}, { withContent: true }, options)

    if (this._fileSize) {
      throw new InternalServerException(
        `File ${this._base} has been already loaded`,
      )
    }

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    const fileStat = statSync(this._path)

    this._createdAt = fileStat.birthtime
    this._accessedAt = fileStat.atime
    this._modifiedAt = fileStat.mtime
    this._fileSize = Parser.bytesToSize(fileStat.size, 4)

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

  /**
   * load
   *
   * @param options Options
   * @param options.withContent Default is true
   */
  async load(options?: { withContent?: boolean }): Promise<File> {
    options = Object.assign({}, { withContent: true }, options)

    if (this._fileSize) {
      throw new InternalServerException(
        `File ${this._base} has been already loaded`,
      )
    }

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    const fileStat = await promises.stat(this._path)

    this._accessedAt = fileStat.atime
    this._modifiedAt = fileStat.mtime
    this._createdAt = fileStat.birthtime
    this._fileSize = Parser.bytesToSize(fileStat.size, 4)

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

  /**
   * getContent
   *
   * @param options Options
   * @param options.saveContent Default is false
   */
  getContentSync(options?: { saveContent?: boolean }): Buffer {
    options = Object.assign({}, { saveContent: false }, options)

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    if (this._content) return this._content

    const content = readFileSync(this._path)

    if (options.saveContent) this._content = content

    return content
  }

  /**
   * getContent
   *
   * @param options Options
   * @param options.saveContent Default is false
   */
  async getContent(options?: { saveContent?: boolean }): Promise<Buffer> {
    options = Object.assign({}, { saveContent: false }, options)

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    if (this._content) return this._content

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this._path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => {
        const content = Buffer.concat(chunks)

        if (options.saveContent) this._content = content

        resolve(content)
      })

      readable.on('error', err => reject(err))
    })
  }

  removeSync() {
    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

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
    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    this._content = null
    this._createdAt = null
    this._accessedAt = null
    this._modifiedAt = null
    this._fileSize = null
    this._fileExists = false
    this._originalFileExists = false

    await promises.rm(this._path, { recursive: true })
  }

  /**
   * copy
   *
   * @param newFilePath New path to the file
   * @param options Options
   * @param options.withContent Default is true
   * @param options.mockedValues Default is false
   */
  copySync(
    newFilePath: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File {
    options = Object.assign(
      {},
      { withContent: true, mockedValues: false },
      options,
    )

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    const copy = new File(
      newFilePath,
      this.getContentSync(),
      options.mockedValues,
      true,
    ).createSync()

    if (this._fileSize) copy.loadSync(options)

    return copy
  }

  /**
   * copy
   *
   * @param newFilePath New path to the file
   * @param options Options
   * @param options.withContent Default is true
   * @param options.mockedValues Default is false
   */
  async copy(
    newFilePath: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File> {
    options = Object.assign(
      {},
      { withContent: true, mockedValues: false },
      options,
    )

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    const copy = new File(
      newFilePath,
      await this.getContent(),
      options.mockedValues,
      true,
    )

    await copy.create()

    if (this._fileSize) await copy.load(options)

    return copy
  }

  /**
   * move
   *
   * @param filePath New path to the file
   * @param options Options
   * @param options.withContent Default is true
   * @param options.mockedValues Default is false
   */
  moveSync(
    filePath: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File {
    options = Object.assign(
      {},
      { withContent: true, mockedValues: false },
      options,
    )

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    const movedFile = new File(
      filePath,
      this.getContentSync(),
      options.mockedValues,
      false,
    ).createSync()

    if (this._fileSize) movedFile.loadSync(options)

    this.removeSync()

    return movedFile
  }

  /**
   * move
   *
   * @param filePath New path to the file
   * @param options Options
   * @param options.withContent Default is true
   * @param options.mockedValues Default is false
   */
  async move(
    filePath: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File> {
    options = Object.assign({}, { withContent: true }, options)

    if (!this._fileExists) {
      throw new InternalServerException(
        `File ${this._base} does not exist, use create method to create the file`,
      )
    }

    const movedFile = await new File(
      filePath,
      await this.getContent(),
      options.mockedValues,
      false,
    ).create()

    if (this._fileSize) {
      await movedFile.load(options)
    }

    await this.remove()

    return movedFile
  }

  private createFileValues(mockedValues = false) {
    if (mockedValues && !this._originalFileExists) {
      const bytes = randomBytes(30)
      const buffer = Buffer.from(bytes)

      this._dir = this._originalDir
      this._name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
      this._base = this._name + this._extension
      this._path = this._dir + '/' + this._base

      return
    }

    this._dir = this._originalDir
    this._name = this._originalName
    this._base = this._originalBase
    this._path = this._originalPath
  }

  private static parsePath(filePath: string) {
    const { base, dir, root } = parse(
      isAbsolute(filePath) ? filePath : Path.noBuild().pwd(filePath),
    )

    const baseArray = base.split('.')

    const name = baseArray.splice(0, 1)[0]
    // eslint-disable-next-line array-callback-return
    const ext = baseArray.reduce((accumulator, current) => {
      // eslint-disable-next-line no-return-assign
      if (current !== '') return accumulator + '.' + current
    }, '')
    const mime = lookup(dir + '/' + base)

    return { ext, dir, name, root, base, mime, path: dir + '/' + base }
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
  private _isCopy: boolean
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
   * _fileExists - If true means the file has been created or already exists
   */
  get fileExists() {
    return this._fileExists
  }

  /**
   * _isCopy - If true means the file is not a copy from other file.
   */
  get isCopy() {
    return this._isCopy
  }

  /**
   * _originalFileExists - If true means the file already exists when creating the instance
   */
  get originalFileExists() {
    return this._originalFileExists
  }
}

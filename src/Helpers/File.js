/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import prependFile from 'prepend-file'

import {
  appendFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  promises,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'

import { lookup } from 'mime-types'
import { pathToFileURL } from 'node:url'
import { randomBytes } from 'node:crypto'
import { isAbsolute, parse, sep } from 'node:path'

import { Path } from '#src/Helpers/Path'
import { Json } from '#src/Helpers/Json'
import { Debug } from '#src/Helpers/Debug'
import { Parser } from '#src/Helpers/Parser'
import { Options } from '#src/Helpers/Options'
import { NotFoundFileException } from '#src/Exceptions/NotFoundFileException'

export class File {
  /**
   * Creates a new instance of File.
   *
   * @param {string} filePath
   * @param {Buffer} [content]
   * @param {boolean} [mockedValues]
   * @param {boolean} [isCopy]
   * @return {File}
   */
  constructor(
    filePath,
    content = undefined,
    mockedValues = false,
    isCopy = false,
  ) {
    const { ext, dir, name, base, mime, path } = File.#parsePath(filePath)

    /** @type {string} */
    this.originalDir = dir

    /** @type {string} */
    this.originalName = name

    /** @type {string} */
    this.originalBase = base

    /** @type {string} */
    this.originalPath = path

    /** @type {boolean} */
    this.isCopy = isCopy

    /** @type {boolean} */
    this.originalFileExists = File.existsSync(this.originalPath) && !this.isCopy

    /** @type {boolean} */
    this.fileExists = this.originalFileExists

    /** @type {Buffer} */
    this.content = content

    /** @type {string} */
    this.mime = mime

    /** @type {string} */
    this.extension = ext
    this.#createFileValues(mockedValues)

    if (!this.originalFileExists && !this.content) {
      throw new NotFoundFileException(this.originalPath)
    }
  }

  /**
   * Remove the file it's existing or not.
   *
   * @param {string} filePath
   * @return {Promise<void>}
   */
  static async safeRemove(filePath) {
    const { path } = File.#parsePath(filePath)

    if (!(await File.exists(path))) {
      return
    }

    await promises.rm(path, { recursive: false })
  }

  /**
   * Verify if file exists.
   *
   * @param {string} filePath
   * @return {boolean}
   */
  static existsSync(filePath) {
    const { path } = File.#parsePath(filePath)

    return existsSync(path)
  }

  /**
   * Verify if file exists.
   *
   * @param {string} filePath
   * @return {Promise<boolean>}
   */
  static async exists(filePath) {
    const { path } = File.#parsePath(filePath)

    return promises
      .access(path)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Verify if path is from file or directory.
   *
   * @param {string} path
   * @return {boolean}
   */
  static isFileSync(path) {
    const { path: parsedPath } = File.#parsePath(path)

    return statSync(parsedPath).isFile()
  }

  /**
   * Verify if path is from file or directory.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  static async isFile(path) {
    const { path: parsedPath } = File.#parsePath(path)

    return promises.stat(parsedPath).then(stat => stat.isFile())
  }

  /**
   * Create fake file with determined size.
   *
   * @param {string} filePath
   * @param {number} size
   * @return {Promise<typeof File>}
   */
  static async createFileOfSize(filePath, size) {
    const { dir, path } = File.#parsePath(filePath)

    await promises.mkdir(dir, { recursive: true })

    return new Promise((resolve, reject) => {
      const writable = createWriteStream(path)

      writable.write(Buffer.alloc(Math.max(0, size - 2), 'l'))

      writable.end(() => resolve(this))
      writable.on('error', reject)
    })
  }

  /**
   * Parse the file path.
   *
   * @private
   * @param {string} filePath
   * @return {{
   *   ext: string,
   *   path: string,
   *   root: string,
   *   mime: string,
   *   name: string,
   *   dir: string,
   *   base: string
   * }}
   */
  static #parsePath(filePath) {
    if (!isAbsolute(filePath)) {
      filePath = Path.this(filePath, 3)
    }

    const { base, dir, root } = parse(filePath)

    const baseArray = base.split('.')

    const name = baseArray.splice(0, 1)[0]
    const ext = baseArray.reduce((accumulator, current) => {
      return accumulator.concat('.').concat(current)
    }, '')

    const mime = lookup(dir + sep + base)

    return { ext, dir, name, root, base, mime, path: dir + sep + base }
  }

  /**
   * Returns the file as a JSON object.
   *
   * @return {{
   *   dir: string,
   *   name: string,
   *   base: string,
   *   path: string,
   *   mime: string,
   *   createdAt: Date,
   *   accessedAt: Date,
   *   modifiedAt: Date,
   *   fileSize: number,
   *   extension: string,
   *   isCopy: boolean,
   *   originalDir: string,
   *   originalName: string,
   *   originalPath: string,
   *   originalFileExists: boolean,
   *   content: string,
   * }}
   */
  toJSON() {
    return Json.copy({
      dir: this.dir,
      name: this.name,
      base: this.base,
      path: this.path,
      href: this.href,
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
    })
  }

  /**
   * Load or create the file.
   *
   * @param {{
   *   withContent?: boolean,
   *   isInternalLoad?: boolean
   * }} [options]
   * @return {File}
   */
  loadSync(options) {
    options = Options.create(options, {
      withContent: true,
      isInternalLoad: false,
    })

    if (!this.fileExists && this.content) {
      mkdirSync(this.dir, { recursive: true })
      writeFileSync(this.path, this.content)

      this.fileExists = true
    }

    if (this.fileSize && options.isInternalLoad) {
      return this
    }

    const fileStat = statSync(this.path)

    this.createdAt = fileStat.birthtime
    this.accessedAt = fileStat.atime
    this.modifiedAt = fileStat.mtime
    this.fileSize = Parser.sizeToByte(fileStat.size)

    if (!options.withContent) {
      this.content = undefined

      return this
    }

    // 200MB
    if (fileStat.size >= 2e8) {
      Debug.log(
        `File ${this.base} with ${this.fileSize} has been loaded in heap memory.`,
      )
    }

    this.content = this.content || readFileSync(this.path)

    return this
  }

  /**
   * Load or create the file.
   *
   * @param {{
   *   withContent?: boolean,
   *   isInternalLoad?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  async load(options) {
    options = Options.create(options, {
      withContent: true,
      isInternalLoad: false,
    })

    if (!this.fileExists && this.content) {
      await promises.mkdir(this.dir, { recursive: true })

      await new Promise((resolve, reject) => {
        const writable = createWriteStream(this.path, { flags: 'w' })

        writable.write(this.content)

        writable.end(() => {
          this.content = undefined
          this.fileExists = true

          resolve(this)
        })

        writable.on('error', reject)
      })
    }

    if (this.fileSize && options.isInternalLoad) {
      return this
    }

    const fileStat = await promises.stat(this.path)

    this.accessedAt = fileStat.atime
    this.modifiedAt = fileStat.mtime
    this.createdAt = fileStat.birthtime
    this.fileSize = Parser.sizeToByte(fileStat.size)

    if (!options.withContent) {
      this.content = undefined

      return this
    }

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this.path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => {
        this.content = Buffer.concat(chunks)

        // 200mb
        if (fileStat.size >= 2e8) {
          Debug.log(
            `File ${this.base} with ${this.fileSize} has been loaded in heap memory.`,
          )
        }

        resolve(this)
      })

      readable.on('error', reject)
    })
  }

  /**
   * Remove the file.
   *
   * @return {void}
   */
  removeSync() {
    if (!this.fileExists) {
      throw new NotFoundFileException(this.path)
    }

    this.content = undefined
    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.fileSize = undefined
    this.fileExists = false
    this.originalFileExists = false

    rmSync(this.path, { recursive: true })
  }

  /**
   * Remove the file.
   *
   * @return {Promise<void>}
   */
  async remove() {
    if (!this.fileExists) {
      throw new NotFoundFileException(this.path)
    }

    this.content = undefined
    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.fileSize = undefined
    this.fileExists = false
    this.originalFileExists = false

    await promises.rm(this.path, { recursive: true })
  }

  /**
   * Create a copy of the file.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {File}
   */
  copySync(path, options) {
    path = File.#parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    this.loadSync({ isInternalLoad: true, withContent: options.withContent })

    return new File(
      path,
      this.getContentSync(),
      options.mockedValues,
      true,
    ).loadSync(options)
  }

  /**
   * Create a copy of the file.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  async copy(path, options) {
    path = File.#parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    await this.load({ isInternalLoad: true, withContent: options.withContent })

    return new File(
      path,
      await this.getContent(),
      options.mockedValues,
      true,
    ).load(options)
  }

  /**
   * Move the file to other path.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {File}
   */
  moveSync(path, options) {
    path = File.#parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    this.loadSync({ isInternalLoad: true, withContent: options.withContent })

    const movedFile = new File(
      path,
      this.getContentSync(),
      options.mockedValues,
      false,
    ).loadSync(options)

    this.removeSync()

    return movedFile
  }

  /**
   * Move the file to other path.
   *
   * @param {string} path
   * @param {{
   *   withContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  async move(path, options) {
    path = File.#parsePath(path).path

    options = Options.create(options, {
      withContent: true,
      mockedValues: false,
    })

    await this.load({ isInternalLoad: true, withContent: options.withContent })

    const movedFile = await new File(
      path,
      await this.getContent(),
      options.mockedValues,
      false,
    ).load(options)

    await this.remove()

    return movedFile
  }

  /**
   * Append any data to the file.
   *
   * @param {string|Buffer} data
   * @return {File}
   */
  appendSync(data) {
    this.loadSync({ isInternalLoad: true, withContent: false })

    appendFileSync(this.path, data)
    this.loadSync({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Append any data to the file.
   *
   * @param {string|Buffer} data
   * @return {Promise<File>}
   */
  async append(data) {
    await this.load({ isInternalLoad: true, withContent: false })

    const writeStream = createWriteStream(this.path, { flags: 'a' })

    await new Promise((resolve, reject) => {
      writeStream.write(data)
      writeStream.end(resolve)
      writeStream.on('error', reject)
    })
    await this.load({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Prepend any data to the file.
   *
   * @param {string|Buffer} data
   * @return {File}
   */
  prependSync(data) {
    this.loadSync({ isInternalLoad: true, withContent: false })

    prependFile.sync(this.path, data)
    this.loadSync({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Prepend any data to the file.
   *
   * @param {string|Buffer} data
   * @return {Promise<File>}
   */
  async prepend(data) {
    await this.load({ isInternalLoad: true, withContent: false })

    await prependFile(this.path, data)
    await this.load({ isInternalLoad: false, withContent: !!this.content })

    return this
  }

  /**
   * Get only the content of the file.
   *
   * @param {{
   *   saveContent?: boolean
   * }} [options]
   * @return {Buffer}
   */
  getContentSync(options) {
    this.loadSync({ isInternalLoad: true, withContent: false })

    options = Options.create(options, { saveContent: false })

    const content = readFileSync(this.path)

    if (options.saveContent) {
      this.content = content
    }

    return content
  }

  /**
   * Get only the content of the file.
   *
   * @param {{
   *   saveContent?: boolean
   * }} [options]
   * @return {Promise<Buffer>}
   */
  async getContent(options) {
    await this.load({ isInternalLoad: true, withContent: false })

    options = Options.create(options, { saveContent: false })

    if (this.content) {
      return this.content
    }

    return new Promise((resolve, reject) => {
      const readable = createReadStream(this.path)

      const chunks = []

      readable.on('data', chunk => chunks.push(chunk))
      readable.on('end', () => {
        const content = Buffer.concat(chunks)

        if (options.saveContent) {
          this.content = content
        }

        resolve(content)
      })

      readable.on('error', reject)
    })
  }

  /**
   * Create file values.
   *
   * @private
   * @param {boolean?} mockedValues
   * @return {void}
   */
  #createFileValues(mockedValues) {
    if (mockedValues && !this.originalFileExists) {
      const bytes = randomBytes(30)
      const buffer = Buffer.from(bytes)

      this.dir = this.originalDir
      this.name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
      this.base = this.name + this.extension
      this.path = this.dir + '/' + this.base
      this.href = pathToFileURL(this.path).href

      return
    }

    this.dir = this.originalDir
    this.name = this.originalName
    this.base = this.originalBase
    this.path = this.originalPath
    this.href = pathToFileURL(this.path).href
  }
}

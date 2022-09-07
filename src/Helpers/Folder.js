/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import minimatch from 'minimatch'

import {
  existsSync,
  mkdirSync,
  promises,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs'

import { randomBytes } from 'node:crypto'
import { isAbsolute, join, parse, resolve, sep } from 'node:path'

import { Json } from '#src/Helpers/Json'
import { File } from '#src/Helpers/File'
import { Parser } from '#src/Helpers/Parser'
import { Options } from '#src/Helpers/Options'
import { NotFoundFolderException } from '#src/Exceptions/NotFoundFolderException'
import { Path } from '#src/Helpers/Path'

export class Folder {
  /**
   * Creates a new instance of Folder.
   *
   * @param {string} folderPath
   * @param {boolean} [mockedValues]
   * @param {boolean} [isCopy]
   * @return {Folder}
   */
  constructor(folderPath, mockedValues = false, isCopy = false) {
    const { dir, name, path } = Folder.#parsePath(folderPath)

    /** @type {File[]} */
    this.files = []

    /** @type {Folder[]} */
    this.folders = []

    /** @type {string} */
    this.originalDir = dir

    /** @type {string} */
    this.originalName = name

    /** @type {string} */
    this.originalPath = path

    /** @type {boolean} */
    this.isCopy = isCopy

    /** @type {boolean} */
    this.originalFolderExists =
      Folder.existsSync(this.originalPath) && !this.isCopy

    /** @type {boolean} */
    this.folderExists = this.originalFolderExists

    this.#createFolderValues(mockedValues)
  }

  /**
   * Get the size of the folder.
   *
   * @param {string} folderPath
   * @return {number}
   */
  static folderSizeSync(folderPath) {
    const files = readdirSync(folderPath)
    const stats = files.map(file => statSync(join(folderPath, file)))

    return stats.reduce((accumulator, { size }) => accumulator + size, 0)
  }

  /**
   * Get the size of the folder.
   *
   * @param {string} folderPath
   * @return {Promise<number>}
   */
  static async folderSize(folderPath) {
    const files = await promises.readdir(folderPath)
    const stats = files.map(file => promises.stat(join(folderPath, file)))

    return (await Promise.all(stats)).reduce(
      (accumulator, { size }) => accumulator + size,
      0,
    )
  }

  /**
   * Remove the folder it's existing or not.
   *
   * @param {string} folderPath
   * @return {Promise<void>}
   */
  static async safeRemove(folderPath) {
    const { path } = Folder.#parsePath(folderPath)

    if (!(await Folder.exists(path))) {
      return
    }

    await promises.rm(path, { recursive: true })
  }

  /**
   * Verify if folder exists.
   *
   * @param {string} folderPath
   * @return {boolean}
   */
  static existsSync(folderPath) {
    const { path } = Folder.#parsePath(folderPath)

    return existsSync(path)
  }

  /**
   * Verify if folder exists.
   *
   * @param {string} folderPath
   * @return {Promise<boolean>}
   */
  static async exists(folderPath) {
    const { path } = Folder.#parsePath(folderPath)

    return promises
      .access(path)
      .then(() => true)
      .catch(() => false)
  }

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {boolean}
   */
  static isFolderSync(path) {
    const { path: parsedPath } = Folder.#parsePath(path)

    return statSync(parsedPath).isDirectory()
  }

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  static async isFolder(path) {
    const { path: parsedPath } = Folder.#parsePath(path)

    return promises.stat(parsedPath).then(stat => stat.isDirectory())
  }

  /**
   * Get sub files of folder.
   *
   * @param {Folder[]} folders
   * @param {string} [pattern]
   * @return {File[]}
   */
  static #getSubFiles(folders, pattern) {
    const files = []

    folders.forEach(folder => {
      folder.files.forEach(file => {
        if (!pattern) {
          files.push(file)

          return
        }

        if (minimatch(file.path, pattern)) {
          files.push(file)
        }
      })

      if (folder.folders.length) {
        files.push(...this.#getSubFiles(folder.folders, pattern))
      }
    })

    return files
  }

  /**
   * Get sub folders of folder.
   *
   * @param {Folder} folder
   * @param {boolean} recursive
   * @param {string} [pattern]
   * @return {Folder[]}
   */
  static #getSubFolders(folder, recursive, pattern) {
    const subFolders = []

    folder.folders.forEach(f => {
      if (!pattern) {
        subFolders.push(f)
      }

      if (recursive && f.folders.length) {
        subFolders.push(...this.#getSubFolders(f, recursive, pattern))
      }

      if (pattern && minimatch(f.path, pattern)) {
        subFolders.push(f)
      }
    })

    return subFolders
  }

  /**
   * Parse the folder path.
   *
   * @private
   * @param {string} folderPath
   * @return {{path: string, name: string, dir: string}}
   */
  static #parsePath(folderPath) {
    if (!isAbsolute(folderPath)) {
      folderPath = Path.this(folderPath, 3)
    }

    const { dir, name, ext } = parse(folderPath)

    let path = dir.concat(sep, name)

    if (ext) {
      path = path.concat(ext)
    }

    return { dir, name, path }
  }

  /**
   * Returns the file as a JSON object.
   *
   * @return {{
   *   dir: string,
   *   name: string,
   *   base: string,
   *   path: string,
   *   files: File[],
   *   folders: Folder[],
   *   createdAt: Date,
   *   accessedAt: Date,
   *   modifiedAt: Date,
   *   folderSize: number,
   *   isCopy: boolean,
   *   originalDir: string,
   *   originalName: string,
   *   originalPath: string,
   *   originalFolderExists: boolean
   * }}
   */
  toJSON() {
    return Json.copy({
      dir: this.dir,
      name: this.name,
      path: this.path,
      files: this.files.map(file => file.toJSON()),
      folders: this.folders.map(folder => folder.toJSON()),
      createdAt: this.createdAt,
      accessedAt: this.accessedAt,
      modifiedAt: this.modifiedAt,
      folderSize: this.folderSize,
      originalDir: this.originalDir,
      originalName: this.originalName,
      originalPath: this.originalPath,
      folderExists: this.folderExists,
      isCopy: this.isCopy,
      originalFolderExists: this.originalFolderExists,
    })
  }

  /**
   * Load or create the folder.
   *
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   isInternalLoad?: boolean,
   * }} [options]
   * @return {Folder}
   */
  loadSync(options) {
    options = Options.create(options, {
      withSub: true,
      withFileContent: false,
      isInternalLoad: false,
    })

    if (!this.folderExists) {
      mkdirSync(this.path, { recursive: true })

      this.folderExists = true
    }

    if (this.folderSize && options.isInternalLoad) {
      return this
    }

    const folderStat = statSync(this.path)

    this.createdAt = folderStat.birthtime
    this.accessedAt = folderStat.atime
    this.modifiedAt = folderStat.mtime
    this.folderSize = Parser.sizeToByte(Folder.folderSizeSync(this.path))

    if (!options.withSub) {
      return this
    }

    this.#loadSubSync(
      this.path,
      readdirSync(this.path, { withFileTypes: true }),
      options.withFileContent,
    )

    return this
  }

  /**
   * Load or create the folder.
   *
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   isInternalLoad?: boolean,
   * }} [options]
   * @return {Promise<Folder>}
   */
  async load(options) {
    options = Options.create(options, {
      withSub: true,
      withFileContent: false,
      isInternalLoad: false,
    })

    if (!this.folderExists) {
      await promises.mkdir(this.path, { recursive: true })

      this.folderExists = true
    }

    if (this.folderSize && options.isInternalLoad) {
      return this
    }

    const folderStat = await promises.stat(this.path)

    this.createdAt = folderStat.birthtime
    this.accessedAt = folderStat.atime
    this.modifiedAt = folderStat.mtime
    this.folderSize = Parser.sizeToByte(await Folder.folderSize(this.path))

    if (!options.withSub) {
      return this
    }

    await this.#loadSub(
      this.path,
      await promises.readdir(this.path, { withFileTypes: true }),
      options.withFileContent,
    )

    return this
  }

  /**
   * Remove the folder.
   *
   * @return {void}
   */
  removeSync() {
    if (!this.folderExists) {
      throw new NotFoundFolderException(this.name)
    }

    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.folderSize = undefined
    this.folderExists = false
    this.originalFolderExists = false
    this.files = []
    this.folders = []

    rmSync(this.path, { recursive: true })
  }

  /**
   * Remove the folder.
   *
   * @return {Promise<void>}
   */
  async remove() {
    if (!this.folderExists) {
      throw new NotFoundFolderException(this.name)
    }

    this.createdAt = undefined
    this.accessedAt = undefined
    this.modifiedAt = undefined
    this.folderSize = undefined
    this.folderExists = false
    this.originalFolderExists = false
    this.files = []
    this.folders = []

    await promises.rm(this.path, { recursive: true })
  }

  /**
   * Create a copy of the folder.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Folder}
   */
  copySync(path, options) {
    path = Folder.#parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withFileContent: false,
      mockedValues: false,
    })

    this.loadSync({
      withSub: options.withSub,
      withContent: options.withFileContent,
      isInternalLoad: true,
    })

    const folder = new Folder(path, options.mockedValues, true).loadSync(
      options,
    )

    folder.files = this.files.map(f => {
      return f.copySync(`${folder.path}/${f.base}`, {
        mockedValues: options.mockedValues,
        withContent: options.withFileContent,
      })
    })

    folder.folders = this.folders.map(f => {
      return f.copySync(`${folder.path}/${f.base}`, {
        withSub: options.withSub,
        mockedValues: options.mockedValues,
        withContent: options.withFileContent,
      })
    })

    return folder
  }

  /**
   * Create a copy of the folder.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<Folder>}
   */
  async copy(path, options) {
    path = Folder.#parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withFileContent: false,
      mockedValues: false,
    })

    await this.load({
      withSub: options.withSub,
      withContent: options.withFileContent,
      isInternalLoad: true,
    })

    const folder = await new Folder(path, options.mockedValues, true).load(
      options,
    )

    folder.files = await Promise.all(
      this.files.map(f => {
        return f.copy(`${folder.path}/${f.base}`, {
          mockedValues: options.mockedValues,
          withContent: options.withFileContent,
        })
      }),
    )

    folder.folders = await Promise.all(
      this.folders.map(f => {
        return f.copy(`${folder.path}/${f.name}`, {
          withSub: options.withSub,
          mockedValues: options.mockedValues,
          withContent: options.withFileContent,
        })
      }),
    )

    return folder
  }

  /**
   * Move the folder to other path.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Folder}
   */
  moveSync(path, options) {
    path = Folder.#parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withFileContent: false,
      mockedValues: false,
    })

    this.loadSync({
      withSub: options.withSub,
      withContent: options.withFileContent,
      isInternalLoad: true,
    })

    const folder = new Folder(path, options.mockedValues, true).loadSync(
      options,
    )

    folder.files = this.files.map(f => {
      return f.moveSync(`${folder.path}/${f.base}`, {
        mockedValues: options.mockedValues,
        withContent: options.withFileContent,
      })
    })

    folder.folders = this.folders.map(f => {
      return f.moveSync(`${folder.path}/${f.name}`, {
        withSub: options.withSub,
        mockedValues: options.mockedValues,
        withContent: options.withFileContent,
      })
    })

    this.removeSync()

    return folder
  }

  /**
   * Move the folder to other path.
   *
   * @param {string} path
   * @param {{
   *   withSub?: boolean,
   *   withFileContent?: boolean,
   *   mockedValues?: boolean
   * }} [options]
   * @return {Promise<Folder>}
   */
  async move(path, options) {
    path = Folder.#parsePath(path).path

    options = Options.create(options, {
      withSub: true,
      withFileContent: false,
      mockedValues: false,
    })

    await this.load({
      withSub: options.withSub,
      withContent: options.withFileContent,
      isInternalLoad: true,
    })

    const folder = await new Folder(path, options.mockedValues, true).load(
      options,
    )

    folder.files = await Promise.all(
      this.files.map(f => {
        return f.move(`${folder.path}/${f.base}`, {
          mockedValues: options.mockedValues,
          withContent: options.withFileContent,
        })
      }),
    )

    folder.folders = await Promise.all(
      this.folders.map(f => {
        return f.move(`${folder.path}/${f.name}`, {
          withSub: options.withSub,
          mockedValues: options.mockedValues,
          withContent: options.withFileContent,
        })
      }),
    )

    await this.remove()

    return folder
  }

  /**
   * Get all the files of folder using glob pattern.
   *
   * @param {string} [pattern]
   * @param {boolean} [recursive]
   * @return {File[]}
   */
  getFilesByPattern(pattern, recursive = false) {
    this.loadSync({ withSub: true, isInternalLoad: true })

    if (pattern) {
      pattern = `${this.path.replace(/\\/g, '/')}/${pattern}`
    }

    const files = []

    this.files.forEach(file => {
      if (pattern && minimatch(file.path, pattern)) {
        files.push(file)

        return
      }

      files.push(file)
    })

    if (recursive) {
      files.push(...Folder.#getSubFiles(this.folders, pattern))
    }

    return files
  }

  /**
   * Get all the folders of folder using glob pattern.
   *
   * @param {string} [pattern]
   * @param {boolean} [recursive]
   * @return {Folder[]}
   */
  getFoldersByPattern(pattern, recursive = false) {
    this.loadSync({ withSub: true, isInternalLoad: true })

    if (pattern) {
      pattern = `${this.path.replace(/\\/g, '/')}/${pattern}`
    }

    const folders = []

    this.folders.forEach(folder => {
      if (recursive && folder.folders.length) {
        folders.push(...Folder.#getSubFolders(folder, recursive, pattern))
      }

      if (pattern && minimatch(folder.path, pattern)) {
        folders.push(folder)

        return
      }

      folders.push(folder)
    })

    return folders
  }

  /**
   * Create folder values.
   *
   * @param {boolean?} mockedValues
   * @return {void}
   */
  #createFolderValues(mockedValues) {
    if (mockedValues && !this.originalFolderExists) {
      const bytes = randomBytes(8)
      const buffer = Buffer.from(bytes)

      this.dir = this.originalDir
      this.name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
      this.path = this.dir + '/' + this.name

      return
    }

    this.dir = this.originalDir
    this.name = this.originalName
    this.path = this.originalPath
  }

  /**
   * Load sub files/folder of folder.
   *
   * @param {string} path
   * @param {Dirent[]} dirents
   * @param {boolean} withFileContent
   * @return {void}
   */
  #loadSubSync(path, dirents, withFileContent) {
    dirents.forEach(dirent => {
      const name = resolve(path, dirent.name)

      if (dirent.isDirectory()) {
        const folder = new Folder(name).loadSync({
          withSub: true,
          withFileContent,
          isInternalLoad: true,
        })

        this.folders.push(folder)

        return
      }

      const file = new File(name).loadSync({
        withContent: withFileContent,
        isInternalLoad: true,
      })

      this.files.push(file)
    })
  }

  /**
   * Load sub files/folder of folder.
   *
   * @param {string} path
   * @param {Dirent[]} dirents
   * @param {boolean} withFileContent
   * @return {Promise<void>}
   */
  async #loadSub(path, dirents, withFileContent) {
    const files = []
    const folders = []

    dirents.forEach(dirent => {
      const name = resolve(path, dirent.name)

      if (dirent.isDirectory()) {
        const folder = new Folder(name).load({
          withSub: true,
          withFileContent,
          isInternalLoad: true,
        })

        folders.push(folder)

        return
      }

      const file = new File(name).load({
        withContent: withFileContent,
        isInternalLoad: true,
      })

      files.push(file)
    })

    this.files = await Promise.all(files)
    this.folders = await Promise.all(folders)
  }
}

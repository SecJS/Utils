/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import minimatch from 'minimatch'

import {
  Dirent,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  promises,
  rmSync,
} from 'fs'

import { File } from './File'
import { Path } from './Path'
import { Parser } from './Parser'
import { randomBytes } from 'crypto'
import { isAbsolute, join, parse, resolve } from 'path'
import { InternalServerException } from '@secjs/exceptions'
import { DirectoryContract } from '../Contracts/DirectoryContract'

export interface FolderJsonContract {
  dir: string
  name: string
  path: string
  files: File[]
  // eslint-disable-next-line no-use-before-define
  folders: Folder[]
  createdAt?: Date
  accessedAt?: Date
  modifiedAt?: Date
  folderSize?: string
  originalDir: string
  originalName: string
  originalPath: string
  folderExists: boolean
  originalFolderExists: boolean
}

export class Folder {
  static async folderSize(folderPath: string): Promise<number> {
    const files = await promises.readdir(folderPath)
    const stats = files.map(file => promises.stat(join(folderPath, file)))

    return (await Promise.all(stats)).reduce(
      (accumulator, { size }) => accumulator + size,
      0,
    )
  }

  static async safeRemove(dir: string): Promise<void> {
    try {
      await promises.rm(dir, { recursive: true })
    } catch (err) {}
  }

  /**
   * Constructor
   *
   * @param folderPath Path to the file, it existing or not
   * @param mockedValues Default is false
   * @param isCopy Default is false
   */
  constructor(folderPath: string, mockedValues = false, isCopy = false) {
    const { dir, name, path } = Folder.parsePath(folderPath)

    this._originalDir = dir
    this._originalName = name
    this._originalPath = path
    this._isCopy = isCopy
    this._originalFolderExists = existsSync(this._originalPath) && !this._isCopy
    this._folderExists = this._originalFolderExists

    this.createFolderValues(mockedValues)
  }

  toContract(buffer = false): DirectoryContract {
    return {
      name: this.name,
      files: this.files.map(file => file.toContract(buffer)),
      folders: this.folders.map(folder => folder.toContract(buffer)),
    }
  }

  toJSON(): FolderJsonContract {
    return JSON.parse(
      JSON.stringify({
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
      }),
    )
  }

  createSync() {
    if (this._folderExists) {
      throw new InternalServerException(`Folder ${this._name} already exists`)
    }

    mkdirSync(this.path, { recursive: true })

    this._folderExists = true

    return this
  }

  async create(): Promise<Folder> {
    if (this._folderExists) {
      throw new InternalServerException(`Folder ${this._name} already exists`)
    }

    await promises.mkdir(this.path, { recursive: true })

    this._folderExists = true

    return this
  }

  /**
   * load
   *
   * @param options Options
   * @param options.withSub Default is true
   * @param options.withFileContent Default is false
   */
  loadSync(options?: { withSub?: boolean; withFileContent?: boolean }) {
    options = Object.assign(
      {},
      { withSub: true, withFileContent: false },
      options,
    )

    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    if (this._files.length || this._folders.length) {
      throw new InternalServerException(
        `Folder ${this._name} has been already loaded`,
      )
    }

    const folderStat = statSync(this._path)

    this._createdAt = folderStat.birthtime
    this._accessedAt = folderStat.atime
    this._modifiedAt = folderStat.mtime
    this._folderSize = Parser.sizeToByte(folderStat.size)

    if (options.withSub) {
      this.loadSubSync(
        this._path,
        readdirSync(this._path, { withFileTypes: true }),
        options.withFileContent,
      )
    }

    return this
  }

  /**
   * load
   *
   * @param options Options
   * @param options.withSub Default is true
   * @param options.withFileContent Default is false
   */
  async load(options?: {
    withSub?: boolean
    withFileContent?: boolean
  }): Promise<Folder> {
    options = Object.assign(
      {},
      { withSub: true, withFileContent: false },
      options,
    )

    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    if (this._files.length || this._folders.length) {
      throw new InternalServerException(
        `Folder ${this._name} has been already loaded`,
      )
    }

    const folderStat = await promises.stat(this._path)

    this._createdAt = folderStat.birthtime
    this._accessedAt = folderStat.atime
    this._modifiedAt = folderStat.mtime
    this._folderSize = Parser.sizeToByte(folderStat.size)

    if (options.withSub) {
      await this.loadSub(
        this._path,
        await promises.readdir(this._path, { withFileTypes: true }),
        options.withFileContent,
      )
    }

    return this
  }

  removeSync() {
    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    this._createdAt = null
    this._accessedAt = null
    this._modifiedAt = null
    this._folderSize = null
    this._folderExists = false
    this._originalFolderExists = false
    this._files = []
    this._folders = []

    rmSync(this._path, { recursive: true })
  }

  async remove(): Promise<void> {
    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    this._createdAt = null
    this._accessedAt = null
    this._modifiedAt = null
    this._folderSize = null
    this._folderExists = false
    this._originalFolderExists = false
    this._files = []
    this._folders = []

    await promises.rm(this._path, { recursive: true })
  }

  /**
   * copy
   *
   * @param newFolderPath New path to the file
   * @param options Options
   * @param options.withSub Default is true
   * @param options.withFileContent Default is false
   * @param options.mockedValues Default is false
   */
  copySync(
    newFolderPath: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder {
    options = Object.assign(
      {},
      { withSub: true, withFileContent: false, mockedValues: false },
      options,
    )

    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    const copy = new Folder(
      newFolderPath,
      options.mockedValues,
      true,
    ).createSync()

    this._folders.forEach(folder => {
      return new Folder(
        `${copy.path}/${folder.name}`,
        options.mockedValues,
        true,
      ).createSync()
    })

    this._files.forEach(file => {
      new File(
        `${copy.path}/${file.base}`,
        file.getContentSync(),
        options.mockedValues,
        true,
      ).createSync()
    })

    if (this._folderSize) copy.loadSync(options)

    return copy
  }

  /**
   * copy
   *
   * @param newFolderPath New path to the file
   * @param options Options
   * @param options.withSub Default is true
   * @param options.withFileContent Default is false
   * @param options.mockedValues Default is false
   */
  async copy(
    newFolderPath: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder> {
    options = Object.assign(
      {},
      { withSub: true, withFileContent: false, mockedValues: false },
      options,
    )

    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    const copy = await new Folder(
      newFolderPath,
      options.mockedValues,
      true,
    ).create()

    await Promise.all(
      this._folders.map(folder => {
        return new Folder(
          `${copy.path}/${folder.name}`,
          options.mockedValues,
          true,
        ).create()
      }),
    )

    await Promise.all(
      this._files.map(file => {
        return file.getContent().then(content => {
          return new File(
            `${copy.path}/${file.base}`,
            content,
            options.mockedValues,
            true,
          ).create()
        })
      }),
    )

    if (this._folderSize) await copy.load(options)

    return copy
  }

  /**
   * move
   *
   * @param folderPath New path to the file
   * @param options Options
   * @param options.withSub Default is true
   * @param options.withFileContent Default is false
   * @param options.mockedValues Default is false
   */
  moveSync(
    folderPath: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder {
    options = Object.assign(
      {},
      { withSub: true, withFileContent: false, mockedValues: false },
      options,
    )

    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    const copy = new Folder(
      folderPath,
      options.mockedValues,
      false,
    ).createSync()

    this._folders.forEach(folder => {
      return new Folder(
        `${copy.path}/${folder.name}`,
        options.mockedValues,
        false,
      ).createSync()
    })

    this._files.forEach(file => {
      new File(
        `${copy.path}/${file.base}`,
        file.getContentSync(),
        options.mockedValues,
        false,
      ).createSync()
    })

    if (this._folderSize) copy.loadSync(options)

    this.removeSync()

    return copy
  }

  /**
   * move
   *
   * @param folderPath New path to the file
   * @param options Options
   * @param options.withSub Default is true
   * @param options.withFileContent Default is false
   * @param options.mockedValues Default is false
   */
  async move(
    folderPath: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder> {
    options = Object.assign(
      {},
      { withSub: true, withFileContent: false, mockedValues: false },
      options,
    )

    if (!this._folderExists) {
      throw new InternalServerException(
        `Folder ${this._name} does not exist, use create method to create the folder`,
      )
    }

    const copy = await new Folder(
      folderPath,
      options.mockedValues,
      false,
    ).create()

    await Promise.all(
      this._folders.map(folder => {
        return new Folder(
          `${copy.path}/${folder.name}`,
          options.mockedValues,
          false,
        ).create()
      }),
    )

    await Promise.all(
      this._files.map(file => {
        return file.getContent().then(content => {
          return new File(
            `${copy.path}/${file.base}`,
            content,
            options.mockedValues,
            false,
          ).create()
        })
      }),
    )

    if (this._folderSize) await copy.load(options)

    await this.remove()

    return copy
  }

  /**
   * getFilesByPattern
   *
   * @param pattern The pattern of files path to match
   * @param recursive Default is false
   */
  getFilesByPattern(pattern: string, recursive = false): File[] {
    const files = []

    this._files.forEach(file => {
      if (minimatch(file.path, `${this.path}/${pattern}`)) {
        files.push(file)
      }
    })

    if (recursive) {
      files.push(
        ...Folder.getSubFiles(this._folders, `${this.path}/${pattern}`),
      )
    }

    return files
  }

  /**
   * getFoldersByPattern
   *
   * @param pattern The pattern of folders path to match
   * @param recursive Default is false
   */
  getFoldersByPattern(pattern: string, recursive = false): Folder[] {
    const folders = []

    this._folders.forEach(folder => {
      if (minimatch(folder.path, `${this.path}/${pattern}`)) {
        folders.push(folder)
      }

      if (recursive && folder.folders.length) {
        folders.push(
          ...Folder.getSubFolders(folder, recursive, `${this.path}/${pattern}`),
        )
      }
    })

    return folders
  }

  private static getSubFiles(folders: Folder[], pattern = null): File[] {
    if (pattern)
      pattern = isAbsolute(pattern) ? pattern : Path.noBuild().pwd(pattern)

    const files = []

    folders.forEach(folder => {
      folder.files.forEach(file => {
        if (pattern && minimatch(file.path, pattern)) {
          files.push(file)
        }

        if (!pattern) files.push(file)
      })

      if (folder.folders.length) {
        files.push(...this.getSubFiles(folder.folders, pattern))
      }
    })

    return files
  }

  private static getSubFolders(
    folder: Folder,
    recursive: boolean,
    pattern = null,
  ): Folder[] {
    if (pattern)
      pattern = isAbsolute(pattern) ? pattern : Path.noBuild().pwd(pattern)

    const subFolders = []

    folder.folders.forEach(folder => {
      if (pattern && minimatch(folder.path, pattern)) {
        subFolders.push(folder)
      }

      if (!pattern) {
        subFolders.push(folder)
      }

      if (recursive && folder.folders.length) {
        this.getSubFolders(folder, recursive, pattern)
      }
    })

    return subFolders
  }

  private createFolderValues(mockedValues = false) {
    if (mockedValues && !this._originalFolderExists) {
      const bytes = randomBytes(8)
      const buffer = Buffer.from(bytes)

      this._dir = this._originalDir
      this._name = buffer.toString('base64').replace(/[^a-zA-Z0-9]/g, '')
      this._path = this._dir + '/' + this._name

      return
    }

    this._dir = this._originalDir
    this._name = this._originalName
    this._path = this._originalPath
  }

  private static parsePath(folderPath: string) {
    const { dir, name } = parse(
      isAbsolute(folderPath) ? folderPath : Path.noBuild().pwd(folderPath),
    )

    return { dir, name, path: dir + '/' + name }
  }

  private loadSubSync(
    path: string,
    dirents: Dirent[],
    withFileContent: boolean,
  ) {
    dirents.forEach(dirent => {
      const name = resolve(path, dirent.name)

      if (dirent.isDirectory()) {
        this._folders.push(new Folder(name).loadSync({ withFileContent }))

        return
      }

      this._files.push(
        new File(name).loadSync({ withContent: withFileContent }),
      )
    })
  }

  private async loadSub(
    path: string,
    dirents: Dirent[],
    withFileContent: boolean,
  ) {
    const files = []
    const folders = []

    dirents.forEach(dirent => {
      const name = resolve(path, dirent.name)

      if (dirent.isDirectory()) {
        folders.push(new Folder(name).load({ withFileContent }))

        return
      }

      files.push(new File(name).load({ withContent: withFileContent }))
    })

    this._files = await Promise.all(files)
    this._folders = await Promise.all(folders)
  }

  private _dir?: string
  private _name?: string
  private _path?: string
  private _files?: File[] = []
  private _folders?: Folder[] = []
  private _createdAt?: Date
  private _accessedAt?: Date
  private _modifiedAt?: Date
  private _folderSize?: string
  private _originalDir: string
  private _originalName: string
  private _originalPath: string
  private _folderExists: boolean
  private _isCopy: boolean
  private _originalFolderExists: boolean

  get dir() {
    return this._dir
  }

  get name() {
    return this._name
  }

  get path() {
    return this._path
  }

  get files() {
    return this._files
  }

  get folders() {
    return this._folders
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

  get folderSize() {
    return this._folderSize
  }

  get originalDir() {
    return this._originalDir
  }

  get originalName() {
    return this._originalName
  }

  get originalPath() {
    return this._originalPath
  }

  /**
   * _folderExists - If true means the folder has been created or already exists
   */
  get folderExists() {
    return this._folderExists
  }

  /**
   * _isCopy - If true means the file is not a copy from other file.
   */
  get isCopy() {
    return this._isCopy
  }

  /**
   * _originalFolderExists - If true means the folder already exists when creating the instance
   */
  get originalFolderExists() {
    return this._originalFolderExists
  }
}

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { unset as unsetFn } from '../Functions/unset'
import { Path as PathInstance } from '../Classes/Path'
import { Folder as FolderInstance, FolderJsonContract } from '../Classes/Folder'
import { File, File as FileInstance, FileJsonContract } from '../Classes/File'

const _global = global as any

// Classes
_global.Path = PathInstance
_global.File = FileInstance
_global.Folder = FolderInstance

// Functions
_global.unset = unsetFn

export {}

declare global {}

declare global {
  function unset(object: any): void

  class Path {
    static nodeCwdPath(): string
    static forceBuild(): typeof Path
    static pwd(subPath?: string): string
    static app(subPath?: string): string
    static switchEnvVerify(): typeof Path
    static logs(subPath?: string): string
    static start(subPath?: string): string
    static views(subPath?: string): string
    static tests(subPath?: string): string
    static config(subPath?: string): string
    static public(subPath?: string): string
    static assets(subPath?: string): string
    static storage(subPath?: string): string
    static locales(subPath?: string): string
    static database(subPath?: string): string
    static resources(subPath?: string): string
    static providers(subPath?: string): string
    static forBuild(name: string): typeof Path
    static changeBuild(name: string): typeof Path
  }

  class File {
    static createFileOfSize(filePath: string, size: number): Promise<any>
    constructor(filePath: string, content?: Buffer | null)
    toJSON(): FileJsonContract
    createSync(): File
    create(): Promise<File>
    loadSync(options?: { withContent?: boolean }): File
    load(options?: { withContent?: boolean }): Promise<File>
    getContentSync(): Buffer
    getContent(): Promise<Buffer>
    removeSync(): File
    remove(): Promise<void>
    get dir(): string
    get name(): string
    get base(): string
    get path(): string
    get content(): Buffer
    get createdAt(): Date
    get accessedAt(): Date
    get modifiedAt(): Date
    get fileSize(): string
    get extension(): string
    get originalDir(): string
    get mime(): string
    get originalName(): string
    get originalBase(): string
    get originalPath(): string
    /**
     * fileExists - If true means the file has been created or already exists
     */
    get fileExists(): boolean
    /**
     * _originalFileExists - If true means the file already exists when creating the instance
     */
    get originalFileExists(): boolean
  }

  class Folder {
    static folderSize(folderPath: string): Promise<number>
    constructor(folderPath: string)
    toJSON(): FolderJsonContract
    createSync(): Folder
    create(): Promise<Folder>
    loadSync(options?: { withSub?: boolean; withFileContent?: boolean })
    load(options?: {
      withSub?: boolean
      withFileContent?: boolean
    }): Promise<Folder>

    removeSync(): Folder
    remove(): Promise<void>
    getFilesByPattern(pattern: string, recursive?: boolean): File[]
    getFoldersByPattern(pattern: string, recursive?: boolean): Folder[]
    get dir(): string
    get name(): string
    get path(): string
    get files(): File[]
    get folders(): Folder[]
    get createdAt(): Date
    get accessedAt(): Date
    get modifiedAt(): Date
    get folderSize(): string
    get originalDir(): string
    get originalName(): string
    get originalPath(): string
    /**
     * fileExists - If true means the file has been created or already exists
     */
    get folderExists(): boolean
    /**
     * _originalFileExists - If true means the file already exists when creating the instance
     */
    get originalFolderExists(): boolean
  }
}

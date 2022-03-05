/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is as IsInstance } from '../Classes/Is'
import { Path as PathInstance } from '../Classes/Path'
import { FileContract } from '../Contracts/FileContract'
import { DirectoryContract } from '../Contracts/DirectoryContract'
import { File as FileInstance, FileJsonContract } from '../Classes/File'
import { Folder as FolderInstance, FolderJsonContract } from '../Classes/Folder'

const _global = global as any

// Classes
_global.Is = IsInstance
_global.Path = PathInstance
_global.File = FileInstance
_global.Folder = FolderInstance

export {}

declare global {}

declare global {
  class Is {
    static Ip(value: string): boolean
    static Empty(value: string): boolean
    static Cep(cep: string | number): boolean
    static Cpf(cpf: string | number): boolean
    static Cpnj(cnpj: string | number): boolean
    static Async(value: any): boolean
    static Undefined(value: any): value is undefined
    static Null(value: any): value is null
    static Boolean(value: any): value is boolean
    static Buffer(value: any): value is Buffer
    static Number(value: any): value is number
    static String(value: any): value is string
    static Object(value: any): boolean
    static Date(value: any): value is Date
    static Array(value: any): value is any[]
    static Regexp(value: any): value is RegExp
    static Error(value: any): boolean
    // eslint-disable-next-line @typescript-eslint/ban-types
    static Function(value: any): value is Function
    static Class(value: any): boolean
    static Integer(value: any): value is number
    static Float(value: any): value is number
  }

  class Path {
    static nodeCwdPath(): string
    static switchBuild(): typeof Path
    static switchEnvVerify(): typeof Path
    static forBuild(name: string): typeof Path
    static changeBuild(name: string): typeof Path
    static pwd(subPath?: string): string
    static app(subPath?: string): string
    static logs(subPath?: string): string
    static start(subPath?: string): string
    static views(subPath?: string): string
    static config(subPath?: string): string
    static tests(subPath?: string): string
    static public(subPath?: string): string
    static assets(subPath?: string): string
    static storage(subPath?: string): string
    static database(subPath?: string): string
    static locales(subPath?: string): string
    static resources(subPath?: string): string
    static providers(subPath?: string): string
  }

  class File {
    static createFileOfSize(filePath: string, size: number): Promise<any>
    static safeRemove(filePath: string): Promise<void>

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
      content?: Buffer | null,
      mockedValues?: boolean,
      isCopy?: boolean,
    )

    toContract(buffer?: boolean): FileContract
    toJSON(): FileJsonContract
    createSync(): File
    create(): Promise<File>

    /**
     * load
     *
     * @param options Options
     * @param options.withContent Default is true
     */
    loadSync(options?: { withContent?: boolean }): File

    /**
     * load
     *
     * @param options Options
     * @param options.withContent Default is true
     */
    load(options?: { withContent?: boolean }): Promise<File>

    /**
     * getContent
     *
     * @param options Options
     * @param options.saveContent Default is false
     */
    getContentSync(options?: { saveContent?: boolean }): Buffer

    /**
     * getContent
     *
     * @param options Options
     * @param options.saveContent Default is false
     */
    getContent(options?: { saveContent?: boolean }): Promise<Buffer>
    removeSync(): void
    remove(): Promise<void>

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
    ): File

    /**
     * copy
     *
     * @param newFilePath New path to the file
     * @param options Options
     * @param options.withContent Default is true
     * @param options.mockedValues Default is false
     */
    copy(
      newFilePath: string,
      options?: { withContent?: boolean; mockedValues?: boolean },
    ): Promise<File>

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
    ): File

    /**
     * move
     *
     * @param filePath New path to the file
     * @param options Options
     * @param options.withContent Default is true
     * @param options.mockedValues Default is false
     */
    move(
      filePath: string,
      options?: { withContent?: boolean; mockedValues?: boolean },
    ): Promise<File>

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
     * _fileExists - If true means the file has been created or already exists
     */
    get fileExists(): boolean
    /**
     * _isCopy - If true means the file is not a copy from other file.
     */
    get isCopy(): boolean
    /**
     * _originalFileExists - If true means the file already exists when creating the instance
     */
    get originalFileExists(): boolean
  }

  class Folder {
    static folderSize(folderPath: string): Promise<number>
    static safeRemove(dir: string): Promise<void>

    /**
     * Constructor
     *
     * @param folderPath Path to the file, it existing or not
     * @param mockedValues Default is false
     * @param isCopy Default is false
     */
    constructor(folderPath: string, mockedValues?: boolean, isCopy?: boolean)

    toContract(buffer?: boolean): DirectoryContract
    toJSON(): FolderJsonContract
    createSync(): Folder
    create(): Promise<Folder>
    /**
     * load
     *
     * @param options Options
     * @param options.withSub Default is true
     * @param options.withFileContent Default is false
     */
    loadSync(options?: { withSub?: boolean; withFileContent?: boolean }): Folder
    /**
     * load
     *
     * @param options Options
     * @param options.withSub Default is true
     * @param options.withFileContent Default is false
     */
    load(options?: {
      withSub?: boolean
      withFileContent?: boolean
    }): Promise<Folder>

    removeSync(): void
    remove(): Promise<void>

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
    ): Folder

    /**
     * copy
     *
     * @param newFolderPath New path to the file
     * @param options Options
     * @param options.withSub Default is true
     * @param options.withFileContent Default is false
     * @param options.mockedValues Default is false
     */
    copy(
      newFolderPath: string,
      options?: {
        withSub?: boolean
        withFileContent?: boolean
        mockedValues?: boolean
      },
    ): Promise<Folder>

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
    ): Folder

    /**
     * move
     *
     * @param folderPath New path to the file
     * @param options Options
     * @param options.withSub Default is true
     * @param options.withFileContent Default is false
     * @param options.mockedValues Default is false
     */
    move(
      folderPath: string,
      options?: {
        withSub?: boolean
        withFileContent?: boolean
        mockedValues?: boolean
      },
    ): Promise<Folder>

    /**
     * getFilesByPattern
     *
     * @param pattern The pattern of files path to match
     * @param recursive Default is false
     */
    getFilesByPattern(pattern: string, recursive?: boolean): File[]

    /**
     * getFoldersByPattern
     *
     * @param pattern The pattern of folders path to match
     * @param recursive Default is false
     */
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
     * _isCopy - If true means the file is not a copy from other file.
     */
    get isCopy(): boolean
    /**
     * _originalFileExists - If true means the file already exists when creating the instance
     */
    get originalFolderExists(): boolean
  }
}

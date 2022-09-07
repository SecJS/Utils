/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export declare interface ExceptionJSON {
  code?: string
  name: string
  status: number
  content: string
  help?: string
  stack?: any
}

export declare interface FileJSON {
  dir: string
  name: string
  base: string
  path: string
  mime: string
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  fileSize: number
  extension: string
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFileExists: boolean
  content: string
}

export declare interface FolderJSON {
  dir: string
  name: string
  base: string
  path: string
  files: File[]
  folders: Folder[]
  createdAt: Date
  accessedAt: Date
  modifiedAt: Date
  folderSize: number
  isCopy: boolean
  originalDir: string
  originalName: string
  originalPath: string
  originalFolderExists: boolean
}

export declare interface CoordinateContract {
  latitude: number
  longitude: number
}

export declare interface PaginationContract {
  page?: number
  limit?: number
  resourceUrl?: string
}

export declare interface PaginatedResponse {
  data: any[]
  meta: {
    totalItems: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
    itemCount: number
  }
  links: {
    next: string
    previous: string
    last: string
    first: string
  }
}

export declare interface DBConnectionContract {
  protocol: string
  user?: string
  password?: string
  host: string | string[]
  port?: number
  database: string
  options?: any
}

export declare class Clean {
  /**
   * Remove all falsy values from array.
   *
   * @param {any[]} array
   * @param {boolean} [removeEmpty]
   * @param {boolean} [cleanInsideObjects]
   * @return {any[]}
   */
  static cleanArray(
    array: any[],
    removeEmpty?: boolean,
    cleanInsideObjects?: boolean,
  ): any[]

  /**
   * Remove all falsy values from object.
   *
   * @param {any} object
   * @param {boolean} [removeEmpty]
   * @param {boolean} [cleanInsideArrays]
   * @return {any}
   */
  static cleanObject(
    object: any,
    removeEmpty?: boolean,
    cleanInsideArrays?: boolean,
  ): any
}

export declare class Config {
  /**
   * Map structure to save all configuration files.
   *
   * @type {Map<string, any>}
   */
  static configs: Map<string, any>

  /**
   * Get the value from configuration files.
   *
   * @param {string} key
   * @param {any} [defaultValue]
   * @return {any}
   */
  static get(key: string, defaultValue?: any): any

  /**
   * Load the configuration file only if it has
   * not been loaded yet.
   *
   * @param {string} path
   * @param {number} [callNumber]
   * @return {Promise<void>}
   */
  safeLoad(path: string, callNumber?: number): Promise<void>

  /**
   * Load the configuration file.
   *
   * @param {string} path
   * @param {number} [callNumber]
   * @return {Promise<void>}
   */
  load(path: string, callNumber?: number): Promise<void>
}

export declare class Debug {
  /**
   * Format the message using Chalk API.
   *
   * @param {string} message
   * @return {string}
   */
  static format(message: string): string

  /**
   * Format and throw the message in the stdout accordingly to the namespace.
   *
   * @param {string|any} message
   * @param {string} [namespace]
   * @return {void}
   */
  static log(message: string | any, namespace?: string): void
}

export declare class Exception extends Error {
  /**
   * Creates a new instance of Exception.
   *
   * @param {string} [content]
   * @param {number} [status]
   * @param {string} [code]
   * @param {string} [help]
   * @return {Exception}
   */
  constructor(content?: string, status?: number, code?: string, help?: string)

  /**
   * Transform the exception to a valid JSON Object.
   *
   * @param {boolean} [stack]
   * @return {ExceptionJSON}
   */
  toJSON(stack?: boolean): ExceptionJSON

  /**
   * Prettify the error using Youch API.
   *
   * @param {any} [options]
   * @param {string} [options.prefix]
   * @param {boolean} [options.hideMessage]
   * @param {boolean} [options.hideErrorTitle]
   * @param {boolean} [options.displayShortPath]
   * @param {boolean} [options.displayMainFrameOnly]
   * @return {Promise<string>}
   */
  prettify(options?: {
    prefix?: string
    hideMessage?: boolean
    hideErrorTitle?: boolean
    displayShortPath?: boolean
    displayMainFrameOnly?: boolean
  }): Promise<string>
}

export declare class Exec {
  /**
   * Sleep the code in the line that this function
   * is being called.
   *
   * @param {number} ms
   * @return {Promise<void>}
   */
  static sleep(ms: number): Promise<void>

  /**
   * Execute a command of child process exec as promise.
   *
   * @param {string} command
   * @param {{
   *   ignoreErrors?: boolean
   * }} [options]
   * @throws {NodeCommandException}
   * @return {Promise<{ stdout: string, stderr: string }>}
   */
  static command(
    command: string,
    options?: { ignoreErrors?: boolean },
  ): Promise<{ stdout: string; stderr: string }>

  /**
   * Download an archive to determined path.
   *
   * @param {string} name
   * @param {string} path
   * @param {string} url
   * @return {Promise<File>}
   */
  static download(name: string, path: string, url: string): Promise<File>

  /**
   * Paginate a collection of data.
   *
   * @param {any[]} data
   * @param {number} total
   * @param {{
   *   page?: number,
   *   limit?: number,
   *   resourceUrl?: string
   * }} pagination
   * @return {{
   *   data: any[],
   *   meta: {
   *     totalItems: number,
   *     itemsPerPage: number,
   *     totalPages: number,
   *     currentPage: number,
   *     itemCount: number
   *  },
   *  links: {
   *    next: string,
   *    previous: string,
   *    last: string,
   *    first: string
   *  }
   * }}
   */
  static pagination(
    data: any[],
    total: number,
    pagination: PaginationContract,
  ): PaginatedResponse
}

export declare class File {
  public originalDir: string

  public originalName: string

  public originalBase: string

  public originalPath: string

  public dir: string

  public name: string

  public base: string

  public path: string

  public href: string

  public isCopy: boolean

  public originalFileExists: boolean

  public fileExists: boolean

  public content: Buffer

  public mime: string

  public extension: string

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
    filePath: string,
    content?: Buffer,
    mockedValues?: boolean,
    isCopy?: boolean,
  )

  /**
   * Remove the file it's existing or not.
   *
   * @param {string} filePath
   * @return {Promise<void>}
   */
  static safeRemove(filePath: string): Promise<void>

  /**
   * Verify if file exists.
   *
   * @param {string} filePath
   * @return {boolean}
   */
  static existsSync(filePath: string): boolean

  /**
   * Verify if file exists.
   *
   * @param {string} filePath
   * @return {Promise<boolean>}
   */
  static exists(filePath: string): Promise<boolean>

  /**
   * Verify if path is from file or directory.
   *
   * @param {string} path
   * @return {boolean}
   */
  static isFileSync(path: string): boolean

  /**
   * Verify if path is from file or directory.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  static isFile(path: string): Promise<boolean>

  /**
   * Create fake file with determined size.
   *
   * @param {string} filePath
   * @param {number} size
   * @return {Promise<typeof File>}
   */
  static createFileOfSize(filePath: string, size?: number): Promise<typeof File>

  /**
   * Returns the file as a JSON object.
   *
   * @return {FileJSON}
   */
  toJSON(): FileJSON

  /**
   * Load or create the file.
   *
   * @param {{
   *   withContent?: boolean,
   *   isInternalLoad?: boolean
   * }} [options]
   * @return {File}
   */
  loadSync(options?: { withContent?: boolean; isInternalLoad?: boolean }): File

  /**
   * Load or create the file.
   *
   * @param {{
   *   withContent?: boolean,
   *   isInternalLoad?: boolean
   * }} [options]
   * @return {Promise<File>}
   */
  load(options?: {
    withContent?: boolean
    isInternalLoad?: boolean
  }): Promise<File>

  /**
   * Remove the file.
   *
   * @return {void}
   */
  removeSync(): void

  /**
   * Remove the file.
   *
   * @return {Promise<void>}
   */
  remove(): Promise<void>

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
  copySync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File

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
  copy(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File>

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
  moveSync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File

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
  move(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File>

  /**
   * Append any data to the file.
   *
   * @param {string|Buffer} data
   * @return {File}
   */
  appendSync(data: string | Buffer): File

  /**
   * Append any data to the file.
   *
   * @param {string|Buffer} data
   * @return {Promise<File>}
   */
  append(data: string | Buffer): Promise<File>

  /**
   * Prepend any data to the file.
   *
   * @param {string|Buffer} data
   * @return {File}
   */
  prependSync(data: string | Buffer): File

  /**
   * Prepend any data to the file.
   *
   * @param {string|Buffer} data
   * @return {Promise<File>}
   */
  prepend(data: string | Buffer): Promise<File>

  /**
   * Get only the content of the file.
   *
   * @param {{
   *   saveContent?: boolean
   * }} [options]
   * @return {Buffer}
   */
  getContentSync(options?: { saveContent?: boolean }): Buffer

  /**
   * Get only the content of the file.
   *
   * @param {{
   *   saveContent?: boolean
   * }} [options]
   * @return {Promise<Buffer>}
   */
  getContent(options?: { saveContent?: boolean }): Promise<Buffer>
}

export declare class Folder {
  public files: File[]

  public folders: Folder[]

  public originalDir: string

  public originalName: string

  public originalPath: string

  public dir: string

  public name: string

  public path: string

  public isCopy: boolean

  public originalFolderExists: boolean

  public folderExists: boolean

  /**
   * Creates a new instance of Folder.
   *
   * @param {string} folderPath
   * @param {boolean} [mockedValues]
   * @param {boolean} [isCopy]
   * @return {Folder}
   */
  constructor(folderPath: string, mockedValues?: boolean, isCopy?: boolean)

  /**
   * Get the size of the folder.
   *
   * @param {string} folderPath
   * @return {number}
   */
  static folderSizeSync(folderPath: string): number

  /**
   * Get the size of the folder.
   *
   * @param {string} folderPath
   * @return {Promise<number>}
   */
  static folderSize(folderPath: string): Promise<number>

  /**
   * Remove the folder it's existing or not.
   *
   * @param {string} folderPath
   * @return {Promise<void>}
   */
  static safeRemove(folderPath: string): Promise<void>

  /**
   * Verify if folder exists.
   *
   * @param {string} folderPath
   * @return {boolean}
   */
  static existsSync(folderPath: string): boolean

  /**
   * Verify if folder exists.
   *
   * @param {string} folderPath
   * @return {Promise<boolean>}
   */
  static exists(folderPath: string): Promise<boolean>

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {boolean}
   */
  static isFolderSync(path: string): boolean

  /**
   * Verify if path is from folder or file.
   *
   * @param {string} path
   * @return {Promise<boolean>}
   */
  static isFolder(path: string): Promise<boolean>

  /**
   * Returns the file as a JSON object.
   *
   * @return {FolderJSON}
   */
  toJSON(): FolderJSON

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
  loadSync(options?: {
    withSub?: boolean
    withFileContent?: boolean
    isInternalLoad?: boolean
  }): Folder

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
  load(options?: {
    withSub?: boolean
    withFileContent?: boolean
    isInternalLoad?: boolean
  }): Promise<Folder>

  /**
   * Remove the folder.
   *
   * @return {void}
   */
  removeSync(): void

  /**
   * Remove the folder.
   *
   * @return {Promise<void>}
   */
  remove(): Promise<void>

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
  copySync(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder

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
  copy(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder>

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
  moveSync(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder

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
  move(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder>

  /**
   * Get all the files of folder using glob pattern.
   *
   * @param {string} [pattern]
   * @param {boolean} [recursive]
   * @return {File[]}
   */
  getFilesByPattern(pattern?: string, recursive?: boolean): File[]

  /**
   * Get all the folders of folder using glob pattern.
   *
   * @param {string} [pattern]
   * @param {boolean} [recursive]
   * @return {Folder[]}
   */
  getFoldersByPattern(pattern?: string, recursive?: boolean): Folder[]
}

export declare class Is {
  /**
   * Verify if is valid Uuid.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Uuid(value: string): boolean

  /**
   * Verify if is valid Json.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Json(value: string): boolean

  /**
   * Verify if is valid Ip.
   *
   * @param {string} value
   * @return {boolean}
   */
  static Ip(value: string): boolean

  /**
   * Verify if is valid Empty.
   *
   * @param {string|any|any[]} value
   * @return {boolean}
   */
  static Empty(value: string | any | any[]): boolean

  /**
   * Verify if is a valid Cep.
   *
   * @param {string|number} cep
   * @return {boolean}
   */
  static Cep(cep: string | number): boolean

  /**
   * Verify if is a valid Cpf.
   *
   * @param {string|number} cpf
   * @return {boolean}
   */
  static Cpf(cpf: string | number): boolean

  /**
   * Verify if is a valid Cnpj.
   *
   * @param {string|number} cnpj
   * @return {boolean}
   */
  static Cnpj(cnpj: string | number): boolean

  /**
   * Verify if is a valid Async function.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Async(value: any): value is Promise<Function>

  /**
   * Verify if is a valid Undefined.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Undefined(value: any): value is undefined

  /**
   * Verify if is a valid Null.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Null(value: any): value is null

  /**
   * Verify if is a valid Boolean.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Boolean(value: any): value is boolean

  /**
   * Verify if is a valid Buffer.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Buffer(value: any): value is Buffer

  /**
   * Verify if is a valid Number.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Number(value: any): value is number

  /**
   * Verify if is a valid String.
   *
   * @param {any} value
   * @return {boolean}
   */
  static String(value: any): value is string

  /**
   * Verify if is a valid Object.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Object(value: any): value is Object

  /**
   * Verify if is a valid Date.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Date(value: any): value is Date

  /**
   * Verify if is a valid Array.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Array(value: any): value is any[]

  /**
   * Verify if is a valid Regexp.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Regexp(value: any): value is RegExp

  /**
   * Verify if is a valid Error.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Error(value: any): value is Error

  /**
   * Verify if is a valid Function.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Function(value: any): value is Function

  /**
   * Verify if is a valid Class.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Class(value: any): boolean

  /**
   * Verify if is a valid Integer.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Integer(value: any): value is number

  /**
   * Verify if is a valid Float.
   *
   * @param {any} value
   * @return {boolean}
   */
  static Float(value: any): value is number

  /**
   * Verify if is a valid ArrayOfObjects.
   *
   * @param {any[]} value
   * @return {boolean}
   */
  static ArrayOfObjects(value: any[]): boolean
}

export declare class Json {
  /**
   * Deep copy any object properties without reference.
   *
   * @param {any} object
   * @return {any}
   */
  static copy(object: any): any

  /**
   * Find all JSON inside string and return it.
   *
   * @param {string} text
   * @return {string[]}
   */
  static getJson(text: string): string[]

  /**
   * Reviver callback.
   *
   * @callback reviver
   * @param {any} this
   * @param {string} key
   * @param {any} value
   * @return any
   */

  /**
   * Converts a JSON string into an object without exception.
   *
   * @param {string} text
   * @param {reviver} [reviver]
   * @return {any}
   */
  static parse(text: string, reviver?: any): any

  /**
   * Observe changes inside objects.
   *
   * @param {any} object
   * @param {function} func
   * @param {...any[]} args
   * @return {any}
   */
  static observeChanges(object: any, func: any, ...args: any[])

  /**
   * Remove all keys from data that is not inside array keys.
   *
   * @param {any} data
   * @param {any[]} keys
   * @return {any[]}
   */
  static fillable(data: any, keys: any[]): any[]

  /**
   * Remove all duplicated values from the array.
   *
   * @param {any[]} array
   * @return {any[]}
   */
  static removeDuplicated(array: any[]): any[]

  /**
   * Raffle any value from the array.
   *
   * @param {any[]} array
   * @return {number}
   */
  static raffle(array: any[]): number

  /**
   * Get the object properties based on key.
   *
   * @param {string} key
   * @param {any} [defaultValue]
   * @param {any} object
   * @return {any|undefined}
   */
  static get(object: any, key: string, defaultValue?: any): any | undefined
}

export class Module {
  /**
   * Get the module first export match or default.
   *
   * @param {any|Promise<any>} module
   * @return {Promise<any>}
   */
  static get(module: any | Promise<any>): Promise<any>

  /**
   * Get the module first export match or default with alias.
   *
   * @param {any|Promise<any>} module
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }>}
   */
  static getWithAlias(module: any | Promise<any>, subAlias: string): Promise<{ alias: string, module: any }>

  /**
   * Get all modules first export match or default and return
   * as array.
   *
   * @param {any[]|Promise<any[]>} modules
   * @return {Promise<any[]>}
   */
  static getAll(modules: any[] | Promise<any[]>): Promise<any[]>

  /**
   * Get all modules first export match or default with alias and return
   * as array.
   *
   * @param {any[]|Promise<any[]>} modules
   * @param {string} subAlias
   * @return {Promise<any[]>}
   */
  static getAllWithAlias(modules: any[] | Promise<any[]>, subAlias: string): Promise<{ alias: string, module: any }[]>

  /**
   * Same as get method, but import the path directly.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  static getFrom(path: string): Promise<any>

  /**
   * Same as getWithAlias method, but import the path directly.
   *
   * @param {string} path
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }>}
   */
  static getFromWithAlias(path: string, subAlias: string): Promise<{ alias: string, module: any }>

  /**
   * Same as getAll method but import everything in the path directly.
   *
   * @param {string} path
   * @return {Promise<any[]>}
   */
  static getAllFrom(path: string): Promise<any>

  /**
   * Same as getAllWithAlias method but import everything in the path directly.
   *
   * @param {string} path
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }[]>}
   */
  static getAllFromWithAlias(path: string, subAlias: string): Promise<{ alias: string, module: any }[]>

  /**
   * Verify if folder exists and get all .js files inside.
   *
   * @param {string} path
   * @return {Promise<File[]>}
   */
  static getAllJSFilesFrom(path: string): Promise<File[]>

  /**
   * Import a full path using the path href to ensure compatibility
   * between OS's.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  static import(path: string): Promise<any>

  /**
   * Create the __dirname property. Set in global if necessary.
   *
   * @param {string} [url]
   * @param {boolean} [setInGlobal]
   * @return {string}
   */
  static createDirname(url?: string, setInGlobal?: boolean): string

  /**
   * Create the __filename property. Set in global if necessary.
   *
   * @param {string} [url]
   * @param {boolean} [setInGlobal]
   * @return {string}
   */
  static createFilename(url?: string, setInGlobal?: boolean): string
}

export declare class Number {
  /**
   * Get the higher number from an array of numbers.
   *
   * @param {number[]} numbers
   * @return {number}
   */
  static getHigher(numbers: number[]): number

  /**
   * Get km radius between two coordinates.
   *
   * @param {{ latitude: number, longitude: number }} centerCord
   * @param {{ latitude: number, longitude: number }} pointCord
   * @return {number}
   */
  static getKmRadius(
    centerCord: CoordinateContract,
    pointCord: CoordinateContract,
  ): number

  /**
   * Get the lower number from an array of numbers.
   *
   * @param {number[]} numbers
   * @return {number}
   */
  static getLower(numbers: number[]): number

  /**
   * Extract all numbers inside a string and
   * return as a unique number.
   *
   * @param {string} string
   * @return {number}
   */
  static extractNumber(string: string): number

  /**
   * Extract all numbers inside a string.
   *
   * @param {string} string
   * @return {number[]}
   */
  static extractNumbers(string: string): number[]

  /**
   * The average of all numbers in function arguments.
   *
   * @param {number[]} args
   * @return {number}
   */
  static argsAverage(...args: number[]): number

  /**
   * The average of all numbers in the array.
   *
   * @param {number[]} array
   * @return {number}
   */
  static arrayAverage(array: number[]): number

  /**
   * Generate a random integer from a determined interval of numbers.
   *
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  static randomIntFromInterval(min: number, max: number): number
}

export declare class Options {
  /**
   * Creates an option object with default values.
   *
   * @param {any} object
   * @param {any} defaultValues
   * @return {any}
   */
  static create<T = any>(object: Partial<T>, defaultValues: Partial<T>): T
}

export declare class Parser {
  /**
   * Parse a string to array.
   *
   * @param {string} string
   * @param {string} separator
   * @return {string[]}
   */
  static stringToArray(string: string, separator: string): string[]

  /**
   * Parse an array of strings to a string.
   *
   * @param {string[]} values
   * @param {{
   *   separator?: string,
   *   pairSeparator?: string,
   *   lastSeparator?: string
   * }} [options]
   * @return {string}
   */
  static arrayToString(
    values: string[],
    options?: {
      separator?: string
      pairSeparator?: string
      lastSeparator?: string
    },
  ): string

  /**
   * Parse a string to number or Coordinate.
   *
   * @param {string} string
   * @param {boolean} isCoordinate
   * @throws {InvalidNumberException}
   * @return {number}
   */
  static stringToNumber(string: string, isCoordinate: boolean): number

  /**
   * Parse an object to form data.
   *
   * @param {any} object
   * @return {string}
   */
  static jsonToFormData(object: any): string

  /**
   * Parse form data to json.
   *
   * @param {string} formData
   * @return {any}
   */
  static formDataToJson(formData: string): any

  /**
   * Parses all links inside the string to HTML link
   * with <a href= .../>.
   *
   * @param {string} string
   * @return {string}
   */
  static linkToHref(string: string): any

  /**
   * Parses a number to Byte format.
   *
   * @param {number} value
   * @param {object} [options]
   * @param {number} [options.decimalPlaces=2]
   * @param {number} [options.fixedDecimals=false]
   * @param {string} [options.thousandsSeparator=]
   * @param {string} [options.unit=]
   * @param {string} [options.unitSeparator=]
   * @return {string}
   */
  static sizeToByte(
    value,
    options?: {
      decimalPlaces?: number
      fixedDecimals?: boolean
      thousandsSeparator?: any
      unit?: any
      unitSeparator?: any
    },
  ): string

  /**
   * Parses a byte format to number.
   *
   * @param {string|number} byte
   * @return {number}
   */
  static byteToSize(byte: string | number): number

  /**
   * Parses a string to MS format.
   *
   * @param {string} value
   * @return {number}
   */
  static timeToMs(value: string): number

  /**
   * Parses an MS number to time format.
   *
   * @param {number} value
   * @param {boolean} long
   * @return {string}
   */
  static msToTime(value: number, long: boolean): string

  /**
   * Parses the status code number to it reason in string.
   *
   * @param {string|number} status
   * @return {string}
   */
  static statusCodeToReason(status: string | number): string

  /**
   * Parses the reason in string to it status code number
   *
   * @param {string} reason
   * @return {number}
   */
  static reasonToStatusCode(reason: string): number

  /**
   * Parses the database connection url to connection object.
   *
   * @param {string} url
   * @return {DBConnectionContract}
   */
  static dbUrlToConnectionObj(url: string): DBConnectionContract

  /**
   * Parses the database connection object to connection url.
   *
   * @param {DBConnectionContract} object
   * @return {string}
   */
  static connectionObjToDbUrl(object?: DBConnectionContract): string
}

export declare class Path {
  /**
   * Set a default beforePath for all Path methods that
   * use Path.pwd.
   *
   * @type {string}
   */
  static defaultBeforePath: string

  /**
   * Return the pwd path of your project.
   *
   * @param {string} [subPath]
   * @return {string}
   */
  static pwd(subPath?: string): string

  /**
   * Return the app path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static app(subPath?: string): string

  /**
   * Return the bootstrap path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static bootstrap(subPath?: string): string

  /**
   * Return the config path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static config(subPath?: string): string

  /**
   * Return the database path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static database(subPath?: string): string

  /**
   * Return the lang path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static lang(subPath?: string): string

  /**
   * Return the node_modules path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static nodeModules(subPath?: string): string

  /**
   * Return the providers' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static providers(subPath?: string): string

  /**
   * Return the public path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static public(subPath?: string): string

  /**
   * Return the resources' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static resources(subPath?: string): string

  /**
   * Return the routes' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static routes(subPath?: string): string

  /**
   * Return the storage path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static storage(subPath?: string): string

  /**
   * Return the tests' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static tests(subPath?: string): string

  /**
   * Return the logs' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static logs(subPath?: string): string

  /**
   * Return the views' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static views(subPath?: string): string

  /**
   * Return the assets' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static assets(subPath?: string): string

  /**
   * Return the locales' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static locales(subPath?: string): string

  /**
   * Return the facades' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static facades(subPath?: string): string

  /**
   * Return the stubs' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static stubs(subPath?: string): string

  /**
   * Return the http path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static http(subPath?: string): string

  /**
   * Return the console path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static console(subPath?: string): string

  /**
   * Return the services' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static services(subPath?: string): string

  /**
   * Return the migrations' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static migrations(subPath?: string): string

  /**
   * Return the seeders' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static seeders(subPath?: string): string

  /**
   * Return the .bin path of your node_modules.
   *
   * @param {string} subPath
   * @return {string}
   */
  static bin(subPath?: string): string

  /**
   * Return the tmp path of your vm.
   *
   * @param {string} subPath
   * @return {string}
   */
  static vmTmp(subPath?: string): string

  /**
   * Return the home path of your vm.
   *
   * @param {string} subPath
   * @return {string}
   */
  static vmHome(subPath?: string): string

  /**
   * Return the execution path of where this method
   * is being called.
   *
   * @param {string} subPath
   * @param {number} [stackIndex]
   * @return {string}
   */
  static this(subPath?: string, stackIndex?: number): string
}

export declare class Route {
  /**
   * Get the query string in form data format.
   *
   * @param {string} route
   * @return {string}
   */
  static getQueryString(route: string): string

  /**
   * Remove query params from the route.
   *
   * @param {string} route
   * @return {string}
   */
  static removeQueryParams(route: string): string

  /**
   * Get object with ?&queryParams values from route.
   *
   * @param {string} route
   * @return {any}
   */
  static getQueryParamsValue(route: string): any

  /**
   * Get array with ?&queryParams name from route.
   *
   * @param {string} route
   * @return {string[]}
   */
  static getQueryParamsName(route: string): string[]

  /**
   * Get object with :params values from route.
   *
   * @param {string} routeWithParams
   * @param {string} routeWithValues
   * @return {any}
   */
  static getParamsValue(routeWithParams: string, routeWithValues: string): any

  /**
   * Get array with :params name from route.
   *
   * @param {string} route
   * @return {string[]}
   */
  static getParamsName(route: string): string[]

  /**
   * Create a matcher RegExp for any route.
   *
   * @param {string} route
   * @return {RegExp}
   */
  static createMatcher(route: string): RegExp
}

export declare class String {
  /**
   * Generate random string by size.
   *
   * @param {number} size
   * @return {string}
   */
  static generateRandom(size: number): string

  /**
   * Generate random color in hexadecimal format.
   *
   * @return {string}
   */
  static generateRandomColor(): string

  /**
   * Normalizes the string in base64 format removing
   * special chars.
   *
   * @param {string} value
   * @return {string}
   */
  static normalizeBase64(value: string): string

  /**
   * Transforms the string to "camelCase".
   *
   * @param {string} value
   * @return {string}
   */
  static toCamelCase(value: string): string

  /**
   * Transforms the string to "snake_case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toSnakeCase(value: string, capitalize?: boolean): string

  /**
   * Transforms the string to "CONSTANT_CASE".
   *
   * @param {string} value
   * @return {string}
   */
  static toConstantCase(value: string): string

  /**
   * Transforms the string to "PascalCase".
   *
   * @param {string} value
   * @return {string}
   */
  static toPascalCase(value: string): string

  /**
   * Transforms the string to "Sentence case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toSentenceCase(value: string, capitalize?: boolean): string

  /**
   * Transforms the string to "dot.case".
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toDotCase(value: string, capitalize?: boolean): string

  /**
   * Removes all sorted cases from string.
   *
   * @param {string} value
   * @return {string}
   */
  static toNoCase(value: string): string

  /**
   * Transforms a string to "dash-case"
   *
   * @param {string} value
   * @param {boolean} [capitalize]
   * @return {string}
   */
  static toDashCase(value: string, capitalize?: boolean): string

  /**
   * Transforms a word to plural.
   *
   * @param {string} word
   * @return {string}
   */
  static pluralize(word: string): string

  /**
   * Transforms a word to singular.
   *
   * @param {string} word
   * @return {string}
   */
  static singularize(word: string): string

  /**
   * Transforms a number to your ordinal format.
   *
   * @param {string,number} value
   * @return {string}
   */
  static ordinalize(value: string | number): string
}

export declare class Uuid {
  /**
   * Verify if string is a valid uuid.
   *
   * @param {string} token
   * @param {boolean} [isPrefixed]
   * @return {boolean}
   */
  static verify(token: string, isPrefixed?: boolean): boolean

  /**
   * Generate an uuid token
   *
   * @param {string} [prefix]
   * @return {string}
   */
  static generate(prefix?: string): string

  /**
   * Return the token without his prefix.
   *
   * @param {string} token
   * @return {string}
   */
  static getToken(token: string): string

  /**
   * Return the prefix without his token.
   *
   * @param {string} token
   * @return {string|null}
   */
  static getPrefix(token: string): string | null

  /**
   * Inject a prefix in the uuid token.
   *
   * @param {string} prefix
   * @param {string} token
   * @return {string}
   */
  static injectPrefix(prefix: string, token: string): string

  /**
   * Change the prefix of and uuid token
   *
   * @param {string} newPrefix
   * @param {string} token
   * @return {string}
   */
  static changePrefix(newPrefix: string, token: string): string

  /**
   * Change the token prefix or generate a new one
   *
   * @param {string} prefix
   * @param {string?} token
   * @return {string}
   */
  static changeOrGenerate(prefix: string, token?: string): string
}

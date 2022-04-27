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
  static cleanArray(
    array: any[],
    removeEmpty?: boolean,
    cleanInsideObjects?: boolean,
  ): any[]

  static cleanObject(
    object: any,
    removeEmpty?: boolean,
    cleanInsideArrays?: boolean,
  ): any
}

export declare class Config {
  static configs: Map<string, any>

  static get(key: string, defaultValue?: any): any

  safeLoad(path: string, callNumber?: number): Promise<void>

  load(path: string, callNumber?: number): Promise<void>
}

export declare class Debug {
  static format(message: string): string

  static log(message: string | any, namespace?: string): void
}

export declare class Exception extends Error {
  constructor(content?: string, status?: number, code?: string, help?: string)

  toJSON(stack: boolean): {
    code: string
    name: string
    status: number
    content: string
    help?: string
    stack?: string
  }

  prettify(options?: {
    prefix?: string
    hideMessage?: boolean
    hideErrorTitle?: boolean
    displayShortPath?: boolean
    displayMainFrameOnly?: boolean
  }): Promise<string>
}

export declare class Exec {
  static sleep(ms: number): Promise<void>

  static command(
    command: string,
    options?: { ignoreErrors?: boolean },
  ): Promise<{ stdout: string; stderr: string }>

  static download(name: string, path: string, url: string): Promise<File>

  static pagination(
    data: any[],
    total: number,
    pagination: PaginationContract,
  ): PaginatedResponse

  static getModule(module: any | Promise<any>): Promise<any>
}

export declare class File {
  constructor(
    filePath: string,
    content?: Buffer,
    mockedValues?: boolean,
    isCopy?: boolean,
  )

  static safeRemove(filePath: string): Promise<void>

  static existsSync(filePath: string): boolean

  static exists(filePath: string): Promise<boolean>

  static isFileSync(path: string): boolean

  static isFile(path: string): Promise<boolean>

  static createFileOfSize(filePath: string, size?: number): Promise<typeof File>

  toJSON(): FileJSON

  loadSync(options?: { withContent?: boolean; isInternalLoad?: boolean }): File

  load(options?: {
    withContent?: boolean
    isInternalLoad?: boolean
  }): Promise<File>

  removeSync(): void

  remove(): Promise<void>

  copySync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File

  copy(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File>

  moveSync(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): File

  move(
    path: string,
    options?: { withContent?: boolean; mockedValues?: boolean },
  ): Promise<File>

  appendSync(data: string | Buffer): File

  append(data: string | Buffer): Promise<File>

  prependSync(data: string | Buffer): File

  prepend(data: string | Buffer): Promise<File>

  getContentSync(options?: { saveContent?: boolean }): Buffer

  getContent(options?: { saveContent?: boolean }): Promise<Buffer>
}

export declare class Folder {
  constructor(folderPath: string, mockedValues?: boolean, isCopy?: boolean)

  static folderSizeSync(folderPath: string): number

  static folderSize(folderPath: string): Promise<number>

  static safeRemove(folderPath: string): Promise<void>

  static existsSync(folderPath: string): boolean

  static exists(folderPath: string): Promise<boolean>

  static isFolderSync(path: string): boolean

  static isFolder(path: string): Promise<boolean>

  toJSON(): FolderJSON

  loadSync(options?: {
    withSub?: boolean
    withFileContent?: boolean
    isInternalLoad?: boolean
  }): Folder

  load(options?: {
    withSub?: boolean
    withFileContent?: boolean
    isInternalLoad?: boolean
  }): Promise<Folder>

  removeSync(): void

  remove(): Promise<void>

  copySync(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder

  copy(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder>

  moveSync(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Folder

  move(
    path: string,
    options?: {
      withSub?: boolean
      withFileContent?: boolean
      mockedValues?: boolean
    },
  ): Promise<Folder>

  getFilesByPattern(pattern?: string, recursive?: boolean): File[]

  getFoldersByPattern(pattern?: string, recursive?: boolean): Folder[]
}

export declare class Is {
  static Uuid(value: string): boolean

  static Json(value: string): boolean

  static Ip(value: string): boolean

  static Empty(value: string | any | any[]): boolean

  static Cep(cep: string | number): boolean

  static Cpf(cpf: string | number): boolean

  static Cnpj(cnpj: string | number): boolean

  static Async(value: any): value is Promise<Function>

  static Undefined(value: any): value is undefined

  static Null(value: any): value is null

  static Boolean(value: any): value is boolean

  static Buffer(value: any): value is Buffer

  static Number(value: any): value is number

  static String(value: any): value is string

  static Object(value: any): value is Object

  static Date(value: any): value is Date

  static Array(value: any): value is any[]

  static Regexp(value: any): value is RegExp

  static Error(value: any): value is Error

  static Function(value: any): value is Function

  static Class(value: any): boolean

  static Integer(value: any): value is number

  static Float(value: any): value is number

  static ArrayOfObjects(value: any[]): boolean
}

export declare class Json {
  static copy(object: any): any

  static getJson(text: string): string[]

  static parse(text: string, reviver?: any): any

  static observeChanges(object: any, func: any, ...args: any[])

  static fillable(data: any, keys: any[]): any[]

  static removeDuplicated(array: any[]): any[]

  static sort(array: any[]): number

  static get(object: any, key: string, defaultValue?: any): any | undefined
}

export declare class Number {
  static getHigher(numbers: number[]): number

  static getKmRadius(
    centerCord: CoordinateContract,
    pointCord: CoordinateContract,
  ): number

  static getLower(numbers: number[]): number

  static extractNumber(string: string): number

  static extractNumbers(string: string): number[]

  static argsAverage(...args: number[]): number

  static arrayAverage(array: number[]): number

  static randomIntFromInterval(min: number, max: number): number
}

export declare class Options {
  static create<T = any>(object: Partial<T>, defaultValues: Partial<T>): T
}

export declare class Parser {
  static stringToArray(string: string, separator: string): string[]

  static arrayToString(
    values: string[],
    options?: {
      separator?: string
      pairSeparator?: string
      lastSeparator?: string
    },
  ): string

  static stringToNumber(string: string, isCoordinate: boolean): number

  static jsonToFormData(object: any): string

  static formDataToJson(formData: string): any

  static linkToHref(string: string): any

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

  static byteToSize(byte: string | number): number

  static timeToMs(value: string): number

  static msToTime(value: number, long: boolean): string

  static statusCodeToReason(status: string | number): string

  static reasonToStatusCode(reason: string): number

  static dbUrlToConnectionObj(url: string): DBConnectionContract

  static connectionObjToDbUrl(object?: DBConnectionContract): string
}

export declare class Path {
  static defaultBeforePath: string

  static pwd(subPath?: string, beforePath?: string): string

  static app(subPath?: string, beforePath?: string): string

  static bootstrap(subPath?: string, beforePath?: string): string

  static config(subPath?: string, beforePath?: string): string

  static database(subPath?: string, beforePath?: string): string

  static lang(subPath?: string, beforePath?: string): string

  static nodeModules(subPath?: string, beforePath?: string): string

  static providers(subPath?: string, beforePath?: string): string

  static public(subPath?: string, beforePath?: string): string

  static resources(subPath?: string, beforePath?: string): string

  static routes(subPath?: string, beforePath?: string): string

  static storage(subPath?: string, beforePath?: string): string

  static tests(subPath?: string, beforePath?: string): string

  static logs(subPath?: string, beforePath?: string): string

  static views(subPath?: string, beforePath?: string): string

  static assets(subPath?: string, beforePath?: string): string

  static locales(subPath?: string, beforePath?: string): string

  static facades(subPath?: string, beforePath?: string): string

  static stubs(subPath?: string, beforePath?: string): string

  static http(subPath?: string, beforePath?: string): string

  static console(subPath?: string, beforePath?: string): string

  static services(subPath?: string, beforePath?: string): string

  static migrations(subPath?: string, beforePath?: string): string

  static seeders(subPath?: string, beforePath?: string): string

  static bin(subPath?: string, beforePath?: string): string

  static vmTmp(subPath?: string, beforePath?: string): string

  static vmHome(subPath?: string, beforePath?: string): string
}

export declare class Route {
  static getQueryString(route: string): string

  static removeQueryParams(route: string): string

  static getQueryParamsValue(route: string): any

  static getQueryParamsName(route: string): string[]

  static getParamsValue(routeWithParams: string, routeWithValues: string): any

  static getParamsName(route: string): string[]

  static createMatcher(route: string): RegExp
}

export declare class String {
  static generateRandom(size: number): string

  static generateRandomColor(): string

  static normalizeBase64(value: string): string

  static toCamelCase(value: string): string

  static toSnakeCase(value: string, capitalize?: boolean): string

  static toConstantCase(value: string): string

  static toPascalCase(value: string): string

  static toSentenceCase(value: string, capitalize?: boolean): string

  static toDotCase(value: string, capitalize?: boolean): string

  static toNoCase(value: string): string

  static toDashCase(value: string, capitalize?: boolean): string

  static pluralize(word: string): string

  static singularize(word: string): string

  static ordinalize(value: string | number): string
}

export declare class Uuid {
  static verify(token: string, isPrefixed?: boolean): boolean

  static generate(prefix?: string): string

  static getToken(token: string): string

  static getPrefix(token: string): string | null

  static injectPrefix(prefix: string, token: string): string

  static changePrefix(newPrefix: string, token: string): string

  static changeOrGenerate(prefix: string, token?: string): string
}

import { dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { Folder } from '#src/index'

export class Module {
  /**
   * Get the module first export match or default.
   *
   * @param {any|Promise<any>} module
   * @return {Promise<any>}
   */
  static async get(module) {
    module = await module

    if (module.default) {
      return module.default
    }

    return module[Object.keys(module)[0]]
  }

  /**
   * Get the module first export match or default with alias.
   *
   * @param {any|Promise<any>} module
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }>}
   */
  static async getWithAlias(module, subAlias) {
    module = await Module.get(module)

    if (!subAlias.endsWith('/')) {
      subAlias = subAlias.concat('/')
    }

    const alias = subAlias.concat(module.name)

    return { alias, module }
  }

  /**
   * Get all modules first export match or default and return
   * as array.
   *
   * @param {any[]|Promise<any[]>} modules
   * @return {Promise<any[]>}
   */
  static async getAll(modules) {
    const promises = modules.map(m => Module.get(m))

    return Promise.all(promises)
  }

  /**
   * Get all modules first export match or default with alias and return
   * as array.
   *
   * @param {any[]|Promise<any[]>} modules
   * @param {string} subAlias
   * @return {Promise<any[]>}
   */
  static async getAllWithAlias(modules, subAlias) {
    const promises = modules.map(m => Module.getWithAlias(m, subAlias))

    return Promise.all(promises)
  }

  /**
   * Same as get method, but import the path directly.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  static async getFrom(path) {
    const module = await Module.import(path)

    return Module.get(module)
  }

  /**
   * Same as getWithAlias method, but import the path directly.
   *
   * @param {string} path
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }>}
   */
  static async getFromWithAlias(path, subAlias) {
    const module = await Module.import(path)

    return Module.getWithAlias(module, subAlias)
  }

  /**
   * Same as getAll method but import everything in the path directly.
   *
   * @param {string} path
   * @return {Promise<any[]>}
   */
  static async getAllFrom(path) {
    const files = await Module.getAllJSFilesFrom(path)

    const promises = files.map(file => Module.getFrom(file.path))

    return Promise.all(promises)
  }

  /**
   * Same as getAllWithAlias method but import everything in the path directly.
   *
   * @param {string} path
   * @param {string} subAlias
   * @return {Promise<{ alias: string, module: any }[]>}
   */
  static async getAllFromWithAlias(path, subAlias) {
    const files = await Module.getAllJSFilesFrom(path)

    const promises = files.map(f => Module.getFromWithAlias(f.path, subAlias))

    return Promise.all(promises)
  }

  /**
   * Verify if folder exists and get all .js files inside.
   *
   * @param {string} path
   * @return {Promise<File[]>}
   */
  static async getAllJSFilesFrom(path) {
    if (!(await Folder.exists(path))) {
      return []
    }

    if (!(await Folder.isFolder(path))) {
      return []
    }

    const folder = await new Folder(path).load()

    // FIXME Why glob pattern *.js is retrieving .d.ts and .js.map files?
    return folder
      .getFilesByPattern('*/**/*.js', true)
      .filter(file => file.extension.endsWith('.js'))
  }

  /**
   * Import a full path using the path href to ensure compatibility
   * between OS's.
   *
   * @param {string} path
   * @return {Promise<any>}
   */
  static async import(path) {
    return import(pathToFileURL(path).href)
  }

  /**
   * Create the __dirname property. Set in global if necessary.
   *
   * @param {string} [url]
   * @param {boolean} [setInGlobal]
   * @return {string}
   */
  static createDirname(url = import.meta.url, setInGlobal = false) {
    const __dirname = dirname(Module.createFilename(url, false))

    if (setInGlobal) {
      global.__dirname = __dirname
    }

    return __dirname
  }

  /**
   * Create the __filename property. Set in global if necessary.
   *
   * @param {string} [url]
   * @param {boolean} [setInGlobal]
   * @return {string}
   */
  static createFilename(url = import.meta.url, setInGlobal = false) {
    const __filename = fileURLToPath(url)

    if (setInGlobal) {
      global.__filename = __filename
    }

    return __filename
  }
}

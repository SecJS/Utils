/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import callSite from 'callsite'

import { homedir, tmpdir } from 'node:os'
import { dirname, normalize, sep } from 'node:path'

export class Path {
  /**
   * Set a default beforePath for all Path methods that
   * use Path.pwd.
   *
   * @type {string}
   */
  static defaultBeforePath = ''

  /**
   * Return the pwd path of your project.
   *
   * @param {string} [subPath]
   * @return {string}
   */
  static pwd(subPath = sep) {
    if (Path.defaultBeforePath) {
      subPath = normalize(Path.defaultBeforePath).concat(sep, subPath)
    }

    const pwd = normalize(`${process.cwd()}${sep}${normalize(subPath)}`)

    return this.#removeSlashes(pwd)
  }

  /**
   * Return the app path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static app(subPath = sep) {
    return this.pwd('app' + sep + normalize(subPath))
  }

  /**
   * Return the bootstrap path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static bootstrap(subPath = sep) {
    return this.pwd('bootstrap' + sep + normalize(subPath))
  }

  /**
   * Return the config path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static config(subPath = sep) {
    return this.pwd('config' + sep + normalize(subPath))
  }

  /**
   * Return the database path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static database(subPath = sep) {
    return this.pwd('database' + sep + normalize(subPath))
  }

  /**
   * Return the lang path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static lang(subPath = sep) {
    return this.pwd('lang' + sep + normalize(subPath))
  }

  /**
   * Return the node_modules path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static nodeModules(subPath = sep) {
    return this.pwd('node_modules' + sep + normalize(subPath))
  }

  /**
   * Return the providers' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static providers(subPath = sep) {
    return this.pwd('providers' + sep + normalize(subPath))
  }

  /**
   * Return the public path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static public(subPath = sep) {
    return this.pwd('public' + sep + normalize(subPath))
  }

  /**
   * Return the resources' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static resources(subPath = sep) {
    return this.pwd('resources' + sep + normalize(subPath))
  }

  /**
   * Return the routes' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static routes(subPath = sep) {
    return this.pwd('routes' + sep + normalize(subPath))
  }

  /**
   * Return the storage path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static storage(subPath = sep) {
    return this.pwd('storage' + sep + normalize(subPath))
  }

  /**
   * Return the tests' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static tests(subPath = sep) {
    return this.pwd('tests' + sep + normalize(subPath))
  }

  /**
   * Return the logs' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static logs(subPath = sep) {
    return this.storage('logs' + sep + normalize(subPath))
  }

  /**
   * Return the views' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static views(subPath = sep) {
    return this.resources('views' + sep + normalize(subPath))
  }

  /**
   * Return the assets' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static assets(subPath = sep) {
    return this.public('assets' + sep + normalize(subPath))
  }

  /**
   * Return the locales' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static locales(subPath = sep) {
    return this.resources('locales' + sep + normalize(subPath))
  }

  /**
   * Return the facades' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static facades(subPath = sep) {
    return this.providers('Facades' + sep + normalize(subPath))
  }

  /**
   * Return the stubs' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static stubs(subPath = sep) {
    return this.tests('Stubs' + sep + normalize(subPath))
  }

  /**
   * Return the http path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static http(subPath = sep) {
    return this.app('Http' + sep + normalize(subPath))
  }

  /**
   * Return the console path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static console(subPath = sep) {
    return this.app('Console' + sep + normalize(subPath))
  }

  /**
   * Return the services' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static services(subPath = sep) {
    return this.app('Services' + sep + normalize(subPath))
  }

  /**
   * Return the migrations' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static migrations(subPath = sep) {
    return this.database('migrations' + sep + normalize(subPath))
  }

  /**
   * Return the seeders' path of your project.
   *
   * @param {string} subPath
   * @return {string}
   */
  static seeders(subPath = sep) {
    return this.database('seeders' + sep + normalize(subPath))
  }

  /**
   * Return the .bin path of your node_modules.
   *
   * @param {string} subPath
   * @return {string}
   */
  static bin(subPath = sep) {
    return this.nodeModules('.bin' + sep + normalize(subPath))
  }

  /**
   * Return the tmp path of your vm.
   *
   * @param {string} subPath
   * @return {string}
   */
  static vmTmp(subPath = sep) {
    const osTmpDir = tmpdir()

    const tmpDir = osTmpDir.concat(sep, normalize(subPath))

    return this.#removeSlashes(tmpDir)
  }

  /**
   * Return the home path of your vm.
   *
   * @param {string} subPath
   * @return {string}
   */
  static vmHome(subPath = sep) {
    const osHomeDir = homedir()

    const homeDir = osHomeDir.concat(sep, normalize(subPath))

    return this.#removeSlashes(homeDir)
  }

  /**
   * Return the execution path of where this method
   * is being called.
   *
   * @param {string} subPath
   * @param {number} [stackIndex]
   * @return {string}
   */
  static this(subPath = sep, stackIndex = 1) {
    const stack = callSite()
    const requester = dirname(stack[stackIndex].getFileName()).replace(
      'file://',
      '',
    )

    const execDir = normalize(requester.concat(sep, normalize(subPath)))

    return this.#removeSlashes(execDir)
  }

  /**
   * Remove additional slashes from path.
   *
   * @param {string} path
   * @return {string}
   */
  static #removeSlashes(path) {
    if (path.endsWith(sep)) {
      path = path.slice(0, -1)

      if (path.endsWith(sep)) {
        return this.#removeSlashes(path)
      }
    }

    return path
  }
}

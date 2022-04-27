/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { homedir, tmpdir } from 'node:os'
import { normalize, sep } from 'node:path'

export class Path {
  /**
   * Set a default beforePath for most Path methods.
   * @type {string}
   */
  static defaultBeforePath = ''

  /**
   * Return the pwd path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static pwd(subPath = sep, beforePath) {
    if (Path.defaultBeforePath) {
      subPath = normalize(Path.defaultBeforePath).concat(sep, subPath)
    }

    if (beforePath) {
      subPath = normalize(beforePath).concat(sep, subPath)
    }

    const pwd = normalize(`${process.cwd()}${sep}${normalize(subPath)}`)

    return this.#removeSlashes(pwd)
  }

  /**
   * Return the app path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static app(subPath = sep, beforePath = '') {
    return this.pwd('app' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the bootstrap path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static bootstrap(subPath = sep, beforePath = '') {
    return this.pwd('bootstrap' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the config path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static config(subPath = sep, beforePath = '') {
    return this.pwd('config' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the database path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static database(subPath = sep, beforePath = '') {
    return this.pwd('database' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the lang path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static lang(subPath = sep, beforePath = '') {
    return this.pwd('lang' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the node_modules path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static nodeModules(subPath = sep, beforePath = '') {
    return this.pwd('node_modules' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the providers' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static providers(subPath = sep, beforePath = '') {
    return this.pwd('providers' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the public path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static public(subPath = sep, beforePath = '') {
    return this.pwd('public' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the resources' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static resources(subPath = sep, beforePath = '') {
    return this.pwd('resources' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the routes' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static routes(subPath = sep, beforePath = '') {
    return this.pwd('routes' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the storage path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static storage(subPath = sep, beforePath = '') {
    return this.pwd('storage' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the tests' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static tests(subPath = sep, beforePath = '') {
    return this.pwd('tests' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the logs' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static logs(subPath = sep, beforePath = '') {
    return this.storage('logs' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the views' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static views(subPath = sep, beforePath = '') {
    return this.resources('views' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the assets' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static assets(subPath = sep, beforePath = '') {
    return this.public('assets' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the locales' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static locales(subPath = sep, beforePath = '') {
    return this.resources('locales' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the facades' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static facades(subPath = sep, beforePath = '') {
    return this.providers('Facades' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the stubs' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static stubs(subPath = sep, beforePath = '') {
    return this.tests('Stubs' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the http path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static http(subPath = sep, beforePath = '') {
    return this.app('Http' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the console path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static console(subPath = sep, beforePath = '') {
    return this.app('Console' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the services' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static services(subPath = sep, beforePath = '') {
    return this.app('Services' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the migrations' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static migrations(subPath = sep, beforePath = '') {
    return this.database('migrations' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the seeders' path of your project.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static seeders(subPath = sep, beforePath = '') {
    return this.database('seeders' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the .bin path of your node_modules.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static bin(subPath = sep, beforePath = '') {
    return this.nodeModules('.bin' + sep + normalize(subPath), beforePath)
  }

  /**
   * Return the tmp path of your vm.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static vmTmp(subPath = sep, beforePath = '') {
    const osTmpDir = tmpdir()

    if (beforePath) {
      subPath = normalize(beforePath).concat(sep, subPath)
    }

    const tmpDir = osTmpDir.concat(sep, normalize(subPath))

    return this.#removeSlashes(tmpDir)
  }

  /**
   * Return the home path of your vm.
   *
   * @param {string?} subPath
   * @param {string?} beforePath
   * @return {string}
   */
  static vmHome(subPath = sep, beforePath = '') {
    const osHomeDir = homedir()

    if (beforePath) {
      subPath = normalize(beforePath).concat(sep, subPath)
    }

    const homeDir = osHomeDir.concat(sep, normalize(subPath))

    return this.#removeSlashes(homeDir)
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

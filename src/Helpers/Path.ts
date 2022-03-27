/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { normalize, sep } from 'path'

export class Path {
  private static _tempBuild = null
  private static _forceBuild = false
  private static _defaultBuild = `${sep}dist`
  private static _verifyNodeEnv = true

  static noBuild() {
    this._tempBuild = sep

    return this
  }

  static forBuild(name: string) {
    this._tempBuild = normalize(`${sep}${name}`)

    return this
  }

  static switchBuild() {
    this._forceBuild = !this._forceBuild

    return this
  }

  static switchEnvVerify() {
    this._verifyNodeEnv = !this._verifyNodeEnv

    return this
  }

  static changeBuild(name: string) {
    this._defaultBuild = normalize(`${sep}${name}`)

    return this
  }

  static nodeCwdPath() {
    let cwdNodePath = process.cwd()

    if (this._tempBuild) {
      cwdNodePath += this._tempBuild

      this._tempBuild = null

      return this.removeSlashFromEnd(cwdNodePath)
    }

    if (this._forceBuild) {
      cwdNodePath += this._defaultBuild

      return this.removeSlashFromEnd(cwdNodePath)
    }

    if (
      !this._forceBuild &&
      this._verifyNodeEnv &&
      process.env.NODE_TS === 'false'
    ) {
      cwdNodePath += this._defaultBuild

      return this.removeSlashFromEnd(cwdNodePath)
    }

    return this.removeSlashFromEnd(cwdNodePath)
  }

  static pwd(subPath = sep) {
    const pwd = normalize(`${this.nodeCwdPath()}${sep}${normalize(subPath)}`)

    return this.removeSlashFromEnd(pwd)
  }

  static app(subPath = sep) {
    return this.pwd('app' + sep + normalize(subPath))
  }

  static logs(subPath = sep) {
    return this.storage('logs' + sep + normalize(subPath))
  }

  static start(subPath = sep) {
    return this.pwd('start' + sep + normalize(subPath))
  }

  static views(subPath = sep) {
    return this.resources('views' + sep + normalize(subPath))
  }

  static config(subPath = sep) {
    return this.pwd('config' + sep + normalize(subPath))
  }

  static tests(subPath = sep) {
    return this.pwd('tests' + sep + normalize(subPath))
  }

  static public(subPath = sep) {
    return this.pwd('public' + sep + normalize(subPath))
  }

  static assets(subPath = sep) {
    return this.public('assets' + sep + normalize(subPath))
  }

  static storage(subPath = sep) {
    return this.pwd('storage' + sep + normalize(subPath))
  }

  static database(subPath = sep) {
    return this.pwd('database' + sep + normalize(subPath))
  }

  static locales(subPath = sep) {
    return this.resources('locales' + sep + normalize(subPath))
  }

  static resources(subPath = sep) {
    return this.pwd('resources' + sep + normalize(subPath))
  }

  static providers(subPath = sep) {
    return this.pwd('providers' + sep + normalize(subPath))
  }

  private static removeSlashFromEnd(path: string) {
    if (path.endsWith(sep)) {
      return path.slice(0, -1)
    }

    return path
  }
}

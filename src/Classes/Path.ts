/*
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class Path {
  private static _tempBuild = null
  private static _forceBuild = false
  private static _defaultBuild = 'dist'
  private static _verifyNodeEnv = true

  static forBuild(name: string) {
    this._tempBuild = name

    return this
  }

  static switchEnvVerify() {
    this._verifyNodeEnv = !this._verifyNodeEnv

    return this
  }

  static changeBuild(name: string) {
    this._defaultBuild = name

    return this
  }

  static forceBuild() {
    this._forceBuild = true

    return this
  }

  static nodeCwdPath() {
    let cwdNodePath = process.cwd()

    if (this._tempBuild) {
      cwdNodePath += this.adjustSlashes(this._tempBuild)

      this._tempBuild = null

      return cwdNodePath
    }

    if (this._forceBuild) {
      cwdNodePath += this.adjustSlashes(this._defaultBuild)

      this._forceBuild = false
    }

    if (!this._forceBuild && this._verifyNodeEnv) {
      if (['ci', 'testing', 'ts-development'].includes(process.env.NODE_ENV)) {
        cwdNodePath += this.adjustSlashes(this._defaultBuild)
      }
    }

    return this.adjustSlashes(cwdNodePath)
  }

  static pwd(subPath = '/') {
    return `${this.nodeCwdPath()}${this.adjustSlashes(subPath)}`
  }

  static app(subPath = '/') {
    return this.pwd('app' + this.adjustSlashes(subPath))
  }

  static logs(subPath = '/') {
    return this.storage('logs' + this.adjustSlashes(subPath))
  }

  static start(subPath = '/') {
    return this.pwd('start' + this.adjustSlashes(subPath))
  }

  static views(subPath = '/') {
    return this.resources('views' + this.adjustSlashes(subPath))
  }

  static config(subPath = '/') {
    return this.pwd('config' + this.adjustSlashes(subPath))
  }

  static tests(subPath = '/') {
    return this.pwd('tests' + this.adjustSlashes(subPath))
  }

  static public(subPath = '/') {
    return this.pwd('public' + this.adjustSlashes(subPath))
  }

  static assets(subPath = '/') {
    return this.public('assets' + this.adjustSlashes(subPath))
  }

  static storage(subPath = '/') {
    return this.pwd('storage' + this.adjustSlashes(subPath))
  }

  static database(subPath = '/') {
    return this.pwd('database' + this.adjustSlashes(subPath))
  }

  static locales(subPath = '/') {
    return this.resources('locales' + this.adjustSlashes(subPath))
  }

  static resources(subPath = '/') {
    return this.pwd('resources' + this.adjustSlashes(subPath))
  }

  static providers(subPath = '/') {
    return this.pwd('providers' + this.adjustSlashes(subPath))
  }

  private static adjustSlashes(path: string) {
    let subPathArray = path.split('/')

    subPathArray = subPathArray.filter(p => p !== '')
    subPathArray.unshift('')

    return subPathArray.join('/')
  }
}

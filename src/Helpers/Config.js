/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'node:path'
import { File } from '#src/Helpers/File'
import { Json } from '#src/Helpers/Json'
import { Debug } from '#src/Helpers/Debug'
import { RecursiveConfigException } from '#src/Exceptions/RecursiveConfigException'
import { ConfigNotNormalizedException } from '#src/Exceptions/ConfigNotNormalizedException'

export class Config {
  /**
   * Map structure to save all configuration files.
   *
   * @type {Map<string, any>}
   */
  static configs = new Map()

  /**
   * Get the value from configuration files.
   *
   * @param {string} key
   * @param {any} [defaultValue]
   * @return {any}
   */
  static get(key, defaultValue = undefined) {
    const [mainKey, ...keys] = key.split('.')

    const config = this.configs.get(mainKey)

    return Json.get(config, keys.join('.'), defaultValue)
  }

  /**
   * Load the configuration file only if it has
   * not been loaded yet.
   *
   * @param {string} path
   * @param {number?} callNumber
   * @return {Promise<void>}
   */
  async safeLoad(path, callNumber) {
    const { name } = parse(path)

    if (Config.configs.has(name)) {
      return
    }

    return this.load(path, callNumber)
  }

  /**
   * Load the configuration file.
   *
   * @param {string} path
   * @param {number?} callNumber
   * @return {Promise<void>}
   */
  async load(path, callNumber = 0) {
    const { dir, name, base, ext } = parse(path)

    if (callNumber > 500) {
      throw new RecursiveConfigException(path, name)
    }

    if (base.includes('.js.map') || base.includes('.d.ts')) {
      return
    }

    const file = new File(path).loadSync()
    const fileContent = file.getContentSync().toString()

    if (
      !fileContent.includes('export default') &&
      !fileContent.includes('module.exports') &&
      !fileContent.includes('exports.default')
    ) {
      throw new ConfigNotNormalizedException(path)
    }

    if (fileContent.includes('Config.get')) {
      const matches = fileContent.match(/Config.get\(([^)]+)\)/g)

      for (let match of matches) {
        match = match.replace('Config.get', '').replace(/[(^)']/g, '')

        const fileName = `${match.split('.')[0]}`
        const fileBase = `${fileName}${ext}`
        const filePath = `${dir}/${fileBase}`

        await this.safeLoad(filePath, callNumber + 1)
      }
    }

    Debug.log(`Loading ${path} configuration file`, 'api:configurations')
    Config.configs.set(
      name,
      (await import(`${file.href}?version=${Math.random()}${ext}`)).default,
    )
  }
}

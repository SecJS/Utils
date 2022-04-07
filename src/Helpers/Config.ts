/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { parse } from 'path'
import { File } from './File'
import { Debug } from './Debug'
import { RecursiveConfigException } from '../Exceptions/RecursiveConfigException'
import { ConfigFileNotNormalizedException } from '../Exceptions/ConfigFileNotNormalizedException'

export class Config {
  private static configs: Map<string, any> = new Map()
  private static debug = new Debug(Config.name, 'api:configurations')

  static get<T = any>(key: string, defaultValue = undefined): T | undefined {
    const [mainKey, ...keys] = key.split('.')

    let config = this.configs.get(mainKey)

    if (config && keys.length) {
      keys.forEach(key => (config = config[key]))
    }

    if (config === undefined) config = defaultValue

    return config
  }

  clear() {
    Config.configs.clear()
  }

  async safeLoad(path: string) {
    const { name } = parse(path)

    if (Config.configs.has(name)) {
      return
    }

    return this.load(path)
  }

  async load(path: string, callNumber = 0) {
    const { dir, name, base } = parse(path)

    if (callNumber > 500) {
      throw new RecursiveConfigException(base, name)
    }

    if (base.includes('.map') || base.includes('.d.ts')) return

    const fileExtension = process.env.NODE_TS === 'true' ? 'ts' : 'js'
    const fileBase = `${name}.${fileExtension}`

    const file = new File(`${dir}/${fileBase}`).loadSync()
    const fileContent = file.getContentSync().toString()

    if (
      !fileContent.includes('export default') &&
      !fileContent.includes('module.exports') &&
      !fileContent.includes('exports.default')
    ) {
      throw new ConfigFileNotNormalizedException(base)
    }

    if (fileContent.includes('Config.get')) {
      const matches = fileContent.match(/Config.get\(([^)]+)\)/g)

      for (let match of matches) {
        match = match.replace('Config.get', '').replace(/[(^)']/g, '')

        const fileExtension = process.env.NODE_TS === 'true' ? 'ts' : 'js'
        const fileName = `${match.split('.')[0]}`
        const fileBase = `${fileName}.${fileExtension}`
        const filePath = `${dir}/${fileBase}`

        // If configuration already exists continue the loop
        if (Config.configs.has(fileName)) continue

        await this.load(filePath, callNumber + 1)
      }
    }

    Config.debug.log(`Loading ${name} configuration file`)
    Config.configs.set(name, (await import(file.path)).default)
  }
}

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '#src/Helpers/Path'
import { Folder } from '#src/Helpers/Folder'
import { Config } from '#src/Helpers/Config'
import { RecursiveConfigException } from '#src/Exceptions/RecursiveConfigException'
import { ConfigNotNormalizedException } from '#src/Exceptions/ConfigNotNormalizedException'

describe('\n ConfigTest', () => {
  beforeEach(async () => {
    Config.configs.clear()

    const config = new Config()

    await new Folder(Path.stubs('config')).copy(Path.config())

    await config.safeLoad(Path.config('app.js'))
    await config.safeLoad(Path.config('database.js'))
  })

  it('should be able to get configurations values from Config class', async () => {
    const appName = Config.get('app.name')

    expect(appName).toBe('SecJS')
  })

  it('should be able to create a load chain when a configuration uses other configuration', async () => {
    expect(Config.get('database.username')).toBe('SecJS')
    expect(Config.get('app.name')).toBe('SecJS')
  })

  it('should throw an error when loading a file that is trying to use Config.get() to get information from other config file but this config file is trying to use Config.get() to this same file', async () => {
    const useCase = async () => await new Config().load(Path.config('recursiveOne.js'))

    await expect(useCase()).rejects.toThrow(RecursiveConfigException)
  })

  it('should throw an error when trying to load a file that is not normalized', async () => {
    const useCase = async () => await new Config().load(Path.config('notNormalized.js'))

    await expect(useCase()).rejects.toThrow(ConfigNotNormalizedException)
  })

  it('should not load .map/.d.ts files', async () => {
    await new Config().load(Path.config('app.d.ts'))
    await new Config().load(Path.config('app.js.map'))

    expect(Config.get('app.name')).toBe('SecJS')
  })

  afterEach(async () => {
    await Folder.safeRemove(Path.config())
  })
})

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Path, Config, Folder } from '#src/index'
import { RecursiveConfigException } from '#src/Exceptions/RecursiveConfigException'
import { ConfigNotNormalizedException } from '#src/Exceptions/ConfigNotNormalizedException'

test.group('ConfigTest', group => {
  group.each.setup(async () => {
    Config.configs.clear()

    const config = new Config()

    await new Folder(Path.stubs('config')).copy(Path.config())

    await config.safeLoad(Path.config('app.js'))
    await config.safeLoad(Path.config('database.js'))
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.config())
  })

  test('should be able to get configurations values from Config class', ({ assert }) => {
    const appName = Config.get('app.name')

    assert.equal(appName, 'SecJS')
  })

  test('should be able to create a load chain when a configuration uses other configuration', ({ assert }) => {
    assert.equal(Config.get('app.name'), 'SecJS')
    assert.equal(Config.get('database.username'), 'SecJS')
  })

  test('should throw an error when loading a file that is trying to use Config.get() to get information from other config file but this config file is trying to use Config.get() to this same file', async ({
    assert,
  }) => {
    const useCase = async () => await new Config().load(Path.config('recursiveOne.js'))

    await assert.rejects(useCase, RecursiveConfigException)
  })

  test('should throw an error when trying to load a file that is not normalized', async ({ assert }) => {
    const useCase = async () => await new Config().load(Path.config('notNormalized.js'))

    await assert.rejects(useCase, ConfigNotNormalizedException)
  })

  test('should not load .map/.d.ts files', async ({ assert }) => {
    await new Config().load(Path.config('app.d.ts'))
    await new Config().load(Path.config('app.js.map'))

    assert.equal(Config.get('app.name'), 'SecJS')
  })
})

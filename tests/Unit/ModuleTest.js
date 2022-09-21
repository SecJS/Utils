/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Module, Path } from '#src/index'

test.group('ExecTest', group => {
  test('should be able to get the module first export match or default', async ({ assert }) => {
    const moduleDefault = await Module.get(import('../Stubs/config/app.js'))

    assert.equal(moduleDefault.name, 'SecJS')

    const moduleFirstExport = await Module.get(import('#src/Helpers/Options'))

    assert.equal(moduleFirstExport.name, 'Options')
  })

  test('should be able to get all modules first export match or default', async ({ assert }) => {
    const modules = [import('../Stubs/config/app.js'), import('#src/Helpers/Options')]

    const modulesResolved = await Module.getAll(modules)

    assert.equal(modulesResolved[0].name, 'SecJS')
    assert.equal(modulesResolved[1].name, 'Options')
  })

  test('should be able to get all modules first export match or default with alias', async ({ assert }) => {
    const modules = [import('#src/Helpers/Is'), import('#src/Helpers/Options')]

    const modulesResolved = await Module.getAllWithAlias(modules, 'App/Helpers/')

    assert.equal(modulesResolved[0].module.name, 'Is')
    assert.equal(modulesResolved[0].alias, 'App/Helpers/Is')

    assert.equal(modulesResolved[1].module.name, 'Options')
    assert.equal(modulesResolved[1].alias, 'App/Helpers/Options')
  })

  test('should be able to get the module first export match or default from any path', async ({ assert }) => {
    const moduleDefault = await Module.getFrom(Path.stubs('config/app.js'))

    assert.equal(moduleDefault.name, 'SecJS')

    const moduleFirstExport = await Module.getFrom(Path.pwd('src/Helpers/Options.js'))

    assert.equal(moduleFirstExport.name, 'Options')
  })

  test('should be able to get all modules first export match or default from any path', async ({ assert }) => {
    const modules = await Module.getAllFrom(Path.pwd('src/Helpers'))

    assert.lengthOf(modules, 18)
    assert.equal(modules[0].name, 'Clean')
  })

  test('should be able to get all modules first export match or default from any path with alias', async ({
    assert,
  }) => {
    const modules = await Module.getAllFromWithAlias(Path.pwd('src/Helpers'), 'App/Helpers')

    assert.lengthOf(modules, 18)
    assert.equal(modules[0].module.name, 'Clean')
    assert.equal(modules[0].alias, 'App/Helpers/Clean')
  })

  test('should be able to create __filename property inside node global', async ({ assert }) => {
    Module.createFilename(import.meta.url, true)

    assert.isTrue(__filename.includes('ModuleTest.js'))
  })

  test('should be able to create __dirname property inside node global', async ({ assert }) => {
    Module.createDirname(import.meta.url, true)

    assert.isTrue(__dirname.includes('Unit'))
  })
})

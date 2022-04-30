/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { Path } from '#src/index'
import { test } from '@japa/runner'

test.group('PathTest', () => {
  test('should get pwd path', async ({ assert }) => {
    const mainPath = process.cwd()
    const srcPath = mainPath.concat(sep, 'src')
    const srcAppPath = srcPath.concat(sep, 'app')

    assert.equal(Path.pwd(), mainPath)
    assert.equal(Path.pwd(sep.concat('src')), srcPath)
    assert.equal(Path.pwd(sep.concat('src', sep)), srcPath)
    assert.equal(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep)), srcPath)
    assert.equal(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep, 'app', sep, sep, sep)), srcAppPath)
  })

  test('should get the main application paths', async ({ assert }) => {
    const mainPath = process.cwd()

    assert.equal(Path.app(), mainPath.concat(sep, 'app'))
    assert.equal(Path.bootstrap(), mainPath.concat(sep, 'bootstrap'))
    assert.equal(Path.config(), mainPath.concat(sep, 'config'))
    assert.equal(Path.database(), mainPath.concat(sep, 'database'))
    assert.equal(Path.lang(), mainPath.concat(sep, 'lang'))
    assert.equal(Path.nodeModules(), mainPath.concat(sep, 'node_modules'))
    assert.equal(Path.providers(), mainPath.concat(sep, 'providers'))
    assert.equal(Path.public(), mainPath.concat(sep, 'public'))
    assert.equal(Path.resources(), mainPath.concat(sep, 'resources'))
    assert.equal(Path.routes(), mainPath.concat(sep, 'routes'))
    assert.equal(Path.storage(), mainPath.concat(sep, 'storage'))
    assert.equal(Path.tests(), mainPath.concat(sep, 'tests'))
    assert.isDefined(Path.vmTmp())
    assert.isDefined(Path.vmHome())
    assert.isTrue(Path.this().endsWith('Unit'))
    assert.isFalse(Path.this('../../').endsWith('tests'))
  })

  test('should get the sub paths of app main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'app')

    assert.equal(Path.http(), mainPath.concat(sep, 'Http'))
    assert.equal(Path.console(), mainPath.concat(sep, 'Console'))
    assert.equal(Path.services(), mainPath.concat(sep, 'Services'))
  })

  test('should get the sub paths of database main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'database')

    assert.equal(Path.seeders(), mainPath.concat(sep, 'seeders'))
    assert.equal(Path.migrations(), mainPath.concat(sep, 'migrations'))
  })

  test('should get the sub paths of node_modules main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'node_modules')

    assert.equal(Path.bin(), mainPath.concat(sep, '.bin'))
  })

  test('should get the sub paths of public main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'public')

    assert.equal(Path.assets(), mainPath.concat(sep, 'assets'))
  })

  test('should get the sub paths of tests main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'tests')

    assert.equal(Path.stubs(), mainPath.concat(sep, 'Stubs'))
  })

  test('should get the sub paths of storage main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'storage')

    assert.equal(Path.logs(), mainPath.concat(sep, 'logs'))
  })

  test('should get the sub paths of resources main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'resources')

    assert.equal(Path.views(), mainPath.concat(sep, 'views'))
    assert.equal(Path.locales(), mainPath.concat(sep, 'locales'))
  })

  test('should get the sub paths of providers main path', async ({ assert }) => {
    const mainPath = process.cwd().concat(sep, 'providers')

    assert.equal(Path.facades(), mainPath.concat(sep, 'Facades'))
  })

  test('should be able to set a default before path in Path class', async ({ assert }) => {
    const mainPath = process.cwd()

    Path.defaultBeforePath = 'build'

    assert.equal(Path.pwd('/'), `${mainPath}${sep}build`)
    assert.equal(Path.app('/'), `${mainPath}${sep}build${sep}app`)
    assert.equal(Path.console('/'), `${mainPath}${sep}build${sep}app${sep}Console`)
    assert.isDefined(Path.vmTmp('/'))
    assert.isDefined(Path.vmHome('/'))
  })
})

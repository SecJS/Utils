/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'

import { Path } from '#src/Path'

describe('\n PathTest', () => {
  it('should get pwd path', () => {
    const mainPath = process.cwd()
    const srcPath = mainPath.concat(sep, 'src')
    const srcAppPath = srcPath.concat(sep, 'app')

    expect(Path.pwd()).toBe(mainPath)
    expect(Path.pwd(sep.concat('src'))).toBe(srcPath)
    expect(Path.pwd(sep.concat('src', sep))).toBe(srcPath)
    expect(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep))).toBe(srcPath)
    expect(Path.pwd(sep.concat(sep, sep, 'src', sep, sep, sep, 'app', sep, sep, sep))).toBe(srcAppPath)
  })

  it('should get the main application paths', () => {
    const mainPath = process.cwd()

    expect(Path.app()).toBe(mainPath.concat(sep, 'app'))
    expect(Path.bootstrap()).toBe(mainPath.concat(sep, 'bootstrap'))
    expect(Path.config()).toBe(mainPath.concat(sep, 'config'))
    expect(Path.database()).toBe(mainPath.concat(sep, 'database'))
    expect(Path.lang()).toBe(mainPath.concat(sep, 'lang'))
    expect(Path.nodeModules()).toBe(mainPath.concat(sep, 'node_modules'))
    expect(Path.providers()).toBe(mainPath.concat(sep, 'providers'))
    expect(Path.public()).toBe(mainPath.concat(sep, 'public'))
    expect(Path.resources()).toBe(mainPath.concat(sep, 'resources'))
    expect(Path.routes()).toBe(mainPath.concat(sep, 'routes'))
    expect(Path.storage()).toBe(mainPath.concat(sep, 'storage'))
    expect(Path.tests()).toBe(mainPath.concat(sep, 'tests'))
    expect(Path.vmTmp()).toBeTruthy()
    expect(Path.vmHome()).toBeTruthy()
    expect(Path.this().endsWith('Unit')).toBeTruthy()
    expect(Path.this('../../').endsWith('tests')).toBeFalsy()
  })

  it('should get the sub paths of app main path', () => {
    const mainPath = process.cwd().concat(sep, 'app')

    expect(Path.http()).toBe(mainPath.concat(sep, 'Http'))
    expect(Path.console()).toBe(mainPath.concat(sep, 'Console'))
    expect(Path.services()).toBe(mainPath.concat(sep, 'Services'))
  })

  it('should get the sub paths of database main path', () => {
    const mainPath = process.cwd().concat(sep, 'database')

    expect(Path.seeders()).toBe(mainPath.concat(sep, 'seeders'))
    expect(Path.migrations()).toBe(mainPath.concat(sep, 'migrations'))
  })

  it('should get the sub paths of node_modules main path', () => {
    const mainPath = process.cwd().concat(sep, 'node_modules')

    expect(Path.bin()).toBe(mainPath.concat(sep, '.bin'))
  })

  it('should get the sub paths of public main path', () => {
    const mainPath = process.cwd().concat(sep, 'public')

    expect(Path.assets()).toBe(mainPath.concat(sep, 'assets'))
  })

  it('should get the sub paths of tests main path', () => {
    const mainPath = process.cwd().concat(sep, 'tests')

    expect(Path.stubs()).toBe(mainPath.concat(sep, 'Stubs'))
  })

  it('should get the sub paths of storage main path', () => {
    const mainPath = process.cwd().concat(sep, 'storage')

    expect(Path.logs()).toBe(mainPath.concat(sep, 'logs'))
  })

  it('should get the sub paths of resources main path', () => {
    const mainPath = process.cwd().concat(sep, 'resources')

    expect(Path.views()).toBe(mainPath.concat(sep, 'views'))
    expect(Path.locales()).toBe(mainPath.concat(sep, 'locales'))
  })

  it('should get the sub paths of providers main path', () => {
    const mainPath = process.cwd().concat(sep, 'providers')

    expect(Path.facades()).toBe(mainPath.concat(sep, 'Facades'))
  })

  it('should be able to set a default before path in Path class', () => {
    const mainPath = process.cwd()

    Path.defaultBeforePath = 'build'

    expect(Path.pwd('/')).toBe(`${mainPath}${sep}build`)
    expect(Path.app('/')).toBe(`${mainPath}${sep}build${sep}app`)
    expect(Path.console('/')).toBe(`${mainPath}${sep}build${sep}app${sep}Console`)
    expect(Path.vmTmp('/')).toBeTruthy()
    expect(Path.vmHome('/')).toBeTruthy()
  })
})

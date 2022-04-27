/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '#src/Path'

describe('\n PathTest', () => {
  it('should get pwd path', () => {
    const mainPath = process.cwd()
    const srcPath = mainPath.concat('/src')
    const srcAppPath = srcPath.concat('/app')

    expect(Path.pwd()).toBe(mainPath)
    expect(Path.pwd('/src')).toBe(srcPath)
    expect(Path.pwd('/src/')).toBe(srcPath)
    expect(Path.pwd('///src///')).toBe(srcPath)
    expect(Path.pwd('///src///app///')).toBe(srcAppPath)
  })

  it('should get the main application paths', () => {
    const mainPath = process.cwd()

    expect(Path.app()).toBe(mainPath.concat('/app'))
    expect(Path.bootstrap()).toBe(mainPath.concat('/bootstrap'))
    expect(Path.config()).toBe(mainPath.concat('/config'))
    expect(Path.database()).toBe(mainPath.concat('/database'))
    expect(Path.lang()).toBe(mainPath.concat('/lang'))
    expect(Path.nodeModules()).toBe(mainPath.concat('/node_modules'))
    expect(Path.providers()).toBe(mainPath.concat('/providers'))
    expect(Path.public()).toBe(mainPath.concat('/public'))
    expect(Path.resources()).toBe(mainPath.concat('/resources'))
    expect(Path.routes()).toBe(mainPath.concat('/routes'))
    expect(Path.storage()).toBe(mainPath.concat('/storage'))
    expect(Path.tests()).toBe(mainPath.concat('/tests'))
    expect(Path.vmTmp().startsWith('/')).toBeTruthy()
    expect(Path.vmHome().startsWith('/')).toBeTruthy()
  })

  it('should get the sub paths of app main path', () => {
    const mainPath = process.cwd().concat('/app')

    expect(Path.http()).toBe(mainPath.concat('/Http'))
    expect(Path.console()).toBe(mainPath.concat('/Console'))
    expect(Path.services()).toBe(mainPath.concat('/Services'))
  })

  it('should get the sub paths of database main path', () => {
    const mainPath = process.cwd().concat('/database')

    expect(Path.seeders()).toBe(mainPath.concat('/seeders'))
    expect(Path.migrations()).toBe(mainPath.concat('/migrations'))
  })

  it('should get the sub paths of node_modules main path', () => {
    const mainPath = process.cwd().concat('/node_modules')

    expect(Path.bin()).toBe(mainPath.concat('/.bin'))
  })

  it('should get the sub paths of public main path', () => {
    const mainPath = process.cwd().concat('/public')

    expect(Path.assets()).toBe(mainPath.concat('/assets'))
  })

  it('should get the sub paths of tests main path', () => {
    const mainPath = process.cwd().concat('/tests')

    expect(Path.stubs()).toBe(mainPath.concat('/Stubs'))
  })

  it('should get the sub paths of storage main path', () => {
    const mainPath = process.cwd().concat('/storage')

    expect(Path.logs()).toBe(mainPath.concat('/logs'))
  })

  it('should get the sub paths of resources main path', () => {
    const mainPath = process.cwd().concat('/resources')

    expect(Path.views()).toBe(mainPath.concat('/views'))
    expect(Path.locales()).toBe(mainPath.concat('/locales'))
  })

  it('should get the sub paths of providers main path', () => {
    const mainPath = process.cwd().concat('/providers')

    expect(Path.facades()).toBe(mainPath.concat('/Facades'))
  })

  it('should be able to concat any path before the main path', () => {
    const mainPath = process.cwd()

    expect(Path.pwd('/', 'build')).toBe(`${mainPath}/build`)
    expect(Path.app('/', 'build')).toBe(`${mainPath}/build/app`)
    expect(Path.console('/', 'build')).toBe(`${mainPath}/build/app/Console`)
    expect(Path.vmTmp('/', 'build').startsWith('/')).toBeTruthy()
    expect(Path.vmHome('/', 'build').startsWith('/')).toBeTruthy()
  })

  it('should be able to set a default before path in Path class', () => {
    const mainPath = process.cwd()

    Path.defaultBeforePath = 'build'

    expect(Path.pwd('/')).toBe(`${mainPath}/build`)
    expect(Path.app('/')).toBe(`${mainPath}/build/app`)
    expect(Path.console('/')).toBe(`${mainPath}/build/app/Console`)
    expect(Path.vmTmp('/').startsWith('/')).toBeTruthy()
    expect(Path.vmHome('/').startsWith('/')).toBeTruthy()
  })
})

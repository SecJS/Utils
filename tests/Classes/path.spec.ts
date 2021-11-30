/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '../../src/Classes/Path'

describe('\n Path Class', () => {
  it('should get application pwd path', () => {
    const myMainPath = process.cwd()
    const mySrcPath = myMainPath + '/src'
    const mySrcAppPath = myMainPath + '/src/app'

    expect(Path.pwd()).toBe(myMainPath)
    expect(Path.pwd('/src')).toBe(mySrcPath)
    expect(Path.pwd('/src/')).toBe(mySrcPath)
    expect(Path.pwd('///src///')).toBe(mySrcPath)
    expect(Path.pwd('///src///app///')).toBe(mySrcAppPath)
  })

  it('should get application storage path', () => {
    const myStoragePath = process.cwd() + '/storage'
    const myStorageLogsPath = myStoragePath + '/logs'

    expect(Path.storage()).toBe(myStoragePath)
    expect(Path.storage('logs')).toBe(myStorageLogsPath)
    expect(Path.storage('///logs///')).toBe(myStorageLogsPath)
  })

  it('should get application views path', () => {
    const myViewsPath = process.cwd() + '/resources/views'
    const myViewsMailPath = myViewsPath + '/Mail'

    expect(Path.views()).toBe(myViewsPath)
    expect(Path.views('Mail')).toBe(myViewsMailPath)
    expect(Path.views('///Mail///')).toBe(myViewsMailPath)
  })

  it('should get node cwd path based on ts build folder validations', () => {
    const myMainPath = process.cwd()
    const myMainDistPath = process.cwd() + '/dist'

    Path.switchBuild()

    expect(Path.nodeCwdPath()).toBe(myMainDistPath)
    expect(Path.forBuild('build').nodeCwdPath()).toBe(myMainPath + '/build')
    expect(Path.nodeCwdPath()).toBe(myMainDistPath)
    expect(Path.changeBuild('/test').nodeCwdPath()).toBe(myMainPath + '/test')

    Path.changeBuild('/dist').switchBuild().switchEnvVerify()

    process.env.NODE_TS = 'false'
    expect(Path.nodeCwdPath()).toBe(myMainDistPath)
    expect(Path.noBuild().nodeCwdPath()).toBe(myMainPath)

    Path.switchEnvVerify()

    expect(Path.nodeCwdPath()).toBe(myMainPath)
  })
})

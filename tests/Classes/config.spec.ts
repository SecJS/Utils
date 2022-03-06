/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '../../src/Classes/Path'
import { Config } from '../../src/Classes/Config'

describe('\n Config Class', () => {
  beforeEach(async () => {
    const config = new Config()

    config.clear()
    config.load(Path.tests('stubs/test.ts'))
  })

  it('should be able to get configurations values from Config class', async () => {
    const string = Config.get('test.hello')

    expect(string).toBe('world')
  })

  it('should be able to create a load chain when a configuration uses other configuration', async () => {
    const config = new Config()

    config.load(Path.tests('stubs/test-ondemand.ts'))

    expect(Config.get('sub-test.sub')).toBe(true)
    expect(Config.get('test-ondemand.hello')).toBe(true)
  })

  it('should be able to load configuration file without extension', async () => {
    const config = new Config()

    config.load(Path.tests('stubs/no-extension'))

    expect(Config.get('no-extension.extension')).toBe(false)
  })

  it('should throw an error when file is trying to use Config.get() to get information from other config file but this config file is trying to use Config.get() to this same file', async () => {
    try {
      new Config().load(Path.tests('stubs/infinite-callA.ts'))
    } catch (err) {
      expect(err.name).toBe('InternalServerException')
      expect(err.status).toBe(500)
      expect(err.isSecJsException).toBe(true)
      expect(err.content).toBe(
        "Your config file infinite-callB.ts is using Config.get() to an other config file that is using a Config.get('infinite-callB*'), creating a infinite recursive call.",
      )
    }
  })

  it('should throw an error when trying to load a file that is not normalized', async () => {
    try {
      new Config().load(Path.tests('stubs/test-error.ts'))
    } catch (err) {
      expect(err.name).toBe('InternalServerException')
      expect(err.status).toBe(500)
      expect(err.isSecJsException).toBe(true)
      expect(err.content).toBe(
        'Config file test-error.ts is not normalized because it is not exporting a default value',
      )
    }
  })
})

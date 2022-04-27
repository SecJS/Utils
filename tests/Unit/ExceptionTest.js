/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Exception'

describe('\n ExceptionTest', () => {
  it('should be able to create a new exception', () => {
    const exception = new Exception('My custom instance error', 500)

    const errorJson = exception.toJSON()

    expect(errorJson.code).toBe('EXCEPTION')
    expect(errorJson.name).toBe('Exception')
    expect(errorJson.status).toBe(500)
    expect(errorJson.content).toBe('My custom instance error')
  })

  it('should be able to extend exception class to create a new exception', () => {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error', status = 500) {
        super(content, status, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
      }
    }

    const exception = new InternalServerException()

    const errorJson = exception.toJSON(false)

    expect(errorJson.stack).toBeFalsy()
    expect(errorJson.code).toBe('E_RUNTIME_EXCEPTION')
    expect(errorJson.name).toBe('InternalServerException')
    expect(errorJson.status).toBe(500)
    expect(errorJson.content).toBe('Internal Server Error')
  })

  it('should be able to pretiffy the exception', async () => {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error.', status = 500) {
        super(content, status, 'E_RUNTIME_EXCEPTION', 'Restart your computer, works always. 👍')
      }
    }

    const exception = new InternalServerException()

    const prettyError = await exception.prettify()

    expect(prettyError).toBeTruthy()
    expect(typeof prettyError).toBe('string')
  })
})

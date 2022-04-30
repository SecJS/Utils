/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exception } from '#src/index'

test.group('ExceptionTest', () => {
  test('should be able to create a new exception', async ({ assert }) => {
    const exception = new Exception('My custom instance error', 500)

    const errorJson = exception.toJSON()

    assert.equal(errorJson.status, 500)
    assert.equal(errorJson.code, 'EXCEPTION')
    assert.equal(errorJson.name, 'Exception')
    assert.equal(errorJson.content, 'My custom instance error')
  })

  test('should be able to extend exception class to create a new exception', async ({ assert }) => {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error', status = 500) {
        super(content, status, 'E_RUNTIME_EXCEPTION', 'Restart computer.')
      }
    }

    const exception = new InternalServerException()

    const errorJson = exception.toJSON(false)

    assert.isUndefined(errorJson.stack)
    assert.equal(errorJson.status, 500)
    assert.equal(errorJson.code, 'E_RUNTIME_EXCEPTION')
    assert.equal(errorJson.name, 'InternalServerException')
    assert.equal(errorJson.content, 'Internal Server Error')
  })

  test('should be able to pretiffy the exception', async ({ assert }) => {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error.', status = 500) {
        super(content, status, 'E_RUNTIME_EXCEPTION', 'Restart your computer, works always. 👍')
      }
    }

    const exception = new InternalServerException()

    const prettyError = await exception.prettify()

    assert.isDefined(prettyError)
    assert.typeOf(prettyError, 'string')
  })
})

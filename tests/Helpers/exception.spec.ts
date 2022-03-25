/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../../src/Helpers/Exception'

describe('\n Exception Class', () => {
  it('should be able to create a new exception', () => {
    const exception = new Exception('My custom instance error', 500)

    try {
      throw exception
    } catch (error) {
      const errorJson = error.toJSON()

      expect(errorJson.code).toBe('EXCEPTION')
      expect(errorJson.name).toBe('Exception')
      expect(errorJson.status).toBe(500)
      expect(errorJson.content).toBe('My custom instance error')
    }
  })

  it('should be able to extend exception class to create a new exception', () => {
    class InternalServerException extends Exception {
      constructor(content = 'Internal Server Error', status = 500) {
        super(content, status)
      }
    }

    try {
      throw new InternalServerException()
    } catch (error) {
      const errorJson = error.toJSON()

      expect(errorJson.code).toBe('INTERNAL_SERVER_EXCEPTION')
      expect(errorJson.name).toBe('InternalServerException')
      expect(errorJson.status).toBe(500)
      expect(errorJson.content).toBe('Internal Server Error')
    }
  })
})

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Clean } from '#src/index'

test.group('CleanTest', () => {
  test('should clean all falsy/empty values from array', ({ assert }) => {
    const array = [1, null, 2, undefined, 3, { joao: 'joao', lenon: null }, '', {}]

    Clean.cleanArray(array)
    assert.deepEqual(array, [1, 2, 3, { joao: 'joao', lenon: null }, {}])

    Clean.cleanArray(array, true, true)
    assert.deepEqual(array, [1, 2, 3, { joao: 'joao' }])
  })

  test('should clean all falsy/empty values from object', ({ assert }) => {
    const object = {
      a: 'a',
      b: 'b',
      c: 'c',
      d: {},
      e: [],
      f: { joao: 'joao' },
      g: null,
      h: undefined,
      i: [null, 1, { joao: 'joao', lenon: null }, {}],
    }

    Clean.cleanObject(object)

    assert.deepEqual(object, {
      a: 'a',
      b: 'b',
      c: 'c',
      d: {},
      e: [],
      f: { joao: 'joao' },
      i: [null, 1, { joao: 'joao', lenon: null }, {}],
    })

    Clean.cleanObject(object, true, true)

    assert.deepEqual(object, {
      a: 'a',
      b: 'b',
      c: 'c',
      f: { joao: 'joao' },
      i: [1, { joao: 'joao' }],
    })
  })
})

/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Clean } from '#src/Clean'

describe('\n CleanTest', () => {
  it('should clean all falsy/empty values from array', () => {
    const array = [1, null, 2, undefined, 3, { joao: 'joao', lenon: null }, '', {}]

    Clean.cleanArray(array)
    expect(array).toStrictEqual([1, 2, 3, { joao: 'joao', lenon: null }, {}])

    Clean.cleanArray(array, true, true)
    expect(array).toStrictEqual([1, 2, 3, { joao: 'joao' }])
  })

  it('should clean all falsy/empty values from object', () => {
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

    expect(object).toStrictEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      d: {},
      e: [],
      f: { joao: 'joao' },
      i: [null, 1, { joao: 'joao', lenon: null }, {}],
    })

    Clean.cleanObject(object, true, true)

    expect(object).toStrictEqual({
      a: 'a',
      b: 'b',
      c: 'c',
      f: { joao: 'joao' },
      i: [1, { joao: 'joao' }],
    })
  })
})

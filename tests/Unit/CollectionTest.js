/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Collection } from '#src/index'

test.group('CollectionTest', () => {
  test('should be able to remove duplicated values from collection', async ({ assert }) => {
    const collection = new Collection([1, 1, 2, 2, 3, 3, 4, 4, 5, 5])

    assert.deepEqual(collection.removeDuplicated(), [1, 2, 3, 4, 5])
  })

  test('should be able to extend collections by static macro method', async ({ assert }) => {
    Collection.macro('test', () => ({ hello: 'world' }))

    assert.deepEqual(new Collection().test(), { hello: 'world' })
  })

  test('should be able to execute the toResource method inside objects of collections', async ({ assert }) => {
    const models = [
      {
        toResource: () => ({ id: 1 }),
      },
      { toResource: criterias => criterias },
    ]

    assert.deepEqual(models.toResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
    assert.deepEqual(models.toCollection().toResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
    assert.deepEqual(new Collection(models).toResource({ id: 2 }), [{ id: 1 }, { id: 2 }])
  })
})

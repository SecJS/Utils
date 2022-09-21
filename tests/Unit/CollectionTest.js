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
})

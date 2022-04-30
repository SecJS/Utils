/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Debug } from '#src/index'

test.group('DebugTest', () => {
  test('should be able to create debug logs in any namespace', () => {
    Debug.log('Hello debug API!')
    Debug.log({ hello: 'world' }, 'api:testing')
  })
})

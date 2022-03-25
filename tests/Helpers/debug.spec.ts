/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Debug } from '../../src/Helpers/Debug'

describe('\n Debug Class', () => {
  it('should create debug messages according to namespace and context', () => {
    new Debug().log('Hello World!')
    new Debug().log({ hello: 'world' })
  })
})

/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '#src/Config'

export default {
  value: Config.get('recursiveTwo.value'),
}

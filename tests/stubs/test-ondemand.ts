/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Config } from '../../src/Classes/Config'

export default {
  hello: Config.get('sub-test.sub'),
}

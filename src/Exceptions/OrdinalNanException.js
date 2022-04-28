/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class OrdinalNanException extends Exception {
  /**
   * Creates a new instance of OrdinalNanException.
   *
   * @return {OrdinalNanException}
   */
  constructor() {
    const content = 'Cannot ordinal NaN or infinite numbers.'

    super(
      content,
      500,
      'E_ORDINAL_NAN',
      'Use a valid number instead of NaN or infinite.',
    )
  }
}

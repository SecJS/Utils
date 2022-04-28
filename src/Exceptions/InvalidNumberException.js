/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class InvalidNumberException extends Exception {
  /**
   * Creates a new instance of InvalidNumberException.
   *
   * @param {string} number
   * @return {InvalidNumberException}
   */
  constructor(number) {
    const content = `The number ${number} is not a valid string number.`

    super(
      content,
      500,
      'E_INVALID_NUMBER',
      'Use a valid string number instead.',
    )
  }
}

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class InvalidStringNumberException extends Exception {
  public constructor(stringNumber: string) {
    const content = `Your string ${stringNumber} is invalid`

    super(
      content,
      500,
      'INVALID_STRING_ERROR',
      `Your string ${stringNumber} should have at least one number`,
    )
  }
}

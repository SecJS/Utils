/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class NotValidUuidException extends Exception {
  public constructor(token: string) {
    const content = `Token ${token} is not a valid uuid`

    super(
      content,
      500,
      'INVALID_UUID_ERROR',
      `Try using a valid uuid token or recreating your token with Token.generate method`,
    )
  }
}

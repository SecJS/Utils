/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '../Helpers/Exception'

export class DifferentRoutesException extends Exception {
  public constructor(routeWithParams: string, routeWithValues: string) {
    const content = `Route ${routeWithParams} is different from ${routeWithValues} because they dont have the same length`

    super(content, 500, 'DIFFERENT_ROUTE_ERROR', `Try recreating your route`)
  }
}

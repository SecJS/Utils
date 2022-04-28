/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '#src/Helpers/Exception'

export class RouteMatchException extends Exception {
  /**
   * Creates a new instance of RouteMatchException.
   *
   * @param {string} routeWithParams
   * @param {string} routeWithValues
   * @return {RouteMatchException}
   */
  constructor(routeWithParams, routeWithValues) {
    const content = `The route ${routeWithParams} does not match ${routeWithValues}`

    super(
      content,
      500,
      'E_ROUTE_MATCH',
      'Please open an issue in https://github.com/SecJS/Utils.git',
    )
  }
}

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class Options {
  /**
   * Creates an option object with default values.
   *
   * @param {any} object
   * @param {any} defaultValues
   * @return {any}
   */
  static create(object, defaultValues) {
    return Object.assign({}, defaultValues, object)
  }
}

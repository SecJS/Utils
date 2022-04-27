/**
 * @secjs/esm
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
   * @param {Object} object
   * @param {Object} defaultValues
   * @return {Object}
   */
  static create(object, defaultValues) {
    return Object.assign({}, defaultValues, object)
  }
}

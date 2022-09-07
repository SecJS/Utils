/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '#src/Helpers/Is'

export class Clean {
  /**
   * Remove all falsy values from array.
   *
   * @param {any[]} array
   * @param {boolean} [removeEmpty]
   * @param {boolean} [cleanInsideObjects]
   * @return {any[]}
   */
  static cleanArray(array, removeEmpty = false, cleanInsideObjects = false) {
    return array.filter((item, i) => {
      let returnItem = !!item

      if (removeEmpty && Is.Empty(item)) {
        returnItem = false
      }

      if (
        typeof item === 'object' &&
        !Is.Array(item) &&
        cleanInsideObjects &&
        returnItem
      ) {
        this.cleanObject(item, removeEmpty)
      }

      if (!returnItem) {
        array.splice(i, 1)
      }

      return returnItem
    })
  }

  /**
   * Remove all falsy values from object.
   *
   * @param {any} object
   * @param {boolean} [removeEmpty]
   * @param {boolean} [cleanInsideArrays]
   * @return {any}
   */
  static cleanObject(object, removeEmpty = false, cleanInsideArrays = false) {
    Object.keys(object).forEach(prop => {
      if (removeEmpty && Is.Empty(object[prop])) {
        delete object[prop]

        return
      }

      if (Is.Array(object[prop]) && cleanInsideArrays) {
        this.cleanArray(object[prop], removeEmpty, true)
      }

      if (!object[prop]) {
        delete object[prop]
      }
    })
  }
}

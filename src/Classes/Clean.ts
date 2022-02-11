/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from './Is'

export class Clean {
  /**
   * Clean falsy values from array
   *
   * @param array The array with falsy values
   * @param removeEmpty Remove all empty objects/arrays from array
   * @return The array filtered without any falsy value
   */
  static cleanArray(
    array: any[],
    removeEmpty = false,
    cleanInsideObjects = false,
  ): any[] {
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
   * Clean falsy values from object
   *
   * @param object The object with falsy values
   * @param removeEmpty Remove all empty objects/arrays from object
   * @return The object filtered without any falsy value
   */
  static cleanObject(
    object: any,
    removeEmpty = false,
    cleanInsideArrays = false,
  ): any {
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

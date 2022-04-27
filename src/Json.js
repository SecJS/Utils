/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import lodash from 'lodash'

export class Json {
  /**
   * Deep copy any object properties without reference.
   *
   * @param {any} object
   * @return {any}
   */
  static copy(object) {
    return lodash.cloneDeep(object)
  }

  /**
   * Find all JSON inside string and return it.
   *
   * @param {string} text
   * @return {string[]}
   */
  static getJson(text) {
    let match
    const json = []

    while ((match = /{(?:[^{}])*}/.exec(text)) !== null) {
      text = text.replace(match[0], '')

      json.push(match[0])
    }

    return json
  }

  /**
   * Reviver callback.
   *
   * @callback reviver
   * @param {any} this
   * @param {string} key
   * @param {any} value
   * @return any
   */

  /**
   * Converts a JSON string into an object without exception.
   *
   * @param {string} text
   * @param {reviver?} reviver
   * @return {Object}
   */
  static parse(text, reviver) {
    try {
      return JSON.parse(text, reviver)
    } catch (error) {
      return null
    }
  }

  /**
   * Observe changes inside objects.
   *
   * @param {Object} object
   * @param {function} func
   * @param {...any[]} args
   * @return {Object}
   */
  static observeChanges(object, func, ...args) {
    return new Proxy(object, {
      set: (target, key, value) => {
        func(value, ...args)

        target[key] = value

        return true
      },
    })
  }

  /**
   * Remove all keys from data that is not inside array keys
   *
   * @param {Object} data
   * @param {any[]} keys
   * @return {any[]}
   */
  static fillable(data, keys) {
    return keys.reduce((previous, key) => {
      if (data[key]) {
        previous[key] = data[key]
      }

      return previous
    }, {})
  }

  /**
   * Remove all duplicated values from the array
   *
   * @param {any[]} array
   * @return {any[]}
   */
  static removeDuplicated(array) {
    return [...new Set(array)]
  }

  /**
   * Sort an index value from the array
   *
   * @param {any[]} array
   * @return {number}
   */
  static sort(array) {
    const index = Math.random() * array.length

    return array[Math.floor(index)]
  }

  /**
   * Get the object properties based on key.
   *
   * @param {string} key
   * @param {any?} defaultValue
   * @param {Object} object
   * @return {any|undefined}
   */
  static get(object, key, defaultValue) {
    if (defaultValue) {
      return lodash.get(object, key, defaultValue)
    }

    return lodash.get(object, key)
  }
}

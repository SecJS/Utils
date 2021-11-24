export class Json {
  /**
   * Verify if array is and array of objects
   *
   * @param array The array to be validated
   * @return true or false
   */
  static isArrayOfObjects(array: any[]): boolean {
    if (!array.length) return false

    const results = array.map(object => typeof object === 'object')

    return !results.includes(false)
  }

  /**
   * Deep copy any object properties without reference
   *
   * @param object The object to be copied
   * @return A copy from object without any reference
   */
  static copy<T>(object: T): T {
    const copy: any = {}

    for (const i in object) {
      const item = object[i]
      copy[i] =
        item != null && typeof item === 'object' ? this.copy(item) : item
    }

    return copy
  }

  /**
   * Find all JSON's inside string and return it.
   * @param text A valid string with one or more JSON's inside.
   * @returns An array of JSON's found in the string.
   */
  static getJson(text: string): string[] {
    let match: RegExpExecArray
    const matchs = []

    while ((match = /{(?:[^{}])*}/.exec(text)) !== null) {
      text = text.replace(match[0], '')

      matchs.push(match[0])
    }

    return matchs
  }

  /**
   * Converts a JavaScript Object Notation (JSON) string into an object without exception.
   * @param text A valid JSON string.
   * @param reviver A function that transforms the results. This function is called for each member of the object.
   * If a member contains nested objects, the nested objects are transformed before the parent object is.
   */
  static parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any {
    try {
      return JSON.parse(text, reviver)
    } catch (error) {
      return null
    }
  }

  /**
   * Observe changes inside objects
   *
   * @param object - The object to be observed
   * @param func - The function that will execute all the time the object has been modified
   * @param args - The arguments of the function
   * @return proxy - A Proxy instance
   */
  static observeChanges(object: any, func: any, ...args: any[]): any {
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
   * @param data The data with keys to remove
   * @param keys Array of keys that needs to stay in data
   * @return data only with keys
   */
  static fillable(data: any, keys: string[]): any {
    return keys.reduce((previous: any, key: string) => {
      if (data[key]) {
        previous[key] = data[key]
      }

      return previous
    }, {})
  }

  /**
   * Remove all duplicated values from the array
   *
   * @param array - The array to be verified
   * @return array - The array without duplicated values
   */
  static removeDuplicated(array: any[]): any[] {
    return [...new Set(array)]
  }

  /**
   * Sort an index value from the array
   *
   * @param array - The array with n index
   * @return any - A random value from the array
   */
  static sort(array: any): any {
    const index = Math.random() * array.length

    return array[Math.floor(index)]
  }
}

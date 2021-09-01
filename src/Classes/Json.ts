export class Json {
  /**
   * Verify if array is and array of objects
   *
   * @param array The array to be validated
   * @return true or false
   */
  isArrayOfObjects(array: any[]): boolean {
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
  copy<T>(object: T): T {
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
  getJson(text: string): string[] {
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
  parse(
    text: string,
    reviver?: (this: any, key: string, value: any) => any,
  ): any {
    try {
      return JSON.parse(text, reviver)
    } catch (error) {
      return null
    }
  }
}

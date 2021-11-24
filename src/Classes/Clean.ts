export class Clean {
  static isEmpty(data: any | any[] | string): boolean {
    if (!data) {
      return true
    }

    if (data instanceof Object && !Array.isArray(data)) {
      return !Object.keys(data).length
    }

    if (Array.isArray(data)) {
      return !data.length
    }

    if (typeof data === 'string') {
      return !data
    }

    return false
  }

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

      if (removeEmpty && this.isEmpty(item)) {
        returnItem = false
      }

      if (
        typeof item === 'object' &&
        !Array.isArray(item) &&
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
      if (removeEmpty && this.isEmpty(object[prop])) {
        delete object[prop]

        return
      }

      if (Array.isArray(object[prop]) && cleanInsideArrays) {
        this.cleanArray(object[prop], removeEmpty, true)
      }

      if (!object[prop]) {
        delete object[prop]
      }
    })
  }
}

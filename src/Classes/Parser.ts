import { InternalServerException } from '@secjs/exceptions'

export class Parser {
  /**
   * Parse a string to array
   *
   * @param string The string to parse
   * @param separator The separator to use
   * @return The array of string
   */
  stringToArray(string: string, separator: string): string[] {
    return string.split(separator).map(index => index.trim())
  }

  /**
   * Parse a string to number or Cordinate
   *
   * @param string The string to parse
   * @param isCoordinate If string is a coordinate
   * @return The string parsed to int or float
   */
  stringToNumber(string: string, isCoordinate = false): number {
    if (!string.replace(/\D/g, '')) {
      throw new InternalServerException(
        'Your string is invalid, it should have at least one number.',
      )
    }

    string = string.replace(/\D/g, '')

    if (string.length >= 9 || isCoordinate) {
      return parseFloat(string)
    }

    return parseInt(string)
  }

  /**
   * Parse an object to form data
   *
   * @param object The object to parse
   * @return The object parsed to form data
   */
  jsonToFormData(object: any): string {
    return Object.keys(object)
      .reduce((previous, current) => {
        return previous + `&${current}=${encodeURIComponent(object[current])}`
      }, '')
      .substring(1)
  }

  /**
   * Parse form data to json
   *
   * @param formData The form data to parse
   * @return The form data parsed to object
   */
  formDataToJson(formData: string): any {
    const object = {}

    if (formData.startsWith('?')) formData = formData.replace('?', '')

    formData.split('&').forEach(queries => {
      const query = queries.split('=')

      object[decodeURIComponent(query[0])] = decodeURIComponent(query[1])
    })

    return object
  }
}

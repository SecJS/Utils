import { InternalServerException } from '@secjs/exceptions'

export class Parser {
  /**
   * Parse a string to array
   *
   * @param string The string to parse
   * @param separator The separator to use
   * @return The array of string
   */
  static stringToArray(string: string, separator: string): string[] {
    return string.split(separator).map(index => index.trim())
  }

  /**
   * Parse a string to number or Cordinate
   *
   * @param string The string to parse
   * @param isCoordinate If string is a coordinate
   * @return The string parsed to int or float
   */
  static stringToNumber(string: string, isCoordinate = false): number {
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
  static jsonToFormData(object: any): string {
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
  static formDataToJson(formData: string): any {
    const object = {}

    if (formData.startsWith('?')) formData = formData.replace('?', '')

    formData.split('&').forEach(queries => {
      const query = queries.split('=')

      object[decodeURIComponent(query[0])] = decodeURIComponent(query[1])
    })

    return object
  }

  /**
   * bytesToSize creates a string based on the bytes size
   *
   * @param bytes - The number of bytes
   * @param decimals - The number of decimals to be showed
   * @return formattedSize - Return the formatted value based on the size (100 MB, 1 GB, etc)
   */
  static bytesToSize(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  /**
   * linkToHref parses all links inside the string to HTML link with <a href= .../>
   *
   * @param string - The string with links inside
   * @return formattedString - Return the formatted string
   */
  static linkToHref(string: any): string {
    const regex = /(https?:\/\/[^\s]+)/g

    return string.replace(regex, '<a href="$1">$1</a>')
  }
}

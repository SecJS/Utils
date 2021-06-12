import { Parser } from './Parser'

export class Numbers {
  /**
   * Get the higher number from an array of numbers
   *
   * @param numbers The array of numbers
   * @return The higher number from the array
   */
  getHigher(numbers: number[]): number {
    // eslint-disable-next-line prefer-spread
    return Math.max.apply(Math, numbers)
  }

  /**
   * Get the lower number from an array of numbers
   *
   * @param numbers The array of numbers
   * @return The lower number from the array
   */
  getLower(numbers: number[]): number {
    // eslint-disable-next-line prefer-spread
    return Math.min.apply(Math, numbers)
  }

  /**
   * Extract all numbers inside of a string
   *
   * @param string The string with numbers inside
   * @return One number only
   */
  extractNumber(string: string): number {
    return new Parser().stringToNumber(string.replace(/\D/g, ''))
  }

  /**
   * Extract all numbers inside of a string
   *
   * @param string The string with numbers inside
   * @return An array of numbers
   */
  extractNumbers(string: string): number[] {
    return string.match(/[0-9]+/g).map(numberString => {
      return new Parser().stringToNumber(numberString)
    })
  }

  /**
   * The average of all number arguments
   *
   * @param args The array of numbers from all function arguments
   * @return The average of all numbers
   */
  argsAverage(...args: number[]): number {
    return args.reduce((acc: any, curr: any) => acc + curr, 0) / args.length
  }

  /**
   * The average of all numbers in array
   *
   * @param array The array of numbers
   * @return The average of all numbers
   */
  arrayAverage(array: number[]): number {
    return array.reduce((acc, curr) => acc + curr, 0) / array.length
  }
}

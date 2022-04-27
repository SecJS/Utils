/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '#src/Parser'

export class Number {
  /**
   * Get the higher number from an array of numbers.
   *
   * @param {number[]} numbers
   * @return {number}
   */
  static getHigher(numbers) {
    return Math.max.apply(Math, numbers)
  }

  /**
   * Get the lower number from an array of numbers.
   *
   * @param {number[]} numbers
   * @return {number}
   */
  static getLower(numbers) {
    return Math.min.apply(Math, numbers)
  }

  /**
   * Extract the first number inside a string.
   *
   * @param {string} string
   * @return {number}
   */
  static extractNumber(string) {
    return Parser.stringToNumber(string.replace(/\D/g, ''))
  }

  /**
   * Extract all numbers inside a string.
   *
   * @param {string} string
   * @return {number[]}
   */
  static extractNumbers(string) {
    return string.match(/\d+/g).map(numberString => {
      return Parser.stringToNumber(numberString)
    })
  }

  /**
   * The average of all numbers in function arguments.
   *
   * @param {number[]} args
   * @return {number}
   */
  static argsAverage(...args) {
    return Number.arrayAverage(args)
  }

  /**
   * The average of all numbers in the array.
   *
   * @param {number[]} array
   * @return {number}
   */
  static arrayAverage(array) {
    return array.reduce((acc, curr) => acc + curr, 0) / array.length
  }

  /**
   * Generate a random integer from a determined interval of numbers.
   *
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  static randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}

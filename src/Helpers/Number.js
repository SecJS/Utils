/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '#src/Helpers/Parser'

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
   * Get km radius between two coordinates.
   *
   * @param {{ latitude: number, longitude: number }} centerCord
   * @param {{ latitude: number, longitude: number }} pointCord
   * @return {number}
   */
  static getKmRadius(centerCord, pointCord) {
    const deg2rad = deg => deg * (Math.PI / 180)

    const radius = 6371

    const { latitude: latitude1, longitude: longitude1 } = centerCord
    const { latitude: latitude2, longitude: longitude2 } = pointCord

    const dLat = deg2rad(latitude2 - latitude1)
    const dLon = deg2rad(longitude2 - longitude1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(latitude1)) *
        Math.cos(deg2rad(latitude2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)

    const center = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return radius * center
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
   * Extract all numbers inside a string and
   * return as a unique number.
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

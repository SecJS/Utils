/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Parser } from '#src/Helpers/Parser'
import { RouteMatchException } from '#src/Exceptions/RouteMatchException'

export class Route {
  /**
   * Get the query string in form data format.
   *
   * @param {string} route
   * @return {string}
   */
  static getQueryString(route) {
    const queryIndex = route.search(/\?(.*)/)

    if (queryIndex === -1) return null

    return route.substring(queryIndex)
  }

  /**
   * Remove query params from the route.
   *
   * @param {string} route
   * @return {string}
   */
  static removeQueryParams(route) {
    const queryString = this.getQueryString(route)

    if (!queryString) return route

    return route.replace(queryString, '')
  }

  /**
   * Get object with ?&queryParams values from route.
   *
   * @param {string} route
   * @return {any}
   */
  static getQueryParamsValue(route) {
    const queryString = this.getQueryString(route)

    if (!queryString) return {}

    return Parser.formDataToJson(queryString)
  }

  /**
   * Get array with ?&queryParams name from route.
   *
   * @param {string} route
   * @return {string[]}
   */
  static getQueryParamsName(route) {
    const queryNames = []
    let queryString = this.getQueryString(route)

    if (!queryString) return []

    queryString = queryString.replace('?', '')

    queryString
      .split('&')
      .forEach(queries =>
        queryNames.push(decodeURIComponent(queries.split('=')[0])),
      )

    return queryNames
  }

  /**
   * Get object with :params values from route.
   *
   * @param {string} routeWithParams
   * @param {string} routeWithValues
   * @return {any}
   */
  static getParamsValue(routeWithParams, routeWithValues) {
    routeWithParams = this.removeQueryParams(routeWithParams)
    routeWithValues = this.removeQueryParams(routeWithValues)

    const params = {}

    const routeWithParamsArray = routeWithParams.split('/')
    const routeWithValuesArray = routeWithValues.split('/')

    if (routeWithParamsArray.length !== routeWithValuesArray.length) {
      throw new RouteMatchException(routeWithParams, routeWithValues)
    }

    routeWithParamsArray.forEach((param, i) => {
      if (!param.startsWith(':')) return

      params[decodeURIComponent(param.replace(':', ''))] = decodeURIComponent(
        routeWithValuesArray[i],
      )
    })

    return params
  }

  /**
   * Get array with :params name from route.
   *
   * @param {string} route
   * @return {string[]}
   */
  static getParamsName(route) {
    route = this.removeQueryParams(route)

    const replaceDots = value => decodeURIComponent(value.replace(':', ''))

    return route.split('/').reduce((results, r) => {
      if (r.match(':')) {
        results.push(replaceDots(r))
      }

      return results
    }, [])
  }

  /**
   * Create a matcher RegExp for any route.
   *
   * @param {string} route
   * @return {RegExp}
   */
  static createMatcher(route) {
    route = this.removeQueryParams(route)

    const routeArray = route.split('/')

    routeArray.forEach((r, i) => {
      if (r === '') return
      if (r.startsWith(':')) {
        // Match with any word and - value RegExp
        routeArray[i] = `(?:\\/[\\w-]+)`

        return
      }

      // Match only with value of ${r} RegExp
      routeArray[i] = `(?:\\/${r}\\b)`
    })

    route = routeArray.join('')

    if (!route) route = '[/]'

    return new RegExp(`^${route}$`)
  }
}

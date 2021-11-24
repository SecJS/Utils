import { Parser } from './Parser'
import { InternalServerException } from '@secjs/exceptions'

export class Route {
  /**
   * Get the query string in form data format
   *
   * @param route The route to get the query string
   * @return The string with query string
   */
  static getQueryString(route: string): string {
    const queryIndex = route.search(/\?(.*)/)

    if (queryIndex === -1) return null

    return route.substring(queryIndex)
  }

  /**
   * Remove query params from the route
   *
   * @param route The route to remove the queryParams
   * @return The route without the query params
   */
  static removeQueryParams(route: string): string {
    const queryString = this.getQueryString(route)

    if (!queryString) return route

    return route.replace(queryString, '')
  }

  /**
   * Get object with ?&queryParams values from route
   *
   * @param route The route to get the queryParams
   * @return The object of queryParams found inside route
   */
  static getQueryParamsValue(route: string): any {
    const queryString = this.getQueryString(route)

    if (!queryString) return {}

    return Parser.formDataToJson(queryString)
  }

  /**
   * Get array with ?&queryParams name from route
   *
   * @param route The route to get the queryParams
   * @return The array name of queryParams found inside route
   */
  static getQueryParamsName(route: string): string[] {
    const queryNames = []
    let queryString = this.getQueryString(route)

    if (!queryString) return []

    if (queryString.startsWith('?')) queryString = queryString.replace('?', '')

    queryString
      .split('&')
      .forEach(queries =>
        queryNames.push(decodeURIComponent(queries.split('=')[0])),
      )

    return queryNames
  }

  /**
   * Get object with :params values from route
   *
   * @param routeWithParams The route with the :params
   * @param routeWithValues The route with the :params values
   * @return The object of params found inside route
   */
  static getParamsValue(routeWithParams: string, routeWithValues: string): any {
    routeWithParams = this.removeQueryParams(routeWithParams)
    routeWithValues = this.removeQueryParams(routeWithValues)

    const params = {}

    const routeWithParamsArray = routeWithParams.split('/')
    const routeWithValuesArray = routeWithValues.split('/')

    if (routeWithParamsArray.length !== routeWithValuesArray.length) {
      throw new InternalServerException('Routes are not the same.')
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
   * Get array with :params name from route
   *
   * @param route The route to get the params
   * @return The array name of params found inside route
   */
  static getParamsName(route: string): string[] {
    route = this.removeQueryParams(route)

    const replaceDots = (value: string): string =>
      decodeURIComponent(value.replace(':', ''))

    return route.split('/').reduce((results, r) => {
      if (r.match(':')) {
        results.push(
          r.includes('|') ? replaceDots(r.split('|')[0]) : replaceDots(r),
        )
      }

      return results
    }, [])
  }

  /**
   * Create a matcher RegExp for any route
   *
   * @param route The route to create the matcher
   * @return The matcher RegExp based on route
   */
  static createMatcher(route: string): RegExp {
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

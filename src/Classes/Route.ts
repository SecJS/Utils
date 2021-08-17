import { Parser } from './Parser'

export class Route {
  /**
   * Get the query string in form data format
   *
   * @param route The route to get the query string
   * @return The string with query string
   */
  getQueryString(route: string): string {
    const queryIndex = route.search(/\?(.*)/)

    if (queryIndex === -1) return route

    return route.substring(queryIndex)
  }

  /**
   * Remove query params from the route
   *
   * @param route The route to remove the queryParams
   * @return The route without the query params
   */
  removeQueryParams(route: string): string {
    if (this.getQueryString(route) === route) return route

    return route.replace(this.getQueryString(route), '')
  }

  /**
   * Get object with ?&queryParams values from route
   *
   * @param route The route to get the queryParams
   * @return The object of queryParams found inside route
   */
  getQueryParamsValue(route: string): any {
    return new Parser().formDataToJson(this.getQueryString(route))
  }

  /**
   * Get array with ?&queryParams name from route
   *
   * @param route The route to get the queryParams
   * @return The array name of queryParams found inside route
   */
  getQueryParamsName(route: string): string[] {
    const queryNames = []
    let queryString = this.getQueryString(route)

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
   * @param route The route to get the params
   * @return The object of params found inside route
   */
  getParamsValue(routeWithParams: string, routeWithValues: string): any {
    routeWithParams = this.removeQueryParams(routeWithParams)
    routeWithValues = this.removeQueryParams(routeWithValues)

    const params = {}

    const routeWithParamsArray = routeWithParams.split('/')
    const routeWithValuesArray = routeWithValues.split('/')

    if (routeWithParamsArray.length !== routeWithValuesArray.length) {
      throw new Error('DIFFERENT_ROUTES')
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
  getParamsName(route: string): string[] {
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
  createMatcher(route: string): RegExp {
    route = this.removeQueryParams(route)

    const routeArray = route.split('/')

    routeArray.forEach((r, i) => {
      if (r === '') return
      if (r.startsWith(':')) {
        // Match with any value RegExp
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

import { Token } from './../../src/Classes/Token'
import { Route } from '../../src/Classes/Route'

describe('\n Route Class', () => {
  let route: Route

  beforeAll(() => {
    route = new Route()
  })

  it('should get query params in string format from the route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(route.getQueryString(path)).toStrictEqual(
      '?page=1&limit=10&created_at=1995-12-17T03:24:00',
    )
  })

  it('should remove all query params from the route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(route.removeQueryParams(path)).toStrictEqual('/users/1/posts')
    expect(
      route.removeQueryParams(route.removeQueryParams(path)),
    ).toStrictEqual('/users/1/posts')
  })

  it('should get query params value from any route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(route.getQueryParamsValue(path)).toStrictEqual({
      page: '1',
      limit: '10',
      created_at: '1995-12-17T03:24:00',
    })
  })

  it('should get query params names from any route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(route.getQueryParamsName(path)).toStrictEqual([
      'page',
      'limit',
      'created_at',
    ])
  })

  it('should get params value from any route', () => {
    const pathWithParams = '/users/:id/posts/:post_id?page=1&limit=10'
    const pathWithValues = '/users/1/posts/2?page=1&limit=10'

    expect(route.getParamsValue(pathWithParams, pathWithValues)).toStrictEqual({
      id: '1',
      post_id: '2',
    })
  })

  it('should get params names from any route', () => {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    expect(route.getParamsName(path)).toStrictEqual(['id', 'post_id'])
  })

  it('should create a matcher RegExp to recognize the route', () => {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    const pathTest1 = '/users/1/posts/test'
    const pathTest2 = '/users/1/posts/2/oi'
    const pathTest3 = `/users/${new Token().generate()}/posts/1`

    const matcher = route.createMatcher(path)

    expect(matcher).toStrictEqual(
      /^(?:\/users\b)(?:\/[\w-]+)(?:\/posts\b)(?:\/[\w-]+)$/,
    )
    expect(matcher.test(pathTest1)).toBe(true)
    expect(matcher.test(pathTest2)).toBe(false)
    expect(matcher.test(pathTest3)).toBe(true)
  })
})

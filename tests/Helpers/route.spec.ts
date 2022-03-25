import { Token } from '../../src/Helpers/Token'
import { Route } from '../../src/Helpers/Route'

describe('\n Route Class', () => {
  it('should get query params in string format from the route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(Route.getQueryString(path)).toStrictEqual(
      '?page=1&limit=10&created_at=1995-12-17T03:24:00',
    )
  })

  it('should remove all query params from the route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(Route.removeQueryParams(path)).toStrictEqual('/users/1/posts')
    expect(
      Route.removeQueryParams(Route.removeQueryParams(path)),
    ).toStrictEqual('/users/1/posts')
  })

  it('should get query params value from any route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(Route.getQueryParamsValue(path)).toStrictEqual({
      page: '1',
      limit: '10',
      created_at: '1995-12-17T03:24:00',
    })
  })

  it('should get query params names from any route', () => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    expect(Route.getQueryParamsName(path)).toStrictEqual([
      'page',
      'limit',
      'created_at',
    ])
  })

  it('should get params value from any route', () => {
    const pathWithParams = '/users/:id/posts/:post_id?page=1&limit=10'
    const pathWithValues = '/users/1/posts/2?page=1&limit=10'

    expect(Route.getParamsValue(pathWithParams, pathWithValues)).toStrictEqual({
      id: '1',
      post_id: '2',
    })
  })

  it('should get params names from any route', () => {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    expect(Route.getParamsName(path)).toStrictEqual(['id', 'post_id'])
  })

  it('should create a matcher RegExp to recognize the route', () => {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    const pathTest1 = '/users/1/posts/tests'
    const pathTest2 = '/users/1/posts/2/oi'
    const pathTest3 = `/users/${Token.generate()}/posts/1`

    const matcher = Route.createMatcher(path)

    expect(matcher).toStrictEqual(
      /^(?:\/users\b)(?:\/[\w-]+)(?:\/posts\b)(?:\/[\w-]+)$/,
    )
    expect(matcher.test(pathTest1)).toBe(true)
    expect(matcher.test(pathTest2)).toBe(false)
    expect(matcher.test(pathTest3)).toBe(true)

    const path2 = '/'

    const matcher2 = Route.createMatcher(path2)

    expect(matcher2).toStrictEqual(/^[/]$/)
    expect(matcher2.test(path2)).toBe(true)
    expect(matcher2.test(pathTest1)).toBe(false)
    expect(matcher2.test(pathTest2)).toBe(false)
    expect(matcher2.test(pathTest3)).toBe(false)
  })
})

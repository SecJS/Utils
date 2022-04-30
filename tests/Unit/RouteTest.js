/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Route, Uuid } from '#src/index'
import { RouteMatchException } from '#src/Exceptions/RouteMatchException'

test.group('RouteTest', () => {
  test('should get query params in string format from the route', async ({ assert }) => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.getQueryString(path), '?page=1&limit=10&created_at=1995-12-17T03:24:00')
  })

  test('should remove all query params from the route', async ({ assert }) => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.removeQueryParams(path), '/users/1/posts')
    assert.deepEqual(Route.removeQueryParams(Route.removeQueryParams(path)), '/users/1/posts')
  })

  test('should get query params value from any route', async ({ assert }) => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.getQueryParamsValue(path), {
      page: '1',
      limit: '10',
      created_at: '1995-12-17T03:24:00',
    })
  })

  test('should return an empty object/array when route doesnt have query params', async ({ assert }) => {
    const path = '/users/1/posts'

    assert.deepEqual(Route.getQueryParamsName(path), [])
    assert.deepEqual(Route.getQueryParamsValue(path), {})
  })

  test('should get query params names from any route', async ({ assert }) => {
    const path = '/users/1/posts?page=1&limit=10&created_at=1995-12-17T03:24:00'

    assert.deepEqual(Route.getQueryParamsName(path), ['page', 'limit', 'created_at'])
  })

  test('should get params value from any route', async ({ assert }) => {
    const pathWithParams = '/users/:id/posts/:post_id?page=1&limit=10'
    const pathWithValues = '/users/1/posts/2?page=1&limit=10'

    assert.deepEqual(Route.getParamsValue(pathWithParams, pathWithValues), {
      id: '1',
      post_id: '2',
    })
  })

  test('should throw an route match exception when routes are different', async ({ assert }) => {
    const pathWithParams = '/users/:id/posts/:post_id'
    const pathWithValues = '/users/1/posts/2/extra'

    const useCase = () => Route.getParamsValue(pathWithParams, pathWithValues)

    assert.throws(useCase, RouteMatchException)
  })

  test('should get params names from any route', async ({ assert }) => {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    assert.deepEqual(Route.getParamsName(path), ['id', 'post_id'])
  })

  test('should create a matcher RegExp to recognize the route', async ({ assert }) => {
    const path = '/users/:id/posts/:post_id?page=1&limit=10'

    const pathTest1 = '/users/1/posts/tests'
    const pathTest2 = '/users/1/posts/2/oi'
    const pathTest3 = `/users/${Uuid.generate()}/posts/1`

    const matcher = Route.createMatcher(path)

    assert.deepEqual(matcher, /^(?:\/users\b)(?:\/[\w-]+)(?:\/posts\b)(?:\/[\w-]+)$/)
    assert.isTrue(matcher.test(pathTest1))
    assert.isFalse(matcher.test(pathTest2))
    assert.isTrue(matcher.test(pathTest3))

    const path2 = '/'

    const matcher2 = Route.createMatcher(path2)

    assert.deepEqual(matcher2, /^[/]$/)
    assert.isTrue(matcher2.test(path2))
    assert.isFalse(matcher2.test(pathTest1))
    assert.isFalse(matcher2.test(pathTest2))
    assert.isFalse(matcher2.test(pathTest3))
  })
})

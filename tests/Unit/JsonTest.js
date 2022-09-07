/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exec, Json } from '#src/index'

test.group('Json Class', () => {
  test('should return a deep copy from the object', async ({ assert }) => {
    const object = {
      test: 'hello',
      hello: () => 'hy',
    }

    const objectCopy = Json.copy(object)

    objectCopy.test = 'hello from copy'
    objectCopy.hello = () => 'hy from copy'

    assert.equal(object.test, 'hello')
    assert.equal(object.hello(), 'hy')
    assert.equal(objectCopy.test, 'hello from copy')
    assert.equal(objectCopy.hello(), 'hy from copy')
  })

  test('should return all json found inside of the string', async ({ assert }) => {
    const text = 'this is a string with a json inside of it {"text":"hello"} and one more json {"hello":"world"}'

    assert.deepEqual(Json.getJson(text), ['{"text":"hello"}', '{"hello":"world"}'])
  })

  test('should return null if JSON parse goes wrong', async ({ assert }) => {
    const text = 'a string that is not a valid JSON'

    assert.isNull(Json.parse(text))
  })

  test('should return the object when string is a valid JSON', async ({ assert }) => {
    const text = '{"text":"hello"}'

    assert.deepEqual(Json.parse(text), { text: 'hello' })
  })

  test('should clean data object removing all keys that are not in key array', async ({ assert }) => {
    const data = {
      hello: 'hello',
      world: 'world',
    }

    assert.deepEqual(Json.fillable(data, ['world']), { world: 'world' })
    assert.deepEqual(Json.fillable(data, ['world', 'someNullWord']), { world: 'world' })
  })

  test('should be able to observe changes of an object', async ({ assert }) => {
    const object = {
      joao: 'lenon',
      hello: 'world',
    }

    const objectProxy = Json.observeChanges(
      object,
      (value, arg1, arg2, arg3) => {
        assert.equal(value, 'oi')
        assert.equal(arg1, 1)
        assert.equal(arg2, 2)
        assert.equal(arg3, 3)
      },
      1,
      2,
      3,
    )

    objectProxy.joao = 'oi'

    await Exec.sleep(2000)
  })

  test('should be able to remove duplicated values from array', async ({ assert }) => {
    const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

    assert.deepEqual(Json.removeDuplicated(array), [1, 2, 3, 4, 5])
  })

  test('should be able to raffle any value from the array', async ({ assert }) => {
    const array = [1, 2, 3, 4, 5]

    const raffledValue = Json.raffle(array)

    assert.isDefined(array.find(a => a === raffledValue))
  })

  test('should be able to get nested properties from object', async ({ assert }) => {
    const object = {
      hello: {
        world: {
          value: {
            hello: 'Hello World!',
          },
        },
      },
    }

    const value = Json.get(object, 'hello.world.value.hello')
    const undefinedValue = Json.get(object, 'hello.worlld.value.hello')
    const defaultValue = Json.get(object, 'hello.worlld.value.hello', 'Hi World!')
    const fullObject = Json.get(object, '*')
    const defaultValueInObjectNull = Json.get(undefined, '*', { hello: 'world' })

    assert.equal(value, 'Hello World!')
    assert.equal(defaultValue, 'Hi World!')
    assert.isUndefined(undefinedValue)
    assert.deepEqual(object, fullObject)
    assert.deepEqual(defaultValueInObjectNull, { hello: 'world' })
  })
})

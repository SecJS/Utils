/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Json } from '#src/Helpers/Json'
import { Exec } from '#src/Helpers/Exec'

describe('\n Json Class', () => {
  it('should return a deep copy from the object', async () => {
    const object = {
      test: 'hello',
      hello: () => 'hy',
    }

    const objectCopy = Json.copy(object)

    objectCopy.test = 'hello from copy'
    objectCopy.hello = () => 'hy from copy'

    expect(object.test).toBe('hello')
    expect(object.hello()).toBe('hy')
    expect(objectCopy.test).toBe('hello from copy')
    expect(objectCopy.hello()).toBe('hy from copy')
  })

  it('should return all json found inside of the string', () => {
    const text = 'this is a string with a json inside of it {"text":"hello"} and one more json {"hello":"world"}'

    expect(Json.getJson(text)).toStrictEqual(['{"text":"hello"}', '{"hello":"world"}'])
  })

  it('should return null if JSON parse goes wrong', () => {
    const text = 'a string that is not a valid JSON'

    expect(Json.parse(text)).toBe(null)
  })

  it('should return the object when string is a valid JSON', () => {
    const text = '{"text":"hello"}'

    expect(Json.parse(text)).toStrictEqual({ text: 'hello' })
  })

  it('should clean data object removing all keys that are not in key array', async () => {
    const data = {
      hello: 'hello',
      world: 'world',
    }

    expect(Json.fillable(data, ['world'])).toStrictEqual({ world: 'world' })
    expect(Json.fillable(data, ['world', 'someNullWord'])).toStrictEqual({
      world: 'world',
    })
  })

  it('should be able to observe changes of an object', async () => {
    const object = {
      joao: 'lenon',
      hello: 'world',
    }

    const objectProxy = Json.observeChanges(
      object,
      (value, arg1, arg2, arg3) => {
        expect(value).toBe('oi')
        expect(arg1).toBe(1)
        expect(arg2).toBe(2)
        expect(arg3).toBe(3)
      },
      1,
      2,
      3,
    )

    objectProxy.joao = 'oi'

    await Exec.sleep(2000)
  })

  it('should be able to remove duplicated values from array', async () => {
    const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

    const newArray = Json.removeDuplicated(array)

    expect(newArray).toStrictEqual([1, 2, 3, 4, 5])
  })

  it('should be able to sort any value from the array', async () => {
    const array = [1, 2, 3, 4, 5]

    const sortedValue = Json.sort(array)

    expect(array.find(a => a === sortedValue)).toBeTruthy()
  })

  it('should be able to get nested properties from object', async () => {
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

    expect(value).toBe('Hello World!')
    expect(defaultValue).toBe('Hi World!')
    expect(undefinedValue).toBe(undefined)
  })
})

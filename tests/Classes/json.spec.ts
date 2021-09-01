import { Json } from '../../src/Classes/Json'

describe('\n Json Class', () => {
  let json: Json

  beforeAll(() => {
    json = new Json()
  })

  it('should verify if the array is an array of objects', async () => {
    const data = [
      {
        hello: 'hello',
        world: 'world',
      },
    ]

    expect(json.isArrayOfObjects(data)).toBe(true)
    expect(json.isArrayOfObjects([])).toBe(false)
    expect(json.isArrayOfObjects([1, 2, 3])).toBe(false)
  })

  it('should return a deep copy from the object', async () => {
    const object = {
      test: 'hello',
      hello: () => 'hy',
    }

    const objectCopy = json.copy(object)

    objectCopy.test = 'hello from copy'
    objectCopy.hello = () => 'hy from copy'

    expect(object.test).toBe('hello')
    expect(object.hello()).toBe('hy')
    expect(objectCopy.test).toBe('hello from copy')
    expect(objectCopy.hello()).toBe('hy from copy')
  })

  it('should return all json found inside of the string', () => {
    const text =
      'this is a string with a json inside of it {"text":"hello"} and one more json {"hello":"world"}'

    expect(json.getJson(text)).toStrictEqual([
      '{"text":"hello"}',
      '{"hello":"world"}',
    ])
  })

  it('should return null if JSON parse goes wrong', () => {
    const text = 'a string that is not a valid JSON'

    expect(json.parse(text)).toBe(null)
  })

  it('should return the object when string is a valid JSON', () => {
    const text = '{"text":"hello"}'

    expect(json.parse(text)).toStrictEqual({ text: 'hello' })
  })
})

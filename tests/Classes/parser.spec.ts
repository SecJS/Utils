import { Parser } from '../../src/Classes/Parser'

describe('\n Parser Class', () => {
  let parser: Parser

  beforeAll(() => {
    parser = new Parser()
  })

  it('should parse string to number and string to array', () => {
    const parsedNumberInt = parser.stringToNumber('1')
    const parsedNumberFloat = parser.stringToNumber('100.000,000000')

    expect(parsedNumberInt).toStrictEqual(1)
    expect(parsedNumberFloat).toStrictEqual(100000000000)

    const parsedArray = parser.stringToArray('hello, peopleee', ',')

    expect(parsedArray).toStrictEqual(['hello', 'peopleee'])
  })

  it('should parse json to form data', () => {
    const json = {
      name: 'lenon',
      email: 'lenonSec7@gmail.com',
    }

    const formData = parser.jsonToFormData(json)

    expect(formData).toBe('name=lenon&email=lenonSec7%40gmail.com')
  })

  it('should parse form data to json', () => {
    const formData = 'name=lenon&email=lenonSec7%40gmail.com'

    const json = parser.formDataToJson(formData)

    expect(json).toStrictEqual({
      name: 'lenon',
      email: 'lenonSec7@gmail.com',
    })
  })
})

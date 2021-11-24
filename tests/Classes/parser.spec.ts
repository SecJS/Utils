import { Parser } from '../../src/Classes/Parser'

describe('\n Parser Class', () => {
  it('should parse string to number and string to array', () => {
    const parsedNumberInt = Parser.stringToNumber('1')
    const parsedNumberFloat = Parser.stringToNumber('100.000,000000')

    expect(parsedNumberInt).toStrictEqual(1)
    expect(parsedNumberFloat).toStrictEqual(100000000000)

    const parsedArray = Parser.stringToArray('hello, peopleee', ',')

    expect(parsedArray).toStrictEqual(['hello', 'peopleee'])
  })

  it('should parse json to form data', () => {
    const json = {
      name: 'lenon',
      email: 'lenonSec7@gmail.com',
    }

    const formData = Parser.jsonToFormData(json)

    expect(formData).toBe('name=lenon&email=lenonSec7%40gmail.com')
  })

  it('should parse form data to json', () => {
    const formData = 'name=lenon&email=lenonSec7%40gmail.com'

    const json = Parser.formDataToJson(formData)

    expect(json).toStrictEqual({
      name: 'lenon',
      email: 'lenonSec7@gmail.com',
    })
  })

  it('should be able to parse a link to urls with <a></a> from html inside strings', async () => {
    const string =
      'this is a string with one link - https://joao.com and other link https://joaolenon.com and https://lenon.com'

    expect(Parser.linkToHref(string)).toBeTruthy()
  })
})

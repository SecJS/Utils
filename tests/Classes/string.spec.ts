import { String } from '../../src/Classes/String'

describe('\n String Class', () => {
  it('should generate random strings by size', async () => {
    expect(String.generateRandom(10).length).toBe(10)
    expect(String.generateRandom(20).length).toBe(20)
  })

  it('should generate random colors in hexadecimal format', async () => {
    expect(String.generateRandomColor()[0]).toBe('#')
    expect(String.generateRandomColor()[0]).toBe('#')
    expect(String.generateRandomColor()[0]).toBe('#')
  })

  it('should normalize a base64 string value', async () => {
    expect(String.normalizeBase64('+++///===')).toBe('---___')
  })

  it('should change the case of the string', async () => {
    const string = 'Hello world' // Sentence case

    expect(String.toCamelCase(string)).toBe('helloWorld')
    expect(String.toPascalCase(string)).toBe('HelloWorld')
    expect(String.toSnakeCase(string)).toBe('hello_world')
    expect(String.toDotCase(string)).toBe('hello.world')
    expect(String.toSentenceCase(string)).toBe('Hello world')
    expect(String.toNoCase(string)).toBe('hello world')
    expect(String.toDashCase(string)).toBe('hello-world')
    expect(String.toDashCase(string, true)).toBe('Hello-World')
  })

  it('should transform the string to singular, plural and ordinal', async () => {
    const string = 'Hello world'

    expect(String.pluralize(string)).toBe('Hello worlds')
    expect(String.singularize(String.pluralize(string))).toBe('Hello world')

    expect(String.ordinalize('1')).toBe('1st')
    expect(String.ordinalize('2')).toBe('2nd')
    expect(String.ordinalize('3')).toBe('3rd')
    expect(String.ordinalize('0.1')).toBe('0.1th')
    expect(String.ordinalize('10')).toBe('10th')
    expect(String.ordinalize('100')).toBe('100th')
    expect(String.ordinalize('1000')).toBe('1000th')
  })
})

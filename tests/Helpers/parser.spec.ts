import { Parser } from '../../src/Helpers/Parser'

describe('\n Parser Class', () => {
  it('should parse string to number and string to array', () => {
    const parsedNumberInt = Parser.stringToNumber('1')
    const parsedNumberFloat = Parser.stringToNumber('100.000,000000')

    expect(parsedNumberInt).toStrictEqual(1)
    expect(parsedNumberFloat).toStrictEqual(100000000000)

    const parsedArray = Parser.stringToArray('hello, peopleee', ',')

    expect(parsedArray).toStrictEqual(['hello', 'peopleee'])
  })

  it('should parse array to string based on options', () => {
    expect(Parser.arrayToString(['1', '2', '3', '4'])).toBe('1, 2, 3 and 4')
    expect(
      Parser.arrayToString(['1', '2', '3', '4', '5', '6'], {
        separator: '|',
        lastSeparator: '|',
      }),
    ).toBe('1|2|3|4|5|6')

    expect(
      Parser.arrayToString(['1', '2'], {
        pairSeparator: '-',
      }),
    ).toBe('1-2')
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

  it('should parse the number to byte format and byte format to number', async () => {
    // size to byte
    expect(Parser.sizeToByte(1024)).toBe('1KB')
    expect(Parser.sizeToByte(1048576)).toBe('1MB')
    expect(Parser.sizeToByte(1073741824)).toBe('1GB')
    expect(Parser.sizeToByte(1099511627776)).toBe('1TB')
    expect(Parser.sizeToByte(1125899906842624)).toBe('1PB')

    // byte to size
    expect(Parser.byteToSize('1KB')).toBe(1024)
    expect(Parser.byteToSize('1MB')).toBe(1048576)
    expect(Parser.byteToSize('1GB')).toBe(1073741824)
    expect(Parser.byteToSize('1TB')).toBe(1099511627776)
    expect(Parser.byteToSize('1PB')).toBe(1125899906842624)
  })

  it('should parse the string to ms format and ms format to string', async () => {
    // time to ms
    expect(Parser.timeToMs('2 days')).toBe(172800000)
    expect(Parser.timeToMs('1d')).toBe(86400000)
    expect(Parser.timeToMs('10h')).toBe(36000000)
    expect(Parser.timeToMs('-10h')).toBe(-36000000)
    expect(Parser.timeToMs('1 year')).toBe(31557600000)
    expect(Parser.timeToMs('-1 year')).toBe(-31557600000)

    // ms to time
    expect(Parser.msToTime(172800000, true)).toBe('2 days')
    expect(Parser.msToTime(86400000)).toBe('1d')
    expect(Parser.msToTime(36000000)).toBe('10h')
    expect(Parser.msToTime(-36000000)).toBe('-10h')
    expect(Parser.msToTime(31557600000, true)).toBe('365 days')
    expect(Parser.msToTime(-31557600000, true)).toBe('-365 days')
  })

  it('should parse the status code to reason and reason to status code', async () => {
    // status code to reason
    expect(Parser.statusCodeToReason(200)).toBe('OK')
    expect(Parser.statusCodeToReason('201')).toBe('CREATED')
    expect(Parser.statusCodeToReason(401)).toBe('UNAUTHORIZED')
    expect(Parser.statusCodeToReason(500)).toBe('INTERNAL_SERVER_ERROR')

    // reason to status code
    expect(Parser.reasonToStatusCode('ok')).toBe(200)
    expect(Parser.reasonToStatusCode('Created')).toBe(201)
    expect(Parser.reasonToStatusCode('unauthorized')).toBe(401)
    expect(Parser.reasonToStatusCode('INTERNAL_SERVER_ERROR')).toBe(500)
  })

  it('should parse the complete database url to object and object to complete database url', async () => {
    const url =
      'postgresql://postgres:root@127.0.0.1:5432/postgres?paramOne=1&paramTwo=2&paramThree=3'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    expect(connectionObject.protocol).toBe('postgresql')
    expect(connectionObject.user).toBe('postgres')
    expect(connectionObject.password).toBe('root')
    expect(connectionObject.host).toBe('127.0.0.1')
    expect(connectionObject.port).toBe(5432)
    expect(connectionObject.database).toBe('postgres')
    expect(connectionObject.options).toEqual({
      paramOne: '1',
      paramTwo: '2',
      paramThree: '3',
    })

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    expect(connectionUrl).toBe(url)
  })

  it('should parse the without auth database url to object and object to without auth database url', async () => {
    const url = 'postgresql://127.0.0.1:5432/postgres'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    expect(connectionObject.protocol).toBe('postgresql')
    expect(connectionObject.user).toBe(null)
    expect(connectionObject.password).toBe(null)
    expect(connectionObject.host).toBe('127.0.0.1')
    expect(connectionObject.port).toBe(5432)
    expect(connectionObject.database).toBe('postgres')
    expect(connectionObject.options).toEqual({})

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    expect(connectionUrl).toBe(url)
  })

  it('should parse the without auth and port database url to object and object to without auth and port database url', async () => {
    const url = 'postgresql://127.0.0.1/postgres?options=10&test=10'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    expect(connectionObject.protocol).toBe('postgresql')
    expect(connectionObject.user).toBe(null)
    expect(connectionObject.password).toBe(null)
    expect(connectionObject.host).toBe('127.0.0.1')
    expect(connectionObject.port).toBe(null)
    expect(connectionObject.database).toBe('postgres')
    expect(connectionObject.options).toEqual({
      options: '10',
      test: '10',
    })

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    expect(connectionUrl).toBe(url)
  })

  it('should parse the without auth, port and options database url to object and object to without auth, port and options database url', async () => {
    const url = 'postgresql://127.0.0.1/postgres'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    expect(connectionObject.protocol).toBe('postgresql')
    expect(connectionObject.user).toBe(null)
    expect(connectionObject.password).toBe(null)
    expect(connectionObject.host).toBe('127.0.0.1')
    expect(connectionObject.port).toBe(null)
    expect(connectionObject.database).toBe('postgres')
    expect(connectionObject.options).toEqual({})

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    expect(connectionUrl).toBe(url)
  })

  it('should parse the cluster database url to object and object to cluster database url', async () => {
    const url =
      'postgresql://postgres:root@127.0.0.1:5432,127.0.0.1:5433,127.0.0.1:5434/postgres'

    // database url to connection object
    const connectionObject = Parser.dbUrlToConnectionObj(url)

    expect(connectionObject.protocol).toBe('postgresql')
    expect(connectionObject.user).toBe('postgres')
    expect(connectionObject.password).toBe('root')
    expect(connectionObject.host).toEqual([
      '127.0.0.1:5432',
      '127.0.0.1:5433',
      '127.0.0.1:5434',
    ])
    expect(connectionObject.port).toBe(null)
    expect(connectionObject.database).toBe('postgres')
    expect(connectionObject.options).toEqual({})

    // connection object to database url
    const connectionUrl = Parser.connectionObjToDbUrl(connectionObject)

    expect(connectionUrl).toBe(url)
  })
})
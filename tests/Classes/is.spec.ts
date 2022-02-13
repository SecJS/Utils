import { Is } from '../../src/Classes/Is'
import { InternalServerException } from '@secjs/exceptions'

describe('\n Is Class', () => {
  it('should verify if is a valid json string', async () => {
    expect(Is.Json('')).toBeFalsy()
    expect(Is.Json('Hello')).toBeFalsy()
    expect(Is.Json('[]')).toBeTruthy()
    expect(Is.Json('{}')).toBeTruthy()
    expect(Is.Json(JSON.stringify({ hello: 'world' }))).toBeTruthy()
  })

  it('should verify if is a valid ip address', async () => {
    expect(Is.Ip('')).toBeFalsy()
    expect(Is.Ip(' ')).toBeFalsy()
    expect(Is.Ip('http://localhost:3000')).toBeFalsy()
    expect(Is.Ip('http://127.0.0.1')).toBeTruthy()
    expect(Is.Ip('https://127.0.0.1:1335')).toBeTruthy()
    expect(Is.Ip('127.0.0.1')).toBeTruthy()
  })

  it('should verify if is a empty string', async () => {
    expect(Is.Empty('')).toBeTruthy()
    expect(Is.Empty(' ')).toBeTruthy()
    expect(Is.Empty('hello')).toBeFalsy()
  })

  it('should verify if is a valid cep', async () => {
    expect(Is.Cep(0)).toBeFalsy()
    expect(Is.Cep('')).toBeFalsy()
    expect(Is.Cep(43710130)).toBeTruthy()
    expect(Is.Cep('43710-130')).toBeTruthy()
  })

  it('should verify if is a valid cnpj', async () => {
    expect(Is.Cpf(0)).toBeFalsy()
    expect(Is.Cpf('')).toBeFalsy()
    expect(Is.Cpf(52946109062)).toBeTruthy()
    expect(Is.Cpf('529.461.090-62')).toBeTruthy()
  })

  it('should verify if is a valid async function', async () => {
    expect(Is.Async(0)).toBeFalsy()
    expect(Is.Async('')).toBeFalsy()
    expect(Is.Async(() => '')).toBeFalsy()
    expect(Is.Async(async () => '')).toBeTruthy()
    expect(Is.Async(() => new Promise(resolve => resolve))).toBeTruthy()
  })

  it('should verify if is a valid cnpj', async () => {
    expect(Is.Cnpj(0)).toBeFalsy()
    expect(Is.Cnpj('')).toBeFalsy()
    expect(Is.Cnpj(23984398000143)).toBeTruthy()
    expect(Is.Cnpj('31.017.771/0001-15')).toBeTruthy()
  })

  it('should verify if is a valid undefined', async () => {
    expect(Is.Undefined(0)).toBeFalsy()
    expect(Is.Undefined('')).toBeFalsy()
    expect(Is.Undefined(undefined)).toBeTruthy()
  })

  it('should verify if is a valid null', async () => {
    expect(Is.Null(0)).toBeFalsy()
    expect(Is.Null('')).toBeFalsy()
    expect(Is.Null(null)).toBeTruthy()
  })

  it('should verify if is a valid boolean', async () => {
    expect(Is.Boolean(0)).toBeFalsy()
    expect(Is.Boolean('')).toBeFalsy()
    expect(Is.Boolean(true)).toBeTruthy()
    expect(Is.Boolean(false)).toBeTruthy()
  })

  it('should verify if is a valid buffer', async () => {
    expect(Is.Buffer(0)).toBeFalsy()
    expect(Is.Buffer('')).toBeFalsy()
    expect(Is.Buffer(Buffer.from('Hello World'))).toBeTruthy()
  })

  it('should verify if is a valid number', async () => {
    expect(Is.Number(0)).toBeTruthy()
    expect(Is.Number('')).toBeFalsy()
    expect(Is.Number(-10)).toBeTruthy()
  })

  it('should verify if is a valid string', async () => {
    expect(Is.String(0)).toBeFalsy()
    expect(Is.String('')).toBeTruthy()
    expect(Is.String('hello world')).toBeTruthy()
  })

  it('should verify if is a valid object', async () => {
    expect(Is.Object(0)).toBeFalsy()
    expect(Is.Object({ hello: 'world' })).toBeTruthy()
    expect(Is.Object('hello world')).toBeFalsy()
    expect(Is.Object(JSON.stringify({ hello: 'world' }))).toBeFalsy()
  })

  it('should verify if is a valid date', async () => {
    expect(Is.Date(0)).toBeFalsy()
    expect(Is.Date(new Date())).toBeTruthy()
    expect(Is.Date(new Date().getTime())).toBeFalsy()
  })

  it('should verify if is a valid array', async () => {
    expect(Is.Array(0)).toBeFalsy()
    expect(Is.Array('')).toBeFalsy()
    expect(Is.Array([''])).toBeTruthy()
  })

  it('should verify if is a valid regexp', async () => {
    expect(Is.Regexp(0)).toBeFalsy()
    expect(Is.Regexp('')).toBeFalsy()
    expect(Is.Regexp(/g/)).toBeTruthy()
    // eslint-disable-next-line prefer-regex-literals
    expect(Is.Regexp(new RegExp(''))).toBeTruthy()
  })

  it('should verify if is a valid error', async () => {
    expect(Is.Error(0)).toBeFalsy()
    expect(Is.Error('')).toBeFalsy()
    expect(Is.Error(new Error())).toBeTruthy()
    expect(Is.Error(new InternalServerException())).toBeTruthy()
  })

  it('should verify if is a valid function', async () => {
    expect(Is.Function(0)).toBeFalsy()
    expect(Is.Function('')).toBeFalsy()
    expect(Is.Function(() => '')).toBeTruthy()
    expect(
      Is.Function(function test() {
        return ''
      }),
    ).toBeTruthy()
  })

  it('should verify if is a valid class', async () => {
    expect(Is.Class(0)).toBeFalsy()
    expect(Is.Class('')).toBeFalsy()
    expect(Is.Class(InternalServerException)).toBeTruthy()
  })

  it('should verify if is a valid integer', async () => {
    expect(Is.Integer(0)).toBeTruthy()
    expect(Is.Integer(1.2)).toBeFalsy()
  })

  it('should verify if is a valid float', async () => {
    expect(Is.Float(0)).toBeFalsy()
    expect(Is.Float(1.2)).toBeTruthy()
  })

  it('should verify if is a valid array of objects', async () => {
    const data = [
      {
        hello: 'hello',
      },
      {
        hello: 'hello',
      },
    ]

    expect(Is.ArrayOfObjects(0)).toBeFalsy()
    expect(Is.ArrayOfObjects('')).toBeFalsy()
    expect(Is.ArrayOfObjects([])).toBeFalsy()
    expect(Is.ArrayOfObjects([1, 2, 3])).toBeFalsy()
    expect(Is.ArrayOfObjects(['', '', ''])).toBeFalsy()
    expect(Is.ArrayOfObjects(data)).toBeTruthy()
  })
})

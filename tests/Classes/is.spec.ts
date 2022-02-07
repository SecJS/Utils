import { Is } from '../../src/Classes/Is'
import { InternalServerException } from '@secjs/exceptions'

describe('\n Is Class', () => {
  it('should verify if is a empty string', async () => {
    expect(Is.Empty('')).toBeTruthy()
    expect(Is.Empty(' ')).toBeTruthy()
    expect(Is.Empty('hello')).toBeFalsy()
  })

  it('should verify if is a valid cep', async () => {
    expect(Is.Cep(0)).toBe(false)
    expect(Is.Cep('')).toBe(false)
    expect(Is.Cep(43710130)).toBe(true)
    expect(Is.Cep('43710-130')).toBe(true)
  })

  it('should verify if is a valid cnpj', async () => {
    expect(Is.Cpf(0)).toBe(false)
    expect(Is.Cpf('')).toBe(false)
    expect(Is.Cpf(52946109062)).toBe(true)
    expect(Is.Cpf('529.461.090-62')).toBe(true)
  })

  it('should verify if is a valid cnpj', async () => {
    expect(Is.Cnpj(0)).toBe(false)
    expect(Is.Cnpj('')).toBe(false)
    expect(Is.Cnpj(23984398000143)).toBe(true)
    expect(Is.Cnpj('31.017.771/0001-15')).toBe(true)
  })

  it('should verify if is a valid undefined', async () => {
    expect(Is.Undefined(0)).toBe(false)
    expect(Is.Undefined('')).toBe(false)
    expect(Is.Undefined(undefined)).toBe(true)
  })

  it('should verify if is a valid null', async () => {
    expect(Is.Null(0)).toBe(false)
    expect(Is.Null('')).toBe(false)
    expect(Is.Null(null)).toBe(true)
  })

  it('should verify if is a valid boolean', async () => {
    expect(Is.Boolean(0)).toBe(false)
    expect(Is.Boolean('')).toBe(false)
    expect(Is.Boolean(true)).toBe(true)
    expect(Is.Boolean(false)).toBe(true)
  })

  it('should verify if is a valid buffer', async () => {
    expect(Is.Buffer(0)).toBe(false)
    expect(Is.Buffer('')).toBe(false)
    expect(Is.Buffer(Buffer.from('Hello World'))).toBe(true)
  })

  it('should verify if is a valid number', async () => {
    expect(Is.Number(0)).toBe(true)
    expect(Is.Number('')).toBe(false)
    expect(Is.Number(-10)).toBe(true)
  })

  it('should verify if is a valid string', async () => {
    expect(Is.String(0)).toBe(false)
    expect(Is.String('')).toBe(true)
    expect(Is.String('hello world')).toBe(true)
  })

  it('should verify if is a valid object', async () => {
    expect(Is.Object(0)).toBe(false)
    expect(Is.Object({ hello: 'world' })).toBe(true)
    expect(Is.Object('hello world')).toBe(false)
    expect(Is.Object(JSON.stringify({ hello: 'world' }))).toBe(false)
  })

  it('should verify if is a valid date', async () => {
    expect(Is.Date(0)).toBe(false)
    expect(Is.Date(new Date())).toBe(true)
    expect(Is.Date(new Date().getTime())).toBe(false)
  })

  it('should verify if is a valid array', async () => {
    expect(Is.Array(0)).toBe(false)
    expect(Is.Array('')).toBe(false)
    expect(Is.Array([''])).toBe(true)
  })

  it('should verify if is a valid regexp', async () => {
    expect(Is.Regexp(0)).toBe(false)
    expect(Is.Regexp('')).toBe(false)
    expect(Is.Regexp(/g/)).toBe(true)
    // eslint-disable-next-line prefer-regex-literals
    expect(Is.Regexp(new RegExp(''))).toBe(true)
  })

  it('should verify if is a valid error', async () => {
    expect(Is.Error(0)).toBe(false)
    expect(Is.Error('')).toBe(false)
    expect(Is.Error(new Error())).toBe(true)
    expect(Is.Error(new InternalServerException())).toBe(true)
  })

  it('should verify if is a valid function', async () => {
    expect(Is.Function(0)).toBe(false)
    expect(Is.Function('')).toBe(false)
    expect(Is.Function(() => '')).toBe(true)
    expect(
      Is.Function(function test() {
        return ''
      }),
    ).toBe(true)
  })

  it('should verify if is a valid class', async () => {
    expect(Is.Class(0)).toBe(false)
    expect(Is.Class('')).toBe(false)
    expect(Is.Class(InternalServerException)).toBe(true)
  })

  it('should verify if is a valid integer', async () => {
    expect(Is.Integer(0)).toBe(true)
    expect(Is.Integer(1.2)).toBe(false)
  })

  it('should verify if is a valid float', async () => {
    expect(Is.Float(0)).toBe(false)
    expect(Is.Float(1.2)).toBe(true)
  })
})

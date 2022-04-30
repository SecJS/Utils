/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Is, Exception } from '#src/index'

test.group('\n IsTest', () => {
  test('should verify if is a valid json string', async ({ assert }) => {
    assert.isFalse(Is.Json(''))
    assert.isFalse(Is.Json('Hello'))
    assert.isTrue(Is.Json('[]'))
    assert.isTrue(Is.Json('{}'))
    assert.isTrue(Is.Json(JSON.stringify({ hello: 'world' })))
  })

  test('should verify if is a valid ip address', async ({ assert }) => {
    assert.isFalse(Is.Ip(''))
    assert.isFalse(Is.Ip(' '))
    assert.isFalse(Is.Ip('http://localhost:3000'))
    assert.isTrue(Is.Ip('http://127.0.0.1'))
    assert.isTrue(Is.Ip('https://127.0.0.1:1335'))
    assert.isTrue(Is.Ip('127.0.0.1'))
  })

  test('should verify if is a valid uuid', async ({ assert }) => {
    assert.isFalse(Is.Uuid(''))
    assert.isFalse(Is.Uuid(' '))
    assert.isTrue(Is.Uuid('50bc9524-c4b3-11ec-9d64-0242ac120002'))
    assert.isFalse(Is.Uuid('ath-50bc9524-c4b3-11ec-9d64-0242ac120002'))
  })

  test('should verify if is an empty string', async ({ assert }) => {
    assert.isTrue(Is.Empty(0))
    assert.isFalse(Is.Empty(1))
    assert.isTrue(Is.Empty(''))
    assert.isTrue(Is.Empty(' '))
    assert.isFalse(Is.Empty('hello'))
  })

  test('should verify if is an empty number', async ({ assert }) => {
    assert.isTrue(Is.Empty(0))
    assert.isFalse(Is.Empty(10))
  })

  test('should verify if is an empty object', async ({ assert }) => {
    assert.isTrue(Is.Empty({}))
    assert.isFalse(Is.Empty({ hello: 'world' }))
  })

  test('should verify if is an empty array', async ({ assert }) => {
    assert.isTrue(Is.Empty([]))
    assert.isFalse(Is.Empty([null]))
    assert.isFalse(Is.Empty([{ hello: 'world' }]))
  })

  test('should verify if is a valid cep', async ({ assert }) => {
    assert.isFalse(Is.Cep(0))
    assert.isFalse(Is.Cep(''))
    assert.isTrue(Is.Cep(43710130))
    assert.isTrue(Is.Cep('43710-130'))
  })

  test('should verify if is a valid cnpj', async ({ assert }) => {
    assert.isFalse(Is.Cpf(0))
    assert.isFalse(Is.Cpf(''))
    assert.isTrue(Is.Cpf(52946109062))
    assert.isTrue(Is.Cpf('529.461.090-62'))
  })

  test('should verify if is a valid async function', async ({ assert }) => {
    assert.isFalse(Is.Async(0))
    assert.isFalse(Is.Async(''))
    assert.isFalse(Is.Async(() => ''))
    assert.isTrue(Is.Async(async () => ''))
    assert.isTrue(Is.Async(() => new Promise(resolve => resolve)))
  })

  test('should verify if is a valid cnpj', async ({ assert }) => {
    assert.isFalse(Is.Cnpj(0))
    assert.isFalse(Is.Cnpj(''))
    assert.isTrue(Is.Cnpj(23984398000143))
    assert.isTrue(Is.Cnpj('31.017.771/0001-15'))
  })

  test('should verify if is a valid undefined', async ({ assert }) => {
    assert.isFalse(Is.Undefined(0))
    assert.isFalse(Is.Undefined(''))
    assert.isTrue(Is.Undefined(undefined))
  })

  test('should verify if is a valid null', async ({ assert }) => {
    assert.isFalse(Is.Null(0))
    assert.isFalse(Is.Null(''))
    assert.isTrue(Is.Null(null))
  })

  test('should verify if is a valid boolean', async ({ assert }) => {
    assert.isFalse(Is.Boolean(0))
    assert.isFalse(Is.Boolean(''))
    assert.isTrue(Is.Boolean(true))
    assert.isTrue(Is.Boolean(false))
  })

  test('should verify if is a valid buffer', async ({ assert }) => {
    assert.isFalse(Is.Buffer(0))
    assert.isFalse(Is.Buffer(''))
    assert.isTrue(Is.Buffer(Buffer.from('Hello World')))
  })

  test('should verify if is a valid number', async ({ assert }) => {
    assert.isTrue(Is.Number(0))
    assert.isFalse(Is.Number(''))
    assert.isTrue(Is.Number(-10))
  })

  test('should verify if is a valid string', async ({ assert }) => {
    assert.isFalse(Is.String(0))
    assert.isTrue(Is.String(''))
    assert.isTrue(Is.String('hello world'))
  })

  test('should verify if is a valid object', async ({ assert }) => {
    assert.isFalse(Is.Object(0))
    assert.isTrue(Is.Object({ hello: 'world' }))
    assert.isFalse(Is.Object('hello world'))
    assert.isFalse(Is.Object(JSON.stringify({ hello: 'world' })))
  })

  test('should verify if is a valid date', async ({ assert }) => {
    assert.isFalse(Is.Date(0))
    assert.isTrue(Is.Date(new Date()))
    assert.isFalse(Is.Date(new Date().getTime()))
  })

  test('should verify if is a valid array', async ({ assert }) => {
    assert.isFalse(Is.Array(0))
    assert.isFalse(Is.Array(''))
    assert.isTrue(Is.Array(['']))
  })

  test('should verify if is a valid regexp', async ({ assert }) => {
    assert.isFalse(Is.Regexp(0))
    assert.isFalse(Is.Regexp(''))
    assert.isTrue(Is.Regexp(/g/))
    // eslint-disable-next-line prefer-regex-literals
    assert.isTrue(Is.Regexp(new RegExp('')))
  })

  test('should verify if is a valid error', async ({ assert }) => {
    assert.isFalse(Is.Error(0))
    assert.isFalse(Is.Error(''))
    assert.isTrue(Is.Error(new Error()))
    assert.isTrue(Is.Error(new Exception('Test')))
  })

  test('should verify if is a valid function', async ({ assert }) => {
    assert.isFalse(Is.Function(0))
    assert.isFalse(Is.Function(''))
    assert.isTrue(Is.Function(() => ''))
    assert.isTrue(
      Is.Function(function test() {
        return ''
      }),
    )
  })

  test('should verify if is a valid class', async ({ assert }) => {
    assert.isFalse(Is.Class(0))
    assert.isFalse(Is.Class(''))
    assert.isTrue(Is.Class(Exception))
  })

  test('should verify if is a valid integer', async ({ assert }) => {
    assert.isTrue(Is.Integer(0))
    assert.isFalse(Is.Integer(1.2))
  })

  test('should verify if is a valid float', async ({ assert }) => {
    assert.isFalse(Is.Float(0))
    assert.isTrue(Is.Float(1.2))
  })

  test('should verify if is a valid array of objects', async ({ assert }) => {
    const data = [
      {
        hello: 'hello',
      },
      {
        hello: 'hello',
      },
    ]

    assert.isFalse(Is.ArrayOfObjects(0))
    assert.isFalse(Is.ArrayOfObjects(''))
    assert.isFalse(Is.ArrayOfObjects([]))
    assert.isFalse(Is.ArrayOfObjects([1, 2, 3]))
    assert.isFalse(Is.ArrayOfObjects(['', '', '']))
    assert.isTrue(Is.ArrayOfObjects(data))
  })
})

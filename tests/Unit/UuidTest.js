/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { v4 } from 'uuid'
import { Uuid } from '#src/index'
import { test } from '@japa/runner'
import { InvalidUuidException } from '#src/Exceptions/InvalidUuidException'

test.group('UuidTest', () => {
  const uuid = v4()

  test('should verify if uuid is a valid uuid even if it is prefixed', async ({ assert }) => {
    const tokenPrefixed = Uuid.generate('tkn')

    const verify = Uuid.verify(uuid)
    const verifyError = Uuid.verify('falseUuid')
    const verifyPrefixed = Uuid.verify(tokenPrefixed, true)

    assert.isTrue(verify)
    assert.isFalse(verifyError)
    assert.isTrue(verifyPrefixed)
  })

  test('should get only the token from prefixed uuid', async ({ assert }) => {
    const tokenUuid = Uuid.generate('tkn')

    assert.equal(Uuid.getToken(tokenUuid), tokenUuid.replace('tkn::', ''))
  })

  test('should get only the prefix from prefixed uuid', async ({ assert }) => {
    const tokenUuid = Uuid.generate('tkn')

    assert.isNull(Uuid.getPrefix(uuid), null)
    assert.equal(Uuid.getPrefix(tokenUuid), 'tkn')
  })

  test('should inject the prefix in the token', async ({ assert }) => {
    const tokenUuid = Uuid.generate()
    const injectedPrefix = Uuid.injectPrefix('tkn', tokenUuid)
    const tokenPrefixedChange = Uuid.changePrefix('any', injectedPrefix)

    assert.equal(injectedPrefix, `tkn::${tokenUuid}`)
    assert.equal(tokenPrefixedChange, `any::${tokenUuid}`)

    const useCase = () => Uuid.injectPrefix('tkn', 'not-valid-uuid')

    assert.throws(useCase, InvalidUuidException)
  })

  test('should change or generate a new token', async ({ assert }) => {
    const tokenGenerated = Uuid.changeOrGenerate('tkn', undefined)
    const tokenChanged = Uuid.changeOrGenerate('tkn', `ooo::${uuid}`)

    assert.isDefined(tokenGenerated)
    assert.equal(tokenChanged, `tkn::${uuid}`)

    const useCase = () => Uuid.changePrefix('tkn', 'not-valid-uuid')

    assert.throws(useCase, InvalidUuidException)
  })
})

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { v4 } from 'uuid'
import { Uuid } from '#src/Uuid'
import { InvalidUuidException } from '#src/Exceptions/InvalidUuidException'

describe('\n UuidTest', () => {
  const uuid = v4()

  it('should verify if uuid is a valid uuid even if it is prefixed', () => {
    const tokenPrefixed = Uuid.generate('tkn')

    const verify = Uuid.verify(uuid)
    const verifyError = Uuid.verify('falseUuid')
    const verifyPrefixed = Uuid.verify(tokenPrefixed, true)

    expect(verify).toBe(true)
    expect(verifyError).toBe(false)
    expect(verifyPrefixed).toBe(true)
  })

  it('should get only the token from prefixed uuid', () => {
    const tokenUuid = Uuid.generate('tkn')

    expect(Uuid.getToken(tokenUuid)).toBe(tokenUuid.replace('tkn::', ''))
  })

  it('should get only the prefix from prefixed uuid', () => {
    const tokenUuid = Uuid.generate('tkn')

    expect(Uuid.getPrefix(uuid)).toBe(null)
    expect(Uuid.getPrefix(tokenUuid)).toBe('tkn')
  })

  it('should inject the prefix in the token', () => {
    const tokenUuid = Uuid.generate()
    const injectedPrefix = Uuid.injectPrefix('tkn', tokenUuid)
    const tokenPrefixedChange = Uuid.changePrefix('any', injectedPrefix)

    expect(injectedPrefix).toBe(`tkn::${tokenUuid}`)
    expect(tokenPrefixedChange).toBe(`any::${tokenUuid}`)

    const useCase = () => Uuid.injectPrefix('tkn', 'not-valid-uuid')

    expect(useCase).toThrow(InvalidUuidException)
  })

  it('should change or generate a new token', () => {
    const tokenGenerated = Uuid.changeOrGenerate('tkn', undefined)
    const tokenChanged = Uuid.changeOrGenerate('tkn', `ooo::${uuid}`)

    expect(tokenGenerated).toBeTruthy()
    expect(tokenChanged).toBe(`tkn::${uuid}`)

    const useCase = () => Uuid.changePrefix('tkn', 'not-valid-uuid')

    expect(useCase).toThrow(InvalidUuidException)
  })
})

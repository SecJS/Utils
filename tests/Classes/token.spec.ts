import { Token } from '../../src/Classes/Token'

describe('\n Token Class', () => {
  let uuid: string

  beforeAll(() => {
    uuid = Token.generate()
  })

  it('should verify if uuid is a valid uuid even if it is prefixed and generate a token', () => {
    const tokenPrefixed = Token.generate('tkn')

    const verify = Token.verify(uuid)
    const verifyError = Token.verify('falseUuid')
    const verifyPrefixed = Token.verify(tokenPrefixed, true)

    expect(verify).toBe(true)
    expect(verifyError).toBe(false)
    expect(verifyPrefixed).toBe(true)
  })

  it('should inject the prefix and change', () => {
    const tokenUuid = Token.generate()
    const injectedPrefix = Token.injectPrefix('tkn', tokenUuid)
    const tokenPrefixedChange = Token.changePrefix('any', injectedPrefix)

    expect(injectedPrefix).toBe(`tkn-${tokenUuid}`)
    expect(tokenPrefixedChange).toBe(`any-${tokenUuid}`)
  })

  it('should change or generate a new token', () => {
    const tokenGenerated = Token.changeOrGenerate('tkn', undefined)
    const tokenChanged = Token.changeOrGenerate('tkn', `ooo-${uuid}`)

    expect(tokenGenerated).toBeTruthy()
    expect(tokenChanged).toBe(`tkn-${uuid}`)
  })
})

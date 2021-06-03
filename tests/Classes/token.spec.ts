import { Token } from '../../src/Classes/Token'

describe('\n Token Class', () => {
  let token: Token
  let uuid: string

  beforeAll(() => {
    token = new Token()
    uuid = token.generate()
  })

  it('should verify if uuid is a valid uuid even if it is prefixed and generate a token', () => {
    const tokenPrefixed = token.generate('tkn')

    const verify = token.verify(uuid)
    const verifyError = token.verify('falseUuid')
    const verifyPrefixed = token.verify(tokenPrefixed, true)

    expect(verify).toBe(true)
    expect(verifyError).toBe(false)
    expect(verifyPrefixed).toBe(true)
  })

  it('should inject the prefix and change', () => {
    const tokenUuid = token.generate()
    const injectedPrefix = token.injectPrefix('tkn', tokenUuid)
    const tokenPrefixedChange = token.changePrefix('any', injectedPrefix)

    expect(injectedPrefix).toBe(`tkn-${tokenUuid}`)
    expect(tokenPrefixedChange).toBe(`any-${tokenUuid}`)
  })

  it('should change or generate a new token', () => {
    const tokenGenerated = token.changeOrGenerate('tkn', undefined)
    const tokenChanged = token.changeOrGenerate('tkn', `ooo-${uuid}`)

    expect(tokenGenerated).toBeTruthy()
    expect(tokenChanged).toBe(`tkn-${uuid}`)
  })
})

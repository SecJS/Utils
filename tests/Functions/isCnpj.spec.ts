import { isCnpj } from '../../src/Functions/isCnpj'

describe('\n isCnpj Function', () => {
  it('should verify if is a valid cnpj', async () => {
    expect(isCnpj(0)).toBe(false)
    expect(isCnpj('')).toBe(false)
    expect(isCnpj(23984398000143)).toBe(true)
    expect(isCnpj('31.017.771/0001-15')).toBe(true)
  })
})

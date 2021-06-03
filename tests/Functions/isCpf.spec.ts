import { isCpf } from '../../src/Functions/isCpf'

describe('\n isCpf Function', () => {
  it('should verify if is a valid cpf', async () => {
    expect(isCpf(0)).toBe(false)
    expect(isCpf('')).toBe(false)
    expect(isCpf(52946109062)).toBe(true)
    expect(isCpf('529.461.090-62')).toBe(true)
  })
})

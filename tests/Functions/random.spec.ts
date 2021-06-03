import { random } from '../../src/Functions/random'

describe('\n random Function', () => {
  it('should be able to get a random hash', async () => {
    expect(await random()).toHaveLength(40)
    expect(await random(20)).toHaveLength(20)
  })
})

import { randomColor } from '../../src/Functions/randomColor'

describe('\n random Function', () => {
  it('should be able to generate a random color', async () => {
    expect(randomColor()).toBeTruthy()
  })
})

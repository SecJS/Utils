import { sleep } from '../../src/Functions/sleep'

describe('\n sleep Function', () => {
  it('should be able to sleep the code for some ms', async () => {
    await sleep(10)
  })
})

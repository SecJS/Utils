import { sleep } from '../../src/Utils/sleep'

describe('\n sleep Function', () => {
  it('should be able to sleep the code for some ms', async () => {
    await sleep(10)
  })
})

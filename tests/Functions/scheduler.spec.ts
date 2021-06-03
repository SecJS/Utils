import { scheduler } from '../../src/Functions/scheduler'

describe('\n scheduler Function', () => {
  it('should be able to schedule something to execute after each ms', async () => {
    const func = arg => {
      expect(arg).toBe(1)
    }

    scheduler(func, 300, 1)
  })
})

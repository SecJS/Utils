import { scheduler } from '../../src/Utils/scheduler'

describe('\n scheduler Function', () => {
  it('should be able to schedule something to execute after each ms', async () => {
    const func = arg => {
      expect(arg).toBe(1)
    }

    const interval = scheduler(func, 300, 1)

    // TODO tests scheduler func somehow
    clearInterval(interval)
  })
})

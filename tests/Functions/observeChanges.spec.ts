import { sleep } from '../../src/Functions/sleep'
import { observeChanges } from '../../src/Functions/observeChanges'

describe('\n observeChanges Function', () => {
  it('should be able to observe changes of an object', async () => {
    const object = {
      joao: 'lenon',
      hello: 'world',
    }

    const objectProxy = observeChanges(
      object,
      (value: string, arg1, arg2, arg3) => {
        expect(value).toBe('oi')
        expect(arg1).toBe(1)
        expect(arg2).toBe(2)
        expect(arg3).toBe(3)
      },
      1,
      2,
      3,
    )

    objectProxy.joao = 'oi'

    await sleep(2000)
  })
})

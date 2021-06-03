import { fillable } from '../../src/Functions/fillable'

describe('\n fillable Function', () => {
  it('should clean data object removing all keys that are not in key array', async () => {
    const data = {
      hello: 'hello',
      world: 'world',
    }

    expect(fillable(data, ['world'])).toStrictEqual({ world: 'world' })
    expect(fillable(data, ['world', 'someNullWord'])).toStrictEqual({
      world: 'world',
    })
  })
})

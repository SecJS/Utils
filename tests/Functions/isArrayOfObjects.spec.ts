import { isArrayOfObjects } from '../../src/Functions/isArrayOfObjects'

describe('\n isArrayOfObjects Function', () => {
  it('should verify if the array is an array of objects', async () => {
    const data = [
      {
        hello: 'hello',
        world: 'world',
      },
    ]

    expect(isArrayOfObjects(data)).toBe(true)
    expect(isArrayOfObjects([])).toBe(false)
    expect(isArrayOfObjects([1, 2, 3])).toBe(false)
  })
})

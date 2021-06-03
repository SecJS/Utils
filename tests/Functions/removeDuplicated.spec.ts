import { removeDuplicated } from '../../src/Functions/removeDuplicated'

describe('\n removeDuplicated Function', () => {
  it('should be able to remove duplicated values from array', async () => {
    const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]

    const newArray = removeDuplicated(array)

    expect(newArray).toStrictEqual([1, 2, 3, 4, 5])
  })
})

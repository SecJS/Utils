import { sort } from '../../src/Functions/sort'

describe('\n sort Function', () => {
  it('should be able to sort any value in the array', async () => {
    const array = [1, 2, 3, 4, 5]

    expect(array[sort(array)]).toBeTruthy()
  })
})

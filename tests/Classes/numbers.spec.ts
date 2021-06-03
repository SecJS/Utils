import { Numbers } from '../../src/Classes/Numbers'

describe('\n Numbers Class', () => {
  let numbers: Numbers

  beforeAll(() => {
    numbers = new Numbers()
  })

  it('should get the higher and lower number from an array of numbers', () => {
    const numbersArray = [1, 2, 3, 4, 5]

    const lower = numbers.getLower(numbersArray)
    const higher = numbers.getHigher(numbersArray)

    expect(lower).toBe(1)
    expect(higher).toBe(5)
  })

  it('should extract all numbers inside of a string in number and array format', () => {
    const stringWithNumbers =
      "My name is João Lenon and I've 20 years old and I've been living in Foz do Iguaçu for 18 years"

    const twentyNumber = numbers.extractNumber(stringWithNumbers)
    const numbersArray = numbers.extractNumbers(stringWithNumbers)

    expect(twentyNumber).toBe(2018)
    expect(numbersArray).toStrictEqual([20, 18])
  })

  it('should get the average of numbers by args or array of numbers', () => {
    const arrayNumbers = [1, 2, 3, 4, 5]

    const argsAverage = numbers.argsAverage(arrayNumbers[0], arrayNumbers[1])
    const arrayAverage = numbers.arrayAverage(arrayNumbers)

    expect(argsAverage).toBe(1.5)
    expect(arrayAverage).toBe(3)
  })
})

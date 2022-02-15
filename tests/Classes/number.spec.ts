import { Number } from '../../src/Classes/Number'

describe('\n Numbers Class', () => {
  it('should get the higher and lower number from an array of numbers', () => {
    const numbersArray = [1, 2, 3, 4, 5]

    const lower = Number.getLower(numbersArray)
    const higher = Number.getHigher(numbersArray)

    expect(lower).toBe(1)
    expect(higher).toBe(5)
  })

  it('should extract all numbers inside of a string in number and array format', () => {
    const stringWithNumbers =
      "My name is João Lenon and I've 20 years old and I've been living in Foz do Iguaçu for 18 years"

    const twentyNumber = Number.extractNumber(stringWithNumbers)
    const numbersArray = Number.extractNumbers(stringWithNumbers)

    expect(twentyNumber).toBe(2018)
    expect(numbersArray).toStrictEqual([20, 18])
  })

  it('should get the average of numbers by args or array of numbers', () => {
    const arrayNumbers = [1, 2, 3, 4, 5]

    const argsAverage = Number.argsAverage(arrayNumbers[0], arrayNumbers[1])
    const arrayAverage = Number.arrayAverage(arrayNumbers)

    expect(argsAverage).toBe(1.5)
    expect(arrayAverage).toBe(3)
  })

  it('should generate a random integer between two integer values', () => {
    expect(Number.randomIntFromInterval(0, 0)).toBeFalsy()
    expect(Number.randomIntFromInterval(1, 10)).toBeTruthy()
  })
})
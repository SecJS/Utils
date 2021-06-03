/**
 * Verify if array is and array of objects
 *
 * @param array The array to be validated
 * @return true or false
 */
export function isArrayOfObjects(array: any[]): boolean {
  if (!array.length) return false

  const results = array.map(object => typeof object === 'object')

  return !results.includes(false)
}

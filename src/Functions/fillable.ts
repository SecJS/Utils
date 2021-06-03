/**
 * Remove all keys from data that is not inside array keys
 *
 * @param data The data with keys to remove
 * @param keys Array of keys that needs to stay in data
 * @return data only with keys
 */
export function fillable(data: any, keys: string[]): any {
  return keys.reduce((previous: any, key: string) => {
    if (data[key]) {
      previous[key] = data[key]
    }

    return previous
  }, {})
}

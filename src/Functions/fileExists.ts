import { promises } from 'fs'

/**
 * Verify if file exists on certain path
 *
 * @param path The path of the file
 * @return Boolean value
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    await promises.access(path)

    return true
  } catch (error) {
    return false
  }
}

import { resolve } from 'path'
import { promises } from 'fs'

/**
 * Return all files of a directory and sub directories
 *
 * @param dir The directory
 * @param iterateFolders If need to get files inside sub directories by default true
 * @yield files path
 */
export async function* getFiles(dir: string, iterateFolders = true): any {
  const dirents = await promises.readdir(dir, { withFileTypes: true })

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)

    if (dirent.isDirectory() && iterateFolders) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

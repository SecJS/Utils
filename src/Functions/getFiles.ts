import { resolve } from 'path'
import { promises } from 'fs'

export async function* getFiles(dir: string): any {
  const dirents = await promises.readdir(dir, { withFileTypes: true })

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)

    if (dirent.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

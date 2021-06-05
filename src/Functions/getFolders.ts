import { resolve } from 'path'
import { promises } from 'fs'

export interface DirectoryContract {
  path: string
  files: string[] | Buffer[]
  folders: DirectoryContract[]
}

/**
 * Return all folders of a directory and files inside
 *
 * @param dir The directory
 * @param withFiles If need to get files inside folders by default false
 * @param buffer Return the buffer of the file by default false
 * @return The directory root with sub folders and files when withFiles true
 */
export async function getFolders(
  dir: string,
  withFiles = false,
  buffer = false,
): Promise<DirectoryContract> {
  const dirents = await promises.readdir(dir, { withFileTypes: true })

  const directory = {
    path: resolve(dir),
    files: [],
    folders: [],
  }

  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name)

    if (dirent.isDirectory()) {
      directory.folders.push(await getFolders(res, withFiles, buffer))

      continue
    }

    if (dirent.isFile() && withFiles) {
      directory.files.push(buffer ? Buffer.from(res) : res)
    }
  }

  return directory
}

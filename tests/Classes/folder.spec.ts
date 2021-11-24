/* eslint-disable no-new */
/*
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync, promises } from 'fs'
import { Path } from '../../src/Classes/Path'
import { Folder } from '../../src/Classes/Folder'
import { createFileOfSize } from '../../src/Functions/createFileOfSize'

describe('\n Folder Class', () => {
  let bigFolder: Folder = null
  let nonexistentFolder: Folder = null

  const bigFolderPath = Path.pwd('tests/folder-class-test/big')
  const nonexistentFolderPath = Path.pwd('tests/folder-class-test/non-existent')

  beforeEach(async () => {
    createFileOfSize(bigFolderPath + '/file.txt', 1024 * 1024 * 100)

    bigFolder = new Folder(bigFolderPath)

    createFileOfSize(bigFolderPath + '/hello/file.txt', 1024 * 1024 * 100)
    createFileOfSize(bigFolderPath + '/hello/nice/file.txt', 1024 * 1024 * 100)

    nonexistentFolder = new Folder(nonexistentFolderPath)
  })

  it('should generate an instance of a folder, it existing or not', async () => {
    expect(bigFolder.path).toBe(bigFolderPath)
    expect(bigFolder.folderExists).toBe(true)
    expect(bigFolder.originalPath).toBe(bigFolderPath)
    expect(bigFolder.originalFolderExists).toBe(true)
    expect(bigFolder.dir).toBe(bigFolderPath.replace('/big', ''))

    expect(nonexistentFolder.path).toBeTruthy()
    expect(nonexistentFolder.folderExists).toBe(false)
    expect(nonexistentFolder.originalFolderExists).toBe(false)
    expect(nonexistentFolder.originalPath).toBe(nonexistentFolderPath)
  })

  it('should create the folder when it does not exist and throw errors if trying to create a folder that already exists and load the subFiles/subFolders information', async () => {
    try {
      await bigFolder.create()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder already exists')
    }

    try {
      nonexistentFolder.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'Folder does not exist, use create method to create the folder',
      )
    }

    nonexistentFolder.createSync()

    expect(nonexistentFolder.folderExists).toBe(true)
    expect(existsSync(nonexistentFolder.path)).toBe(true)
    expect(nonexistentFolder.originalFolderExists).toBe(false)

    // LOAD

    expect(bigFolder.files.length).toBe(0)
    expect(bigFolder.folders.length).toBe(0)
    await bigFolder.load()

    expect(bigFolder.files.length).toBeTruthy()
    expect(bigFolder.folders.length).toBeTruthy()
    expect(bigFolder.folderSize.includes('KB')).toBe(true)

    nonexistentFolder.loadSync()

    expect(nonexistentFolder.files.length).toBe(0)
    expect(nonexistentFolder.folders.length).toBe(0)
    expect(nonexistentFolder.folderSize.includes('KB')).toBe(true)
  })

  it('should throw an internal server exception when trying to reload/recreate the file', async () => {
    try {
      await bigFolder.create()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder already exists')
    }

    try {
      await bigFolder.load()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder has been already loaded')
    }

    try {
      nonexistentFolder.createSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder already exists')
    }

    try {
      nonexistentFolder.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder has been already loaded')
    }
  })

  it('should be able to get the file information in JSON Format', async () => {
    expect(bigFolder.toJSON().name).toBeTruthy()
    expect(nonexistentFolder.toJSON().name).toBeTruthy()
  })

  it('should get all files and folders that match the pattern', async () => {
    const files = bigFolder
      .loadSync()
      .getFilesByPattern('tests/folder-class-test/**/*.txt', true)

    expect(files.length).toBe(3)

    files.forEach(file => expect(file.extension).toBe('.txt'))

    const folders = bigFolder.getFoldersByPattern(
      'tests/folder-class-test/big/*',
      true,
    )

    expect(folders.length).toBe(2)
    expect(folders[0].name).toBe('hello')
    expect(folders[1].name).toBe('nice')
  })

  it('should load all the files and subFolders with the files content', async () => {
    nonexistentFolder.createSync()

    createFileOfSize(nonexistentFolder.path + '/file.txt', 1024 * 1024 * 100)

    nonexistentFolder.loadSync({ withFileContent: true })

    expect(nonexistentFolder.files[0].base).toBe('file.txt')
    expect(nonexistentFolder.files[0].content).toBeTruthy()
  })

  afterEach(async () => {
    await promises.rmdir(bigFolder.dir, { recursive: true })
    await promises.rmdir(nonexistentFolder.dir, { recursive: true })

    bigFolder = null
    nonexistentFolder = null
  })
})

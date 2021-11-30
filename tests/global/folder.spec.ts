/* eslint-disable no-new */
/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import '../../src/utils/global'

import { existsSync, promises } from 'fs'
import { File } from '../../src/Classes/File'
import { Path } from '../../src/Classes/Path'

describe('\n Folder Class Global', () => {
  // 100 MB
  const size = 1024 * 1024 * 100

  let bigFolder: Folder = null
  let nonexistentFolder: Folder = null

  const bigFolderPath = Path.pwd('tests/folder-class-global-test/big')
  const nonexistentFolderPath = Path.pwd(
    'tests/folder-class-global-test/non-existent',
  )

  beforeEach(async () => {
    await File.createFileOfSize(bigFolderPath + '/file.txt', size)

    bigFolder = new Folder(bigFolderPath)

    await File.createFileOfSize(bigFolderPath + '/hello/file.txt', size)
    await File.createFileOfSize(bigFolderPath + '/hello/nice/file.txt', size)

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
      expect(error.content).toBe('Folder big already exists')
    }

    try {
      nonexistentFolder.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'Folder non-existent does not exist, use create method to create the folder',
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
      expect(error.content).toBe('Folder big already exists')
    }

    try {
      await bigFolder.load()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder big has been already loaded')
    }

    try {
      nonexistentFolder.createSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder non-existent already exists')
    }

    try {
      nonexistentFolder.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Folder non-existent has been already loaded')
    }
  })

  it('should be able to get the file information in JSON Format', async () => {
    expect(bigFolder.toJSON().name).toBeTruthy()
    expect(nonexistentFolder.toJSON().name).toBeTruthy()
  })

  it('should get all files and folders that match the pattern', async () => {
    const files = bigFolder.loadSync().getFilesByPattern('**/*.txt', true)

    expect(files.length).toBe(3)

    files.forEach(file => expect(file.extension).toBe('.txt'))

    const folders = bigFolder.getFoldersByPattern('*', true)

    expect(folders.length).toBe(1)
    expect(folders[0].name).toBe('hello')

    const folderSubFolder = bigFolder.getFoldersByPattern('**', true)

    expect(folderSubFolder.length).toBe(2)
    expect(folderSubFolder[0].name).toBe('hello')
    expect(folderSubFolder[1].name).toBe('nice')
  })

  it('should load all the files and subFolders with the files content', async () => {
    nonexistentFolder.createSync()

    await File.createFileOfSize(nonexistentFolder.path + '/file.txt', size)

    nonexistentFolder.loadSync({ withFileContent: true })

    expect(nonexistentFolder.files[0].base).toBe('file.txt')
    expect(nonexistentFolder.files[0].content).toBeTruthy()
  })

  it('should remove the folder and folder stats from instance', async () => {
    await nonexistentFolder.create()

    await File.createFileOfSize(nonexistentFolder.path + '/file.txt', size)

    await nonexistentFolder.load({ withFileContent: true })

    expect(nonexistentFolder.files[0].base).toBe('file.txt')
    expect(nonexistentFolder.files[0].content).toBeTruthy()

    await nonexistentFolder.remove()

    expect(nonexistentFolder.files.length).toBe(0)
    expect(nonexistentFolder.folders.length).toBe(0)
    expect(existsSync(nonexistentFolder.path)).toBe(false)
    expect(existsSync(nonexistentFolder.path + '/file.txt')).toBe(false)
  })

  it('should remove the folder and folder stats from instance', async () => {
    await nonexistentFolder.create()

    await File.createFileOfSize(nonexistentFolder.path + '/file.txt', size)

    await nonexistentFolder.load({ withFileContent: true })

    expect(nonexistentFolder.files[0].base).toBe('file.txt')
    expect(nonexistentFolder.files[0].content).toBeTruthy()

    await nonexistentFolder.remove()

    expect(nonexistentFolder.files.length).toBe(0)
    expect(nonexistentFolder.folders.length).toBe(0)
    expect(existsSync(nonexistentFolder.path)).toBe(false)
    expect(existsSync(nonexistentFolder.path + '/file.txt')).toBe(false)
  })

  it('should throw an internal server exception when trying to remove the file calling remove/removeSync again', async () => {
    await nonexistentFolder.create()

    await nonexistentFolder.load({ withFileContent: true })

    await nonexistentFolder.remove()

    try {
      await nonexistentFolder.remove()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'Folder non-existent does not exist, use create method to create the folder',
      )
    }
  })

  it('should be able to make a copy of the folder', async () => {
    await bigFolder.load({ withFileContent: false })

    const copyBigFolderPath = Path.pwd(
      'tests/folder-class-global-test/copy-big-folder',
    )
    const copyOfBigFolder = await bigFolder.copy(copyBigFolderPath, {
      withFileContent: true,
    })

    expect(existsSync(bigFolder.path)).toBeTruthy()
    expect(existsSync(copyOfBigFolder.path)).toBeTruthy()
    expect(copyOfBigFolder.files[0].content).toBeTruthy()
    expect(copyOfBigFolder.folders[0].name).toBeTruthy()

    nonexistentFolder.createSync()

    const copyNoExistFolderPath = Path.pwd(
      'tests/folder-class-global-test/copy-non-existent-folder',
    )
    const copyOfNoExistFolder = nonexistentFolder.copySync(
      copyNoExistFolderPath,
    )

    expect(existsSync(nonexistentFolder.path)).toBeTruthy()
    expect(existsSync(copyOfNoExistFolder.path)).toBeTruthy()
    expect(copyOfNoExistFolder.files.length).toBe(0)
    expect(copyOfNoExistFolder.folders.length).toBe(0)
  })

  it('should be able to move the folder', async () => {
    await bigFolder.load({ withFileContent: false })

    const copyBigFolderPath = Path.pwd(
      'tests/folder-class-global-test/move-big-folder',
    )
    const copyOfBigFolder = await bigFolder.move(copyBigFolderPath, {
      withFileContent: true,
    })

    expect(existsSync(bigFolder.path)).toBeFalsy()
    expect(existsSync(copyOfBigFolder.path)).toBeTruthy()
    expect(copyOfBigFolder.files[0].content).toBeTruthy()
    expect(copyOfBigFolder.folders[0].name).toBeTruthy()

    nonexistentFolder.createSync()

    const copyNoExistFolderPath = Path.pwd(
      'tests/folder-class-global-test/move-non-existent-folder',
    )
    const copyOfNoExistFolder = nonexistentFolder.moveSync(
      copyNoExistFolderPath,
    )

    expect(existsSync(nonexistentFolder.path)).toBeFalsy()
    expect(existsSync(copyOfNoExistFolder.path)).toBeTruthy()
    expect(copyOfNoExistFolder.files.length).toBe(0)
    expect(copyOfNoExistFolder.folders.length).toBe(0)
  })

  it('should throw errors when trying to copy/move folder that does not exist', async () => {
    try {
      nonexistentFolder.copySync('any/path')
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'Folder non-existent does not exist, use create method to create the folder',
      )
    }

    try {
      await nonexistentFolder.move('any/path')
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'Folder non-existent does not exist, use create method to create the folder',
      )
    }
  })

  afterEach(async () => {
    await promises.rmdir(bigFolder.dir, { recursive: true })
    await promises.rmdir(nonexistentFolder.dir, { recursive: true })

    unset(bigFolder)
    unset(nonexistentFolder)
  })
})

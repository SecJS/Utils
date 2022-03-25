/**
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { existsSync } from 'fs'
import { Path } from '../../src/Helpers/Path'
import { File } from '../../src/Helpers/File'
import { Folder } from '../../src/Helpers/Folder'

describe('\n File Class', () => {
  let bigFile: File = null
  let nonexistentFile: File = null

  const bigFilePath = Path.pwd('tests/file-class-test/file.txt')
  const nonexistentFilePath = Path.pwd('tests/file-class-test/non-existent.txt')

  beforeEach(async () => {
    await File.createFileOfSize(bigFilePath, 1024 * 1024 * 100)

    bigFile = new File(bigFilePath)
    nonexistentFile = new File(nonexistentFilePath, Buffer.from('Content'))
  })

  it('should generate an instance of a file, it existing or not', async () => {
    expect(bigFile.path).toBe(bigFilePath)
    expect(bigFile.mime).toBe('text/plain')
    expect(bigFile.originalPath).toBe(bigFilePath)
    expect(bigFile.originalFileExists).toBe(true)
    expect(bigFile.dir).toBe(bigFilePath.replace('/file.txt', ''))

    expect(nonexistentFile.base).toBeTruthy()
    expect(nonexistentFile.path).toBeTruthy()
    expect(nonexistentFile.mime).toBe('text/plain')
    expect(nonexistentFile.originalFileExists).toBe(false)
    expect(nonexistentFile.originalPath).toBe(nonexistentFilePath)
    expect(nonexistentFile.originalBase).toBe('non-existent.txt')
  })

  it('should create the file when it does not exist and throw errors if trying to create a file that already exists and load the files information', async () => {
    try {
      await bigFile.create()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileAlreadyExistException')
      expect(error.content).toBe('File file.txt already exists')
    }

    try {
      nonexistentFile.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileDoesntExistException')
      expect(error.content).toBe('File non-existent.txt does not exist')
    }

    nonexistentFile.createSync()

    expect(nonexistentFile.fileExists).toBe(true)
    expect(existsSync(nonexistentFile.path)).toBe(true)
    expect(nonexistentFile.originalFileExists).toBe(false)

    // LOAD

    expect(bigFile.content).toBeFalsy()
    await bigFile.load()

    expect(bigFile.content).toBeTruthy()
    expect(bigFile.fileSize.includes('MB')).toBe(true)

    expect(nonexistentFile.content).toBeFalsy()
    nonexistentFile.loadSync()

    expect(nonexistentFile.content).toBeTruthy()
    expect(nonexistentFile.fileSize.includes('B')).toBe(true)
  })

  it('should throw an internal server exception when trying to reload/recreate the file', async () => {
    try {
      await bigFile.create()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileAlreadyExistException')
      expect(error.content).toBe('File file.txt already exists')
    }

    try {
      await bigFile.load()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileWithoutContentException')
      expect(error.content).toBe('File file.txt has been already loaded')
    }

    try {
      nonexistentFile.createSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileAlreadyExistException')
      expect(error.content).toBe('File file.txt already exists')
    }

    try {
      nonexistentFile.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileAlreadyLoadedException')
      expect(error.content).toBe('File file.txt has been already loaded')
    }
  })

  it('should be able to get the file information in JSON Format', async () => {
    expect(bigFile.toJSON().name).toBeTruthy()
    expect(nonexistentFile.toJSON().name).toBeTruthy()
  })

  it('should be able to get the file content', async () => {
    expect(await bigFile.getContent()).toBeTruthy()

    try {
      nonexistentFile.getContentSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileDoesntExistException')
      expect(error.content).toBe('File non-existent.txt does not exist')
    }
  })

  it('should remove the files and remove file stats from instance', async () => {
    await bigFile.remove()

    expect(existsSync(bigFile.path)).toBe(false)

    nonexistentFile.createSync()
    nonexistentFile.removeSync()

    expect(existsSync(nonexistentFile.path)).toBe(false)

    try {
      await bigFile.create()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileWithoutContentException')
      expect(error.content).toBe(
        'Cannot create the file file.txt without content',
      )
    }

    try {
      nonexistentFile.createSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileWithoutContentException')
      expect(error.content).toBe(
        'Cannot create the file non-existent.txt without content',
      )
    }
  })

  it('should throw an internal server exception when trying to remove the file calling remove/removeSync again', async () => {
    bigFile.removeSync()

    try {
      bigFile.removeSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileDoesntExistException')
      expect(error.content).toBe('File file.txt does not exist')
    }

    try {
      await nonexistentFile.remove()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileDoesntExistException')
      expect(error.content).toBe('File non-existent.txt does not exist')
    }
  })

  it('should be able to make a copy of the file', async () => {
    await bigFile.load()

    const copyBigFilePath = Path.pwd('tests/file-class-test/copy-big-file.txt')
    const copyOfBigFile = await bigFile.copy(copyBigFilePath, {
      withContent: false,
    })

    expect(existsSync(bigFile.path)).toBeTruthy()
    expect(existsSync(copyOfBigFile.path)).toBeTruthy()
    expect(copyOfBigFile.content).toBeFalsy()

    nonexistentFile.createSync()

    const copyNoExistFilePath = Path.pwd(
      'tests/file-class-test/copy-non-existent-file.txt',
    )
    const copyOfNoExistFile = nonexistentFile.copySync(copyNoExistFilePath)

    expect(copyOfNoExistFile.content).toBeFalsy()

    copyOfNoExistFile.loadSync()

    expect(existsSync(nonexistentFile.path)).toBeTruthy()
    expect(existsSync(copyOfNoExistFile.path)).toBeTruthy()
    expect(copyOfNoExistFile.content).toBeTruthy()
  })

  it('should be able to move the file', async () => {
    await bigFile.load()

    const moveBigFilePath = Path.pwd('tests/file-class-test/move-big-file.txt')
    const moveOfBigFile = await bigFile.move(moveBigFilePath, {
      withContent: false,
    })

    expect(existsSync(bigFile.path)).toBeFalsy()
    expect(existsSync(moveOfBigFile.path)).toBeTruthy()
    expect(moveOfBigFile.content).toBeFalsy()

    nonexistentFile.createSync()

    const moveNoExistFilePath = Path.pwd(
      'tests/file-class-test/move-non-existent-file.txt',
    )
    const moveOfNoExistFile = nonexistentFile.moveSync(moveNoExistFilePath)

    expect(moveOfNoExistFile.content).toBeFalsy()

    moveOfNoExistFile.loadSync()

    expect(existsSync(nonexistentFile.path)).toBeFalsy()
    expect(existsSync(moveOfNoExistFile.path)).toBeTruthy()
    expect(moveOfNoExistFile.content).toBeTruthy()
  })

  it('should throw errors when trying to copy/move files that does not exist', async () => {
    try {
      nonexistentFile.copySync('any/path')
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileDoesntExistException')
      expect(error.content).toBe('File non-existent.txt does not exist')
    }

    try {
      await nonexistentFile.move('any/path')
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.name).toBe('FileDoesntExistException')
      expect(error.content).toBe('File non-existent.txt does not exist')
    }
  })

  afterEach(async () => {
    await Folder.safeRemove(bigFile.dir)
    await Folder.safeRemove(nonexistentFile.dir)

    bigFile = null
    nonexistentFile = null
  })
})
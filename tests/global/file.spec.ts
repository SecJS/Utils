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

describe('\n File Class Global', () => {
  let bigFile: File = null
  let nonexistentFile: File = null

  const bigFilePath = Path.pwd('tests/file-class-global-test/file.txt')
  const nonexistentFilePath = Path.pwd(
    'tests/file-class-global-test/non-existent.txt',
  )

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
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File already exists')
    }

    try {
      nonexistentFile.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'File does not exist, use create method to create the file',
      )
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
    expect(nonexistentFile.fileSize.includes('Bytes')).toBe(true)
  })

  it('should throw an internal server exception when trying to reload/recreate the file', async () => {
    try {
      await bigFile.create()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File already exists')
    }

    try {
      await bigFile.load()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File has been already loaded')
    }

    try {
      nonexistentFile.createSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File already exists')
    }

    try {
      nonexistentFile.loadSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File has been already loaded')
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
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe(
        'File does not exist, use create method to create the file',
      )
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
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Cannot create a file without content')
    }

    try {
      nonexistentFile.createSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('Cannot create a file without content')
    }
  })

  it('should throw an internal server exception when trying to remove the file calling remove/removeSync again', async () => {
    bigFile.removeSync()

    try {
      bigFile.removeSync()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File does not exist')
    }

    try {
      await nonexistentFile.remove()
    } catch (error) {
      expect(error.status).toBe(500)
      expect(error.isSecJsException).toBe(true)
      expect(error.name).toBe('InternalServerException')
      expect(error.content).toBe('File does not exist')
    }
  })

  it('should load the file but without content', async () => {
    await bigFile.load({ withContent: false })

    expect(bigFile.content).toBeFalsy()

    nonexistentFile.createSync().loadSync({ withContent: false })

    expect(nonexistentFile.content).toBeFalsy()
  })

  afterEach(async () => {
    await promises.rmdir(bigFile.dir, { recursive: true })
    await promises.rmdir(nonexistentFile.dir, { recursive: true })

    unset(bigFile)
    unset(nonexistentFile)
  })
})

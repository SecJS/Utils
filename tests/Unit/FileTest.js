/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Path } from '#src/Path'
import { File } from '#src/File'
import { Folder } from '#src/Folder'
import { NotFoundFileException } from '#src/Exceptions/NotFoundFileException'

describe('\n FileTest', () => {
  /** @type {File} */
  let bigFile = null

  /** @type {File} */
  let nonexistentFile = null

  const bigFilePath = Path.storage('files/file.txt')
  const nonexistentFilePath = Path.storage('files/non-existent.txt')

  beforeEach(async () => {
    await File.safeRemove(bigFilePath)
    await File.safeRemove(nonexistentFilePath)
    await Folder.safeRemove(Path.storage())

    await File.createFileOfSize(bigFilePath, 1024 * 1024 * 100)

    bigFile = new File(bigFilePath)
    nonexistentFile = new File(nonexistentFilePath, Buffer.from('Content'))
  })

  it('should be able to verify if path is from file or directory', async () => {
    expect(await File.isFile('../../tests')).toBeFalsy()
    expect(await File.isFile('../../package.json')).toBeTruthy()

    expect(File.isFileSync('../../tests')).toBeFalsy()
    expect(File.isFileSync('../../package.json')).toBeTruthy()
  })

  it('should be able to create files with mocked values', async () => {
    const mockedFile = new File(Path.storage('files/testing/.js'), Buffer.from('Content'), true)

    expect(mockedFile.name).toBeTruthy()
    expect(mockedFile.name).not.toBe('.js')
    expect(mockedFile.name).not.toBe('testing')
  })

  it('should throw an error when trying to create an instance of a file that doesnt exist', async () => {
    const useCase = () => new File(Path.pwd('not-found.txt'))

    expect(useCase).toThrow(NotFoundFileException)
  })

  it('should be able to generate instance of files using relative paths', async () => {
    const relativePathFile = new File('../../package.json')

    expect(relativePathFile.fileExists).toBe(true)
    expect(relativePathFile.base).toBe('package.json')
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

  it('should only load the bigFile because it already exists', async () => {
    expect(bigFile.content).toBeFalsy()
    expect(bigFile.fileExists).toBe(true)

    // Load the file because it already exists.
    bigFile.loadSync({ withContent: true })

    expect(bigFile.content).toBeTruthy()
    expect(bigFile.originalFileExists).toBe(true)
    expect(bigFile.fileSize.includes('MB')).toBe(true)
    expect(await File.exists(bigFile.path)).toBe(true)
  })

  it('should create the nonexistentFile because it doesnt exists', async () => {
    expect(nonexistentFile.content).toBeTruthy()
    expect(nonexistentFile.fileExists).toBe(false)

    // Create the file because it doesn't exist.
    await nonexistentFile.load({ withContent: true })

    expect(nonexistentFile.content).toBeTruthy()
    expect(nonexistentFile.fileExists).toBe(true)
    expect(nonexistentFile.originalFileExists).toBe(false)
    expect(nonexistentFile.fileSize.includes('B')).toBe(true)
    expect(await File.exists(nonexistentFile.path)).toBe(true)
  })

  it('should be able to get the file information in JSON Format', async () => {
    expect(bigFile.toJSON().name).toBe(bigFile.name)
    expect(nonexistentFile.toJSON().name).toBe(nonexistentFile.name)
  })

  it('should be able to remove files', async () => {
    await bigFile.remove()

    expect(await File.exists(bigFile.path)).toBe(false)
  })

  it('should throw an not found exception when trying to remove bigFile', async () => {
    await bigFile.remove()

    const useCase = async () => await bigFile.remove()

    await expect(useCase()).rejects.toThrow(NotFoundFileException)
  })

  it('should throw an not found exception when trying to remove nonExistentFile', async () => {
    const useCase = () => nonexistentFile.removeSync()

    expect(useCase).toThrow(NotFoundFileException)
  })

  it('should be able to make a copy of the file', async () => {
    const copyOfBigFile = await bigFile.copy(Path.storage('files/testing/copy-big-file.txt'), {
      withContent: false,
    })

    expect(await File.exists(bigFile.path)).toBeTruthy()
    expect(await File.exists(copyOfBigFile.path)).toBeTruthy()
    expect(copyOfBigFile.content).toBeFalsy()
    expect(copyOfBigFile.isCopy).toBeTruthy()

    const copyOfNoExistFile = nonexistentFile.copySync(Path.storage('testing/copy-non-existent-file.txt'))

    expect(await File.exists(nonexistentFile.path)).toBeTruthy()
    expect(await File.exists(copyOfNoExistFile.path)).toBeTruthy()
    expect(copyOfNoExistFile.content).toBeTruthy()
    expect(copyOfNoExistFile.isCopy).toBeTruthy()
  })

  it('should be able to move the file', async () => {
    const moveOfBigFile = await bigFile.move(Path.storage('testing/move-big-file.txt'), {
      withContent: false,
    })

    expect(await File.exists(bigFile.path)).toBeFalsy()
    expect(await File.exists(moveOfBigFile.path)).toBeTruthy()
    expect(moveOfBigFile.content).toBeFalsy()

    const moveOfNoExistFile = nonexistentFile.moveSync(Path.storage('testing/move-non-existent-file.txt'))

    expect(await File.exists(nonexistentFile.path)).toBeFalsy()
    expect(await File.exists(moveOfNoExistFile.path)).toBeTruthy()
    expect(moveOfNoExistFile.content).toBeTruthy()
  })

  it('should be able to append data to the file', async () => {
    await bigFile.append('Hello World!')
    nonexistentFile.appendSync('Hello World!')

    const bigFileContent = await bigFile.getContent()
    const nonexistentFileContent = nonexistentFile.getContentSync()

    expect(bigFileContent.toString().endsWith('Hello World!')).toBeTruthy()
    expect(nonexistentFileContent.toString().endsWith('Hello World!')).toBeTruthy()
  })

  it('should be able to prepend data to the file', async () => {
    await bigFile.prepend('Hello World!')
    nonexistentFile.prependSync('Hello World!')

    const bigFileContent = await bigFile.getContent()
    const nonexistentFileContent = nonexistentFile.getContentSync()

    expect(bigFileContent.toString().startsWith('Hello World!')).toBeTruthy()
    expect(nonexistentFileContent.toString().startsWith('Hello World!')).toBeTruthy()
  })

  it('should be able to get the file content separately', async () => {
    const bigFileContent = await bigFile.getContent()
    const nonexistentFileContent = nonexistentFile.getContentSync({ saveContent: true })

    nonexistentFile.content = null
    await nonexistentFile.getContent({ saveContent: true })
    await nonexistentFile.getContent({ saveContent: true })

    expect(bigFileContent).toBeInstanceOf(Buffer)
    expect(nonexistentFileContent).toBeInstanceOf(Buffer)
  })

  afterEach(async () => {
    await File.safeRemove(bigFilePath)
    await File.safeRemove(nonexistentFilePath)
    await Folder.safeRemove(Path.storage())

    bigFile = null
    nonexistentFile = null
  })
})

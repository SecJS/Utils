/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'

import { Path } from '#src/Helpers/Path'
import { File } from '#src/Helpers/File'
import { Folder } from '#src/Helpers/Folder'
import { NotFoundFolderException } from '#src/Exceptions/NotFoundFolderException'

describe('\n FolderTest', () => {
  /** @type {Folder} */
  let bigFolder = null

  /** @type {Folder} */
  let nonexistentFolder = null

  // 100MB
  const size = 1024 * 1024 * 100

  const bigFolderPath = Path.storage('folders/bigFolder')
  const nonexistentFolderPath = Path.storage('folders/nonExistent')

  beforeEach(async () => {
    await Folder.safeRemove(Path.storage())

    await File.createFileOfSize(bigFolderPath.concat('/file.txt'), size)

    bigFolder = new Folder(bigFolderPath)

    await File.createFileOfSize(bigFolderPath.concat('/hello/file.txt'), size)
    await File.createFileOfSize(bigFolderPath.concat('/hello/nice/file.txt'), size)

    nonexistentFolder = new Folder(nonexistentFolderPath)
  })

  it('should be able to verify if path is from folder or file', async () => {
    expect(await Folder.isFolder('../../tests')).toBeTruthy()
    expect(await Folder.isFolder('../../package.json')).toBeFalsy()

    expect(Folder.isFolderSync('../../tests')).toBeTruthy()
    expect(Folder.isFolderSync('../../package.json')).toBeFalsy()
  })

  it('should be able to create folders with mocked values', async () => {
    const mockedFolder = new Folder(Path.storage('folders/testing'), true)

    expect(mockedFolder.name).toBeTruthy()
    expect(mockedFolder.name).not.toBe('testing')
  })

  it('should be able to generate instance of folders using relative paths', async () => {
    const relativePathFolder = new Folder('../../tests')

    expect(relativePathFolder.folderExists).toBe(true)
    expect(relativePathFolder.name).toBe('tests')
  })

  it('should generate an instance of a folder, it existing or not', async () => {
    expect(bigFolder.path).toBe(bigFolderPath)
    expect(bigFolder.originalPath).toBe(bigFolderPath)
    expect(bigFolder.originalFolderExists).toBe(true)
    expect(bigFolder.dir).toBe(bigFolderPath.replace(`${sep}bigFolder`, ''))

    expect(nonexistentFolder.path).toBeTruthy()
    expect(nonexistentFolder.originalFolderExists).toBe(false)
    expect(nonexistentFolder.originalPath).toBe(nonexistentFolderPath)
  })

  it('should only load the bigFolder because it already exists', async () => {
    expect(bigFolder.folderSize).toBeFalsy()
    expect(bigFolder.folderExists).toBe(true)

    // Load the folder because it already exists.
    bigFolder.loadSync({ withSub: true, withFileContent: true })

    expect(bigFolder.folderSize).toBeTruthy()
    expect(bigFolder.originalFolderExists).toBe(true)
    expect(bigFolder.folderSize.includes('MB')).toBe(true)
    expect(await Folder.exists(bigFolder.path)).toBe(true)
  })

  it('should create the nonexistentFolder because it doesnt exists', async () => {
    expect(nonexistentFolder.folderSize).toBeFalsy()
    expect(nonexistentFolder.folderExists).toBe(false)

    // Create the folder because it doesn't exist.
    await nonexistentFolder.load({ withSub: true, withFileContent: true })

    expect(nonexistentFolder.folderSize).toBeTruthy()
    expect(nonexistentFolder.folderExists).toBe(true)
    expect(nonexistentFolder.originalFolderExists).toBe(false)
    expect(nonexistentFolder.folderSize.includes('B')).toBe(true)
    expect(await Folder.exists(nonexistentFolder.path)).toBe(true)
  })

  it('should be able to get the folder information in JSON Format', async () => {
    bigFolder.loadSync()

    expect(bigFolder.toJSON().name).toBe(bigFolder.name)
    expect(nonexistentFolder.toJSON().name).toBe(nonexistentFolder.name)
  })

  it('should be able to remove folders', async () => {
    await bigFolder.remove()

    expect(await Folder.exists(bigFolder.path)).toBe(false)
  })

  it('should throw an not found exception when trying to remove bigFolder', async () => {
    await bigFolder.remove()

    const useCase = async () => await bigFolder.remove()

    await expect(useCase()).rejects.toThrow(NotFoundFolderException)
  })

  it('should throw an not found exception when trying to remove nonExistentFolder', async () => {
    const useCase = () => nonexistentFolder.removeSync()

    expect(useCase).toThrow(NotFoundFolderException)
  })

  it('should be able to make a copy of the folder', async () => {
    const copyOfBigFolder = await bigFolder.copy(Path.storage('folders/testing/copy-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    bigFolder.removeSync()

    expect(await Folder.exists(copyOfBigFolder.path)).toBeTruthy()

    expect(await File.exists(copyOfBigFolder.files[0].path)).toBeTruthy()
    expect(copyOfBigFolder.files[0].name).toBeTruthy()

    expect(await Folder.exists(copyOfBigFolder.folders[0].path)).toBeTruthy()
    expect(copyOfBigFolder.folders[0].name).toBeTruthy()

    expect(await File.exists(copyOfBigFolder.folders[0].files[0].path)).toBeTruthy()
    expect(copyOfBigFolder.folders[0].files[0].name).toBeTruthy()

    const copyOfNoExistFolder = await nonexistentFolder.copy(Path.storage('folders/testing/copy-non-existent-folder'))

    expect(await Folder.exists(copyOfNoExistFolder.path)).toBeTruthy()
  })

  it('should be able to make a copy in sync mode of the folder', async () => {
    const copyOfBigFolder = bigFolder.copySync(Path.storage('folders/testing/copy-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    bigFolder.removeSync()

    expect(await Folder.exists(copyOfBigFolder.path)).toBeTruthy()

    expect(await File.exists(copyOfBigFolder.files[0].path)).toBeTruthy()
    expect(copyOfBigFolder.files[0].name).toBeTruthy()

    expect(await Folder.exists(copyOfBigFolder.folders[0].path)).toBeTruthy()
    expect(copyOfBigFolder.folders[0].name).toBeTruthy()

    expect(await File.exists(copyOfBigFolder.folders[0].files[0].path)).toBeTruthy()
    expect(copyOfBigFolder.folders[0].files[0].name).toBeTruthy()

    const copyOfNoExistFolder = nonexistentFolder.copySync(Path.storage('folders/testing/copy-non-existent-folder'))

    expect(await Folder.exists(copyOfNoExistFolder.path)).toBeTruthy()
  })

  it('should be able to move the folder', async () => {
    const moveOfBigFolder = await bigFolder.move(Path.storage('folders/testing/move-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    expect(await Folder.exists(bigFolder.path)).toBeFalsy()
    expect(await Folder.exists(moveOfBigFolder.path)).toBeTruthy()

    expect(await File.exists(moveOfBigFolder.files[0].path)).toBeTruthy()
    expect(moveOfBigFolder.files[0].name).toBeTruthy()

    expect(await Folder.exists(moveOfBigFolder.folders[0].path)).toBeTruthy()
    expect(moveOfBigFolder.folders[0].name).toBeTruthy()

    expect(await File.exists(moveOfBigFolder.folders[0].files[0].path)).toBeTruthy()
    expect(moveOfBigFolder.folders[0].files[0].name).toBeTruthy()

    const moveOfNoExistFolder = await nonexistentFolder.move(Path.storage('folders/testing/move-non-existent-folder'))

    expect(await Folder.exists(nonexistentFolder.path)).toBeFalsy()
    expect(await Folder.exists(moveOfNoExistFolder.path)).toBeTruthy()
  })

  it('should be able to move the folder in sync mode', async () => {
    const moveOfBigFolder = await bigFolder.moveSync(Path.storage('folders/testing/move-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    expect(await Folder.exists(bigFolder.path)).toBeFalsy()
    expect(await Folder.exists(moveOfBigFolder.path)).toBeTruthy()

    expect(await File.exists(moveOfBigFolder.files[0].path)).toBeTruthy()
    expect(moveOfBigFolder.files[0].name).toBeTruthy()

    expect(await Folder.exists(moveOfBigFolder.folders[0].path)).toBeTruthy()
    expect(moveOfBigFolder.folders[0].name).toBeTruthy()

    expect(await File.exists(moveOfBigFolder.folders[0].files[0].path)).toBeTruthy()
    expect(moveOfBigFolder.folders[0].files[0].name).toBeTruthy()

    const moveOfNoExistFolder = nonexistentFolder.moveSync(Path.storage('folders/testing/move-non-existent-folder'))

    expect(await Folder.exists(nonexistentFolder.path)).toBeFalsy()
    expect(await Folder.exists(moveOfNoExistFolder.path)).toBeTruthy()
  })

  it('should get all files/folders that match the pattern', async () => {
    const path = bigFolderPath.concat(sep, 'folder')

    await File.createFileOfSize(path.concat('/file.txt'), 1024 * 1024)

    new Folder(path.concat('/A')).loadSync()
    new Folder(path.concat('/A', '/B')).loadSync()

    await File.createFileOfSize(path.concat('/A', '/B', '/file.txt'), 1024 * 1024)

    const folder = new Folder(path)

    const files = folder.getFilesByPattern('**/*.txt')
    const folders = folder.getFoldersByPattern('**/*')

    expect(files.length).toBe(1)
    expect(folders.length).toBe(1)
  })

  it('should be able to get all files/folders without any pattern', async () => {
    const path = bigFolderPath.concat(sep, 'folder')

    await File.createFileOfSize(path.concat('/file.txt'), 1024 * 1024)

    new Folder(path.concat('/A')).loadSync()
    new Folder(path.concat('/A', '/B')).loadSync()

    await File.createFileOfSize(path.concat('/A', '/B', '/file.txt'), 1024 * 1024)

    const folder = new Folder(path)

    const files = folder.getFilesByPattern()
    const folders = folder.getFoldersByPattern()

    expect(files.length).toBe(1)
    expect(folders.length).toBe(1)
  })

  it('should get all files/folders recursively that match the pattern', async () => {
    const path = bigFolderPath.concat(sep, 'folder')

    await new Folder(path.concat('/A')).load({ withSub: false })
    new Folder(path.concat('/B')).loadSync({ withSub: false })
    new Folder(path.concat('/C')).loadSync()
    new Folder(path.concat('/C', '/D')).loadSync()
    new Folder(path.concat('/C', '/D', '/E')).loadSync()

    const size = 1024 * 1024

    await File.createFileOfSize(path.concat('/A', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/B', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/C', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/C', '/D', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/C', '/D', '/E', '/file.txt'), size)

    const folder = new Folder(path)

    expect(folder.getFilesByPattern('**/*.txt', true).length).toBe(5)
    expect(folder.getFoldersByPattern('**/*', true).length).toBe(5)

    expect(folder.getFilesByPattern('*/*.txt', true).length).toBe(3)
    expect(folder.getFoldersByPattern('*', true).length).toBe(3)
  })

  it('should be able to get all files/folders recursively without any pattern', async () => {
    const path = bigFolderPath.concat(sep, 'folder')

    await new Folder(path.concat('/A')).load({ withSub: false })
    new Folder(path.concat('/B')).loadSync({ withSub: false })
    new Folder(path.concat('/C')).loadSync()
    new Folder(path.concat('/C', '/D')).loadSync()
    new Folder(path.concat('/C', '/D', '/E')).loadSync()

    const size = 1024 * 1024

    await File.createFileOfSize(path.concat('/A', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/B', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/C', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/C', '/D', '/file.txt'), size)
    await File.createFileOfSize(path.concat('/C', '/D', '/E', '/file.txt'), size)

    const folder = new Folder(path)

    const files = folder.getFilesByPattern(null, true)
    const folders = folder.getFoldersByPattern(null, true)

    expect(files.length).toBe(5)
    expect(folders.length).toBe(5)
  })

  afterEach(async () => {
    await Folder.safeRemove(Path.storage())

    bigFolder = null
    nonexistentFolder = null
  })
})

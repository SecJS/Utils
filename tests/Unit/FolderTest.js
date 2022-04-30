/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { sep } from 'node:path'
import { test } from '@japa/runner'

import { Path, File, Folder } from '#src/index'
import { NotFoundFolderException } from '#src/Exceptions/NotFoundFolderException'

test.group('FolderTest', group => {
  /** @type {Folder} */
  let bigFolder = null

  /** @type {Folder} */
  let nonexistentFolder = null

  // 100MB
  const size = 1024 * 1024 * 100

  const bigFolderPath = Path.storage('folders/bigFolder')
  const nonexistentFolderPath = Path.storage('folders/nonExistent')

  group.each.setup(async () => {
    await Folder.safeRemove(Path.storage())

    await File.createFileOfSize(bigFolderPath.concat('/file.txt'), size)

    bigFolder = new Folder(bigFolderPath)

    await File.createFileOfSize(bigFolderPath.concat('/hello/file.txt'), size)
    await File.createFileOfSize(bigFolderPath.concat('/hello/nice/file.txt'), size)

    nonexistentFolder = new Folder(nonexistentFolderPath)
  })

  group.each.teardown(async () => {
    await Folder.safeRemove(Path.storage())

    bigFolder = null
    nonexistentFolder = null
  })

  test('should be able to verify if path is from folder or file', async ({ assert }) => {
    assert.isTrue(await Folder.isFolder('../../tests'))
    assert.isFalse(await Folder.isFolder('../../package.json'))

    assert.isTrue(Folder.isFolderSync('../../tests'))
    assert.isFalse(Folder.isFolderSync('../../package.json'))
  })

  test('should be able to create folders with mocked values', async ({ assert }) => {
    const mockedFolder = new Folder(Path.storage('folders/testing'), true)

    assert.isDefined(mockedFolder.name)
    assert.notEqual(mockedFolder.name, 'testing')
  })

  test('should be able to generate instance of folders using relative paths', async ({ assert }) => {
    const relativePathFolder = new Folder('../../tests')

    assert.isTrue(relativePathFolder.folderExists)
    assert.equal(relativePathFolder.name, 'tests')
  })

  test('should generate an instance of a folder, it existing or not', async ({ assert }) => {
    assert.equal(bigFolder.path, bigFolderPath)
    assert.equal(bigFolder.originalPath, bigFolderPath)
    assert.isTrue(bigFolder.originalFolderExists)
    assert.equal(bigFolder.dir, bigFolderPath.replace(`${sep}bigFolder`, ''))

    assert.isDefined(nonexistentFolder.path)
    assert.isFalse(nonexistentFolder.originalFolderExists)
    assert.equal(nonexistentFolder.originalPath, nonexistentFolderPath)
  })

  test('should only load the bigFolder because it already exists', async ({ assert }) => {
    assert.isUndefined(bigFolder.folderSize)
    assert.isTrue(bigFolder.folderExists)

    // Load the folder because it already exists.
    bigFolder.loadSync({ withSub: true, withFileContent: true })

    assert.isDefined(bigFolder.folderSize)
    assert.isTrue(bigFolder.originalFolderExists)
    assert.isTrue(bigFolder.folderSize.includes('MB'))
    assert.isTrue(await Folder.exists(bigFolder.path))
  })

  test('should create the nonexistentFolder because it doesnt exists', async ({ assert }) => {
    assert.isUndefined(nonexistentFolder.folderSize)
    assert.isFalse(nonexistentFolder.folderExists)

    // Create the folder because it doesn't exist.
    await nonexistentFolder.load({ withSub: true, withFileContent: true })

    assert.isDefined(nonexistentFolder.folderSize)
    assert.isTrue(nonexistentFolder.folderExists)
    assert.isFalse(nonexistentFolder.originalFolderExists)
    assert.isTrue(nonexistentFolder.folderSize.includes('B'))
    assert.isTrue(await Folder.exists(nonexistentFolder.path))
  })

  test('should be able to get the folder information in JSON Format', async ({ assert }) => {
    bigFolder.loadSync()

    assert.equal(bigFolder.toJSON().name, bigFolder.name)
    assert.equal(nonexistentFolder.toJSON().name, nonexistentFolder.name)
  })

  test('should be able to remove folders', async ({ assert }) => {
    await bigFolder.remove()

    assert.isFalse(await Folder.exists(bigFolder.path))
  })

  test('should throw an not found exception when trying to remove bigFolder', async ({ assert }) => {
    await bigFolder.remove()

    const useCase = async () => await bigFolder.remove()

    await assert.rejects(useCase, NotFoundFolderException)
  })

  test('should throw an not found exception when trying to remove nonExistentFolder', async ({ assert }) => {
    const useCase = () => nonexistentFolder.removeSync()

    assert.throws(useCase, NotFoundFolderException)
  })

  test('should be able to make a copy of the folder', async ({ assert }) => {
    const copyOfBigFolder = await bigFolder.copy(Path.storage('folders/testing/copy-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    bigFolder.removeSync()

    assert.isTrue(await Folder.exists(copyOfBigFolder.path))

    assert.isTrue(await File.exists(copyOfBigFolder.files[0].path))
    assert.isDefined(copyOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(copyOfBigFolder.folders[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(copyOfBigFolder.folders[0].files[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].files[0].name)

    const copyOfNoExistFolder = await nonexistentFolder.copy(Path.storage('folders/testing/copy-non-existent-folder'))

    assert.isTrue(await Folder.exists(copyOfNoExistFolder.path))
  })

  test('should be able to make a copy in sync mode of the folder', async ({ assert }) => {
    const copyOfBigFolder = bigFolder.copySync(Path.storage('folders/testing/copy-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    bigFolder.removeSync()

    assert.isTrue(await Folder.exists(copyOfBigFolder.path))

    assert.isTrue(await File.exists(copyOfBigFolder.files[0].path))
    assert.isDefined(copyOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(copyOfBigFolder.folders[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(copyOfBigFolder.folders[0].files[0].path))
    assert.isDefined(copyOfBigFolder.folders[0].files[0].name)

    const copyOfNoExistFolder = nonexistentFolder.copySync(Path.storage('folders/testing/copy-non-existent-folder'))

    assert.isTrue(await Folder.exists(copyOfNoExistFolder.path))
  })

  test('should be able to move the folder', async ({ assert }) => {
    const moveOfBigFolder = await bigFolder.move(Path.storage('folders/testing/move-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    assert.isFalse(await Folder.exists(bigFolder.path))
    assert.isTrue(await Folder.exists(moveOfBigFolder.path))

    assert.isTrue(await File.exists(moveOfBigFolder.files[0].path))
    assert.isDefined(moveOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(moveOfBigFolder.folders[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(moveOfBigFolder.folders[0].files[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].files[0].name)

    const moveOfNoExistFolder = await nonexistentFolder.move(Path.storage('folders/testing/move-non-existent-folder'))

    assert.isFalse(await Folder.exists(nonexistentFolder.path))
    assert.isTrue(await Folder.exists(moveOfNoExistFolder.path))
  })

  test('should be able to move the folder in sync mode', async ({ assert }) => {
    const moveOfBigFolder = await bigFolder.moveSync(Path.storage('folders/testing/move-big-folder'), {
      withSub: true,
      withFileContent: false,
    })

    assert.isFalse(await Folder.exists(bigFolder.path))
    assert.isTrue(await Folder.exists(moveOfBigFolder.path))

    assert.isTrue(await File.exists(moveOfBigFolder.files[0].path))
    assert.isDefined(moveOfBigFolder.files[0].name)

    assert.isTrue(await Folder.exists(moveOfBigFolder.folders[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].name)

    assert.isTrue(await File.exists(moveOfBigFolder.folders[0].files[0].path))
    assert.isDefined(moveOfBigFolder.folders[0].files[0].name)

    const moveOfNoExistFolder = nonexistentFolder.moveSync(Path.storage('folders/testing/move-non-existent-folder'))

    assert.isFalse(await Folder.exists(nonexistentFolder.path))
    assert.isTrue(await Folder.exists(moveOfNoExistFolder.path))
  })

  test('should get all files/folders that match the pattern', async ({ assert }) => {
    const path = bigFolderPath.concat(sep, 'folder')

    await File.createFileOfSize(path.concat('/file.txt'), 1024 * 1024)

    new Folder(path.concat('/A')).loadSync()
    new Folder(path.concat('/A', '/B')).loadSync()

    await File.createFileOfSize(path.concat('/A', '/B', '/file.txt'), 1024 * 1024)

    const folder = new Folder(path)

    const files = folder.getFilesByPattern('**/*.txt')
    const folders = folder.getFoldersByPattern('**/*')

    assert.lengthOf(files, 1)
    assert.lengthOf(folders, 1)
  })

  test('should be able to get all files/folders without any pattern', async ({ assert }) => {
    const path = bigFolderPath.concat(sep, 'folder')

    await File.createFileOfSize(path.concat('/file.txt'), 1024 * 1024)

    new Folder(path.concat('/A')).loadSync()
    new Folder(path.concat('/A', '/B')).loadSync()

    await File.createFileOfSize(path.concat('/A', '/B', '/file.txt'), 1024 * 1024)

    const folder = new Folder(path)

    const files = folder.getFilesByPattern()
    const folders = folder.getFoldersByPattern()

    assert.lengthOf(files, 1)
    assert.lengthOf(folders, 1)
  })

  test('should get all files/folders recursively that match the pattern', async ({ assert }) => {
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

    assert.lengthOf(folder.getFilesByPattern('**/*.txt', true), 5)
    assert.lengthOf(folder.getFoldersByPattern('**/*', true), 5)

    assert.lengthOf(folder.getFilesByPattern('*/*.txt', true), 3)
    assert.lengthOf(folder.getFoldersByPattern('*', true), 3)
  })

  test('should be able to get all files/folders recursively without any pattern', async ({ assert }) => {
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

    assert.lengthOf(files, 5)
    assert.lengthOf(folders, 5)
  })
})

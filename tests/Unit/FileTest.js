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
import { File, Path, Folder } from '#src/index'
import { NotFoundFileException } from '#src/Exceptions/NotFoundFileException'

test.group('FileTest', group => {
  /** @type {File} */
  let bigFile = null

  /** @type {File} */
  let nonexistentFile = null

  const bigFilePath = Path.storage('files/file.txt')
  const nonexistentFilePath = Path.storage('files/non-existent.txt')

  group.each.setup(async () => {
    await File.safeRemove(bigFilePath)
    await File.safeRemove(nonexistentFilePath)
    await Folder.safeRemove(Path.storage())

    await File.createFileOfSize(bigFilePath, 1024 * 1024 * 100)

    bigFile = new File(bigFilePath)
    nonexistentFile = new File(nonexistentFilePath, Buffer.from('Content'))
  })

  group.each.teardown(async () => {
    await File.safeRemove(bigFilePath)
    await File.safeRemove(nonexistentFilePath)
    await Folder.safeRemove(Path.storage())

    bigFile = null
    nonexistentFile = null
  })

  test('should be able to verify if path is from file or directory', async ({ assert }) => {
    assert.isFalse(await File.isFile('../../tests'))
    assert.isTrue(await File.isFile('../../package.json'))

    assert.isFalse(File.isFileSync('../../tests'))
    assert.isTrue(File.isFileSync('../../package.json'))
  })

  test('should be able to create files with mocked values', async ({ assert }) => {
    const mockedFile = new File(Path.storage('files/testing/.js'), Buffer.from('Content'), true)

    assert.isDefined(mockedFile.name)
    assert.notEqual(mockedFile.name, '.js')
    assert.notEqual(mockedFile.name, 'testing')
  })

  test('should throw an error when trying to create an instance of a file that doesnt exist', async ({ assert }) => {
    const useCase = () => new File(Path.pwd('not-found.txt'))

    assert.throws(useCase, NotFoundFileException)
  })

  test('should be able to generate instance of files using relative paths', async ({ assert }) => {
    const relativePathFile = new File('../../package.json')

    assert.isTrue(relativePathFile.fileExists)
    assert.equal(relativePathFile.base, 'package.json')
  })

  test('should generate an instance of a file, it existing or not', async ({ assert }) => {
    assert.equal(bigFile.path, bigFilePath)
    assert.equal(bigFile.mime, 'text/plain')
    assert.equal(bigFile.originalPath, bigFilePath)
    assert.isTrue(bigFile.originalFileExists)
    assert.equal(bigFile.dir, bigFilePath.replace(`${sep}file.txt`, ''))

    assert.isDefined(nonexistentFile.base)
    assert.isDefined(nonexistentFile.path)
    assert.equal(nonexistentFile.mime, 'text/plain')
    assert.isFalse(nonexistentFile.originalFileExists)
    assert.equal(nonexistentFile.originalPath, nonexistentFilePath)
    assert.equal(nonexistentFile.originalBase, 'non-existent.txt')
  })

  test('should only load the bigFile because it already exists', async ({ assert }) => {
    assert.isUndefined(bigFile.content)
    assert.isTrue(bigFile.fileExists)

    // Load the file because it already exists.
    bigFile.loadSync({ withContent: true })

    assert.isDefined(bigFile.content)
    assert.isTrue(bigFile.originalFileExists)
    assert.isTrue(bigFile.fileSize.includes('MB'))
    assert.isTrue(await File.exists(bigFile.path))
  })

  test('should create the nonexistentFile because it doesnt exists', async ({ assert }) => {
    assert.isDefined(nonexistentFile.content)
    assert.isFalse(nonexistentFile.fileExists)

    // Create the file because it doesn't exist.
    await nonexistentFile.load({ withContent: true })

    assert.isDefined(nonexistentFile.content)
    assert.isTrue(nonexistentFile.fileExists)
    assert.isFalse(nonexistentFile.originalFileExists)
    assert.isTrue(nonexistentFile.fileSize.includes('B'))
    assert.isTrue(await File.exists(nonexistentFile.path))
  })

  test('should be able to get the file information in JSON Format', async ({ assert }) => {
    assert.equal(bigFile.toJSON().name, bigFile.name)
    assert.equal(nonexistentFile.toJSON().name, nonexistentFile.name)
  })

  test('should be able to remove files', async ({ assert }) => {
    await bigFile.remove()

    assert.isFalse(await File.exists(bigFile.path))
  })

  test('should throw an not found exception when trying to remove bigFile', async ({ assert }) => {
    await bigFile.remove()

    const useCase = async () => await bigFile.remove()

    await assert.rejects(useCase, NotFoundFileException)
  })

  test('should throw an not found exception when trying to remove nonExistentFile', async ({ assert }) => {
    const useCase = () => nonexistentFile.removeSync()

    assert.throws(useCase, NotFoundFileException)
  })

  test('should be able to make a copy of the file', async ({ assert }) => {
    const copyOfBigFile = await bigFile.copy(Path.storage('files/testing/copy-big-file.txt'), {
      withContent: false,
    })

    assert.isDefined(await File.exists(bigFile.path))
    assert.isDefined(await File.exists(copyOfBigFile.path))
    assert.isUndefined(copyOfBigFile.content)
    assert.isTrue(copyOfBigFile.isCopy)

    const copyOfNoExistFile = nonexistentFile.copySync(Path.storage('testing/copy-non-existent-file.txt'))

    assert.isDefined(await File.exists(nonexistentFile.path))
    assert.isDefined(await File.exists(copyOfNoExistFile.path))
    assert.isDefined(copyOfNoExistFile.content)
    assert.isTrue(copyOfNoExistFile.isCopy)
  })

  test('should be able to move the file', async ({ assert }) => {
    const moveOfBigFile = await bigFile.move(Path.storage('testing/move-big-file.txt'), {
      withContent: false,
    })

    assert.isFalse(await File.exists(bigFile.path))
    assert.isDefined(await File.exists(moveOfBigFile.path))
    assert.isUndefined(moveOfBigFile.content)

    const moveOfNoExistFile = nonexistentFile.moveSync(Path.storage('testing/move-non-existent-file.txt'))

    assert.isFalse(await File.exists(nonexistentFile.path))
    assert.isTrue(await File.exists(moveOfNoExistFile.path))
    assert.isDefined(moveOfNoExistFile.content)
  })

  test('should be able to append data to the file', async ({ assert }) => {
    await bigFile.append('Hello World!')
    nonexistentFile.appendSync('Hello World!')

    const bigFileContent = await bigFile.getContent()
    const nonexistentFileContent = nonexistentFile.getContentSync()

    assert.isTrue(bigFileContent.toString().endsWith('Hello World!'))
    assert.isTrue(nonexistentFileContent.toString().endsWith('Hello World!'))
  })

  test('should be able to prepend data to the file', async ({ assert }) => {
    await bigFile.prepend('Hello World!')
    nonexistentFile.prependSync('Hello World!')

    const bigFileContent = await bigFile.getContent()
    const nonexistentFileContent = nonexistentFile.getContentSync()

    assert.isTrue(bigFileContent.toString().startsWith('Hello World!'))
    assert.isTrue(nonexistentFileContent.toString().startsWith('Hello World!'))
  })

  test('should be able to get the file content separately', async ({ assert }) => {
    const bigFileContent = await bigFile.getContent()
    const nonexistentFileContent = nonexistentFile.getContentSync({ saveContent: true })

    nonexistentFile.content = null
    await nonexistentFile.getContent({ saveContent: true })
    await nonexistentFile.getContent({ saveContent: true })

    assert.instanceOf(bigFileContent, Buffer)
    assert.instanceOf(nonexistentFileContent, Buffer)
  })
})

/**
 * @secjs/utils
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exec, File, Folder, Path } from '#src/index'
import { NodeCommandException } from '#src/Exceptions/NodeCommandException'

test.group('ExecTest', group => {
  group.each.teardown(async () => {
    await Folder.safeRemove(Path.storage())
  })

  test('should be able to sleep the code for some ms', async () => {
    await Exec.sleep(10)
  })

  test('should be able to execute a command in the VM and get the stdout', async ({ assert }) => {
    const { stdout } = await Exec.command('ls')

    assert.isTrue(stdout.includes('README.md'))
  })

  test('should throw an node exec exception when command fails', async ({ assert }) => {
    const useCase = async () => await Exec.command('echo "error thrown" && exit 255')

    await assert.rejects(useCase, NodeCommandException)
  })

  test('should be able to execute a command that throws errors and ignore it', async ({ assert }) => {
    const { stdout } = await Exec.command('echo "error thrown" && exit 255', { ignoreErrors: true })

    assert.isTrue(stdout.includes('error thrown'))
  })

  test('should be able to download files', async ({ assert }) => {
    const file = await Exec.download('node.pkg', Path.storage('downloads'), 'https://nodejs.org/dist/latest/node.pkg')

    assert.equal(file.base, 'node.pkg')
    assert.isTrue(await File.exists(file.path))
  })

  test('should be able to paginate a collection of data', async ({ assert }) => {
    let i = 0
    const collection = []

    while (i < 10) {
      collection.push({
        joao: 'lenon',
        hello: 'world',
      })

      i++
    }

    const paginatedData = Exec.pagination(collection, collection.length + 1, {
      page: 0,
      limit: 10,
      resourceUrl: 'https://my-api.com/products',
    })

    assert.deepEqual(paginatedData.data, collection)
    assert.deepEqual(paginatedData.meta, {
      itemCount: 10,
      totalItems: 11,
      totalPages: 2,
      currentPage: 0,
      itemsPerPage: 10,
    })
    assert.deepEqual(paginatedData.links, {
      first: 'https://my-api.com/products?limit=10',
      previous: 'https://my-api.com/products?page=0&limit=10',
      next: 'https://my-api.com/products?page=1&limit=10',
      last: 'https://my-api.com/products?page=2&limit=10',
    })
  })
})

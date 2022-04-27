/**
 * @secjs/esm
 *
 * (c) João Lenon <lenonSec7@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec } from '#src/Exec'
import { Path } from '#src/Path'
import { File } from '#src/File'
import { NodeExecException } from '#src/Exceptions/NodeExecException'
import { Folder } from '#src/Folder'

describe('\n ExecTest', () => {
  it('should be able to sleep the code for some ms', async () => {
    await Exec.sleep(10)
  })

  it('should be able to execute a command in the VM and get the stdout', async () => {
    const { stdout } = await Exec.command('ls')

    expect(stdout.includes('README.md')).toBe(true)
  })

  it('should throw an node exec exception when command fails', async () => {
    const useCase = async () => await Exec.command('echo "error thrown" && exit 255')

    await expect(useCase).rejects.toThrow(NodeExecException)
  })

  it('should be able to execute a command that throws errors and ignore it', async () => {
    const { stdout } = await Exec.command('echo "error thrown" && exit 255', { ignoreErrors: true })

    expect(stdout.includes('error thrown')).toBe(true)
  })

  it('should be able to download files', async () => {
    const file = await Exec.download('node.pkg', Path.storage('downloads'), 'https://nodejs.org/dist/latest/node.pkg')

    expect(file.base).toBe('node.pkg')
    expect(await File.exists(file.path)).toBeTruthy()
  })

  it('should be able to paginate a collection of data', async () => {
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

    expect(paginatedData.data).toStrictEqual(collection)
    expect(paginatedData.meta).toStrictEqual({
      itemCount: 10,
      totalItems: 11,
      totalPages: 2,
      currentPage: 0,
      itemsPerPage: 10,
    })
    expect(paginatedData.links).toStrictEqual({
      first: 'https://my-api.com/products?limit=10',
      previous: 'https://my-api.com/products?page=0&limit=10',
      next: 'https://my-api.com/products?page=1&limit=10',
      last: 'https://my-api.com/products?page=2&limit=10',
    })
  })

  afterEach(async () => {
    await Folder.safeRemove(Path.storage())
  })
})

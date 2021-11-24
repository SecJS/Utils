/*
 * @secjs/utils
 *
 * (c) João Lenon <lenon@secjs.com.br>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { readFileSync, rmSync } from 'fs'
import { createFileOfSize } from '../../src/Functions/createFileOfSize'

describe('\n createFileOfSize Function', () => {
  const filePath = process.cwd() + 'test.txt'

  it('should create a file from any size', async () => {
    // 1 MB
    createFileOfSize(filePath, 1024 * 1024)

    expect(readFileSync(filePath)).toBeTruthy()
  })

  afterAll(() => rmSync(filePath))
})

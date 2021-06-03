import path from 'path'
import { fileExists } from '../../src/Functions/fileExists'

describe('\n fileExists Function', () => {
  it('should return true when the file exists and false when does not exist', async () => {
    const filePath = path.resolve(__dirname, 'fileExists.spec.ts')
    const wrongPath = path.resolve(__dirname, 'fileExists.spec.tsss')

    expect(await fileExists(filePath)).toBe(true)
    expect(await fileExists(wrongPath)).toBe(false)
  })
})

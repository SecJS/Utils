import { getFiles } from '../../src/Functions/getFiles'

describe('\n getFiles Function', () => {
  it('should loop inside folders and files and return the path', async () => {
    for await (const file of getFiles('tests')) {
      expect(file).toBeTruthy()
    }
  })
})

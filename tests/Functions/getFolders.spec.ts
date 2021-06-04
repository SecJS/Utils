import { getFolders } from '../../src/Functions/getFolders'

describe('\n getFolders Function', () => {
  it('should loop inside folders and files and return the path', async () => {
    const directory = await getFolders('tests', true)

    expect(directory.path).toBeTruthy()
    expect(directory.files).toBeTruthy()
    expect(directory.folders).toBeTruthy()
  })
})

import { getFolders } from '../../src/Functions/getFolders'

describe('\n getFolders Function', () => {
  it('should loop inside folders and files and return the directory', async () => {
    const directory = await getFolders('tests', true)

    expect(directory.path).toBeTruthy()
    expect(directory.files).toBeTruthy()
    expect(directory.folders).toBeTruthy()
  })

  it('should loop inside folders and files and return the directory with buffer', async () => {
    const directory = await getFolders('.', true, false)

    expect(directory.path).toBeTruthy()
    expect(directory.files).toBeTruthy()
    expect(directory.folders).toBeTruthy()
  })
})

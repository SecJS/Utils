import { readFile, unlink } from 'fs/promises'
import { download } from '../../src/Functions/download'

describe('\n download Function', () => {
  it('should download and store a image in the path specified', async () => {
    const url =
      'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/1.png'
    const pathToSave = `${process.cwd()}/tests`
    const imageName = '1.png'

    await download(url, imageName, pathToSave)

    const fileSavedInPath = await readFile(`${pathToSave}/${imageName}`)

    expect(fileSavedInPath).toBeTruthy()

    await unlink(`${pathToSave}/${imageName}`)
  })
})

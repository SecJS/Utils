import { getBranch } from '../../src/Utils/getBranch'

describe('\n getBranch Function', () => {
  it('should return the branch from @secjs/utils', async () => {
    const branch = await getBranch()

    expect(branch).toBeTruthy()
  })
})

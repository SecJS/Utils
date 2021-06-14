import { getCommitId } from '../../src/Functions/getCommitId'

describe('\n getCommitId Function', () => {
  it('should return the last commit id from @secjs/utils', async () => {
    const commitId = await getCommitId()

    expect(commitId).toBeTruthy()
  })
})

import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(require('child_process').exec)

/**
 * Get the actual commit HEAD from the repository
 *
 * @return the commit HEAD id or not a repository
 */
export async function getCommitId(): Promise<string> {
  let commit: string

  try {
    commit = (await exec('git rev-parse HEAD')).stdout.replace('\n', '')
  } catch (error) {
    commit = 'Not a repository'
  }

  return commit
}

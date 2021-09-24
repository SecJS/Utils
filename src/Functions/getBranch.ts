import { promisify } from 'util'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = promisify(require('child_process').exec)

/**
 * Get the actual branch HEAD from the repository
 *
 * @return the branch HEAD name or not a repository
 */
export async function getBranch(): Promise<string> {
  let commit: string

  try {
    commit = (await exec('git branch --show-current')).stdout.replace('\n', '')
  } catch (error) {
    commit = 'Not a repository'
  }

  return commit
}

import { promisify } from 'util'
import { exec as ChildProcessExec } from 'child_process'

const exec = promisify(ChildProcessExec)

/**
 * Get the actual branch HEAD from the repository
 *
 * @return the branch HEAD name or not a repository
 */
export async function getBranch(): Promise<string> {
  let branch: string

  try {
    branch = (await exec('git branch --show-current')).stdout.replace('\n', '')

    if (!branch || branch === '') branch = 'Not a repository'
  } catch (error) {
    branch = 'Not a repository'
  }

  return branch
}
